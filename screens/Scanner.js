import { CameraView } from "expo-camera";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import UserGuestBottomSheet from "../Components/UserGuestbottomsheet";
import Toast from "react-native-toast-message";
import {
  verifyQRCode,
  captureLocation,
  resetScan,
  setBottomSheetVisible,
} from "../Components/Redux/Slices/ScanSlice.js";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";

export default function ScannerScreen({ navigation }) {
  // Redux hooks
  const dispatch = useDispatch();
  const { scanned, loading, error, isBottomSheetVisible, checkInData } =
    useSelector((state) => state.scan);

  // Component state
  const [facing] = useState("back");
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isHuawei, setIsHuawei] = useState(false);

  // Utility function to detect Huawei devices
  const detectHuaweiDevice = () => {
    const brand = Platform.constants?.Brand?.toLowerCase() || "";
    const manufacturer = Platform.constants?.Manufacturer?.toLowerCase() || "";
    return (
      brand.includes("huawei") ||
      brand.includes("honor") ||
      manufacturer.includes("huawei") ||
      manufacturer.includes("honor")
    );
  };

  // Function to open app settings
  const openAppSettings = async () => {
    try {
      if (Platform.OS === "android") {
        // For Android devices, open app-specific settings
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          {
            data: "package:" + "com.mlab.Codetribe", // Replace with your actual package name
          }
        );
      } else {
        // For iOS
        await Linking.openSettings();
      }
    } catch (error) {
      console.error("Error opening settings:", error);
      // Fallback to general settings
      try {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.SETTINGS
        );
      } catch (fallbackError) {
        Alert.alert(
          "Unable to Open Settings",
          "Please manually go to Settings > Apps > Time Management Scanner > Permissions and enable Location access."
        );
      }
    }
  };

  // Function to open location settings specifically
  const openLocationSettings = async () => {
    try {
      if (Platform.OS === "android") {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
        );
      }
    } catch (error) {
      console.error("Error opening location settings:", error);
      await openAppSettings();
    }
  };

  // Enhanced permission request with Huawei handling
  const requestLocationPermissionWithFallback = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        return { granted: true };
      }

      // Check if this is a Huawei device
      const isHuaweiDev = detectHuaweiDevice();
      setIsHuawei(isHuaweiDev);

      if (status === "denied" && isHuaweiDev) {
        // For Huawei devices, the permission dialog might not show
        // Show custom dialog explaining the issue
        return new Promise((resolve) => {
          Alert.alert(
            "Location Permission Required",
            "This device requires manual permission setup. Please enable location access in settings to continue.",
            [
              {
                text: "Cancel",
                onPress: () => resolve({ granted: false, userCancelled: true }),
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: async () => {
                  await openAppSettings();
                  resolve({ granted: false, openedSettings: true });
                },
              },
            ]
          );
        });
      }

      // For other devices with denied permission
      return new Promise((resolve) => {
        Alert.alert(
          "Location Permission Required",
          "Location access is required to use the scanner. Please grant permission in the next dialog or go to settings.",
          [
            {
              text: "Cancel",
              onPress: () => resolve({ granted: false, userCancelled: true }),
              style: "cancel",
            },
            {
              text: "Try Again",
              onPress: async () => {
                const retryResult =
                  await Location.requestForegroundPermissionsAsync();
                resolve({ granted: retryResult.status === "granted" });
              },
            },
            {
              text: "Open Settings",
              onPress: async () => {
                await openAppSettings();
                resolve({ granted: false, openedSettings: true });
              },
            },
          ]
        );
      });
    } catch (error) {
      console.error("Permission request error:", error);
      return { granted: false, error: error.message };
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkAndValidateLocation = async () => {
        setIsCheckingLocation(true);
        setIsLocationValid(false);
        setPermissionDenied(false);

        try {
          // 1. Enhanced permission request
          const permissionResult =
            await requestLocationPermissionWithFallback();

          if (!permissionResult.granted) {
            if (permissionResult.openedSettings) {
              // User went to settings, show waiting message
              setPermissionDenied(true);
              setIsCheckingLocation(false);
              return;
            } else if (permissionResult.userCancelled) {
              // User cancelled, navigate back
              navigation.navigate("MainApp");
              return;
            } else {
              // Permission denied
              setPermissionDenied(true);
              setIsCheckingLocation(false);
              return;
            }
          }

          // 2. Check if location services are enabled
          const providerStatus = await Location.getProviderStatusAsync();
          if (!providerStatus.locationServicesEnabled) {
            Alert.alert(
              "Location Services Disabled",
              "Please enable location services in your device settings.",
              [
                {
                  text: "Cancel",
                  onPress: () => navigation.navigate("MainApp"),
                  style: "cancel",
                },
                {
                  text: "Open Settings",
                  onPress: async () => {
                    await openLocationSettings();
                    setPermissionDenied(true);
                    setIsCheckingLocation(false);
                  },
                },
              ]
            );
            return;
          }

          // 3. Get current location
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
            mayShowUserSettingsDialog: true,
          });
          const { longitude, latitude } = location.coords;

          // 4. Validate location with backend
          const response = await fetch(
            "https://timemanagementsystemserver.onrender.com/api/validate-location",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ longitude, latitude }),
            }
          );

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (response.ok && data.allowed === true) {
              await AsyncStorage.setItem("inLocationAndVerified", "true");
              setIsLocationValid(true);
              setIsCheckingLocation(false);
              return;
            } else {
              await AsyncStorage.setItem("inLocationAndVerified", "false");
              Alert.alert(
                "Location Not Allowed",
                data.message || "You are not in the check-in location!",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate("MainApp"),
                  },
                ]
              );
              setIsCheckingLocation(false);
              return;
            }
          } else {
            Alert.alert(
              "Server Error",
              "The server returned an unexpected response format. Please try again later.",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("MainApp"),
                },
              ]
            );
            setIsCheckingLocation(false);
            return;
          }
        } catch (error) {
          console.error("Location validation error:", error);
          Alert.alert(
            "Location Error",
            error.message ||
              "Unable to get your current location. Please try again later.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("MainApp"),
              },
            ]
          );
          setIsCheckingLocation(false);
        }
      };

      checkAndValidateLocation();

      return () => {
        setIsLocationValid(false);
        setIsCheckingLocation(true);
        setPermissionDenied(false);
      };
    }, [navigation])
  );

  async function handleBarcodeScanned({ data }) {
    if (scanned || !isLocationValid) return;

    try {
      const resultAction = await dispatch(verifyQRCode(data));

      if (verifyQRCode.fulfilled.match(resultAction)) {
        const locationResult = await dispatch(captureLocation());

        if (captureLocation.fulfilled.match(locationResult)) {
          Toast.show({
            type: "success",
            text1: "Scanned Successfully",
            text2: "You can now log in to check in",
            position: "top",
            zIndex: 99999,
          });
        } else if (captureLocation.rejected.match(locationResult)) {
          Alert.alert(
            "Location Error",
            locationResult.payload || "Could not get location."
          );
        }
      } else if (verifyQRCode.rejected.match(resultAction)) {
        Alert.alert("Invalid QR Code", "This QR code is expired or incorrect.");
      }
    } catch (err) {
      console.error("Scan Error:", err);
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  const closeBottomSheet = () => {
    dispatch(setBottomSheetVisible(false));
    dispatch(resetScan());
  };

  const handleRetryPermission = async () => {
    setIsCheckingLocation(true);
    setPermissionDenied(false);

    // Re-run the location check
    const checkResult = await checkAndValidateLocation();
  };

  // Show loading screen while checking location
  if (isCheckingLocation) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Toast />
        <Text style={styles.loadingText}>Validating location...</Text>
        {isHuawei && (
          <Text style={styles.huaweiText}>
            Huawei device detected - manual setup may be required
          </Text>
        )}
      </View>
    );
  }

  // Show permission denied screen
  if (permissionDenied) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Toast />
        <AntDesign name="exclamationcircleo" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Location Permission Required</Text>
        <Text style={styles.errorDescription}>
          {isHuawei
            ? "Huawei/Honor devices require manual permission setup. Please enable location access in Settings > Apps > [App Name] > Permissions"
            : "Please enable location permission to use the scanner"}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openAppSettings}
          >
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRetryPermission}
          >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("MainApp")}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show error screen if location is not valid
  if (!isLocationValid) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Toast />
        <Text style={styles.errorText}>Location not validated</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render scanner only if location is valid
  return (
    <View style={styles.container}>
      <Toast />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="close" size={24} color="red" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Scan QR Code</Text>
      </View>

      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        zoom={0.2}
      >
        <View style={styles.overlay}>
          <View style={styles.frame} />
          {loading && (
            <BlurView
              style={styles.blurOverlay}
              blurType="light"
              blurAmount={5}
            >
              <Text style={styles.loadingText}>Processing...</Text>
            </BlurView>
          )}
        </View>

        <UserGuestBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}
          checkInData={checkInData}
        />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    padding: 8,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  huaweiText: {
    color: "#FFA500",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  errorTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  errorDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
