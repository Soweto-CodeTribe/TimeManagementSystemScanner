import { CameraView } from "expo-camera";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import UserGuestBottomSheet from "../Components/UserGuestbottomsheet";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckinCheckoutbottomsheet from "../Components/CheckinCheckoutbottomsheet";
import Toast from "react-native-toast-message"; // Add this import

export default function ScannerAuth({ navigation }) {
  // Hooks
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  // Handle QR Code Scanned
  async function handleBarcodeScanned({ data }) {
    if (scanned) return; // Prevent scanning if already scanned
    setScanned(true); // Mark as scanned to prevent further scanning
    setLoading(true);

    try {
      const isValid = await verifyQRCode(data);
      if (isValid) {
        const checkIn = Date.now();
        const readableDate = new Date(checkIn);
        console.log(readableDate.toString());

        // Capture location
        let location = null;
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            if (Platform.OS === "android") {
              const isAvailable = await Location.hasServicesEnabledAsync();
              if (!isAvailable) {
                throw new Error(
                  "Location services are not available on this device."
                );
              }
            }
            const loc = await Location.getCurrentPositionAsync({
              enableHighAccuracy: false,
            });
            location = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
          } else {
            Alert.alert(
              "Permission Denied",
              "Location permission is required to check in."
            );
          }
        } catch (error) {
          console.error("Location Error:", error);
          Alert.alert(
            "Location Error",
            error.message || "Could not get location."
          );
        }

        // Save to local storage
        const checkInData = {
          checkInTime: checkIn,
          location,
        };
        await AsyncStorage.setItem("checkInData", JSON.stringify(checkInData));

        // console.log(checkInData);

        // Show toast notification
        Toast.show({
          type: "success",
          text1: "Scanned Successfully",
          text2: "You can now log in to check in",
          position: "top",
        });

        // Important: Make sure this is set to true
        // console.log("Setting bottom sheet visible");
        setIsBottomSheetVisible(true);
      } else {
        Alert.alert("Invalid QR Code", "This QR code is expired or incorrect.");
      }
    } catch (error) {
      console.error("Scan Error:", error);
      Alert.alert("Error", "Invalid QR Code");
    } finally {
      setLoading(false);
    }
  }

  // Close Bottom Sheet
  function closeBottomSheet() {
    setIsBottomSheetVisible(false);
    setScanned(false); // Allow scanning again
  }

  async function verifyQRCode(qrId) {
    try {
      const res = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/QR/verify-QRcode",
        { qrId }
      );
      return res.data.success;
    } catch (error) {
      console.error(
        "QR Code Verification Error:",
        error.response?.data || error
      );
      Alert.alert("QR Code Verification Error:", error.response?.data || error);

      return false;
    }
  }

  useFocusEffect(
    useCallback(() => {
  const isInLocation = async () => {
    try {
      let withInLocation = await AsyncStorage.getItem(
        "inLocationAndVerified"
      );

      if (withInLocation !== "true") {
        Alert.alert(
          "Location Verification", // Title
          "You cannot access the scanner because you are not in the designated location.", // Message
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("HomeScreen"),
              style: "default",
            },
            {
              text: "Revalidate",
              onPress: () => navigation.navigate("PermissionsScreen"),
              style: "default",
            },
          ],
          {
            cancelable: false,
            dialogTitle: "Access Denied",
            dialogMessage: "Location Check Failed",
          }
        );
      }
    } catch (error) {
      console.error(
        "Error retrieving location verification status:",
        error
      );
      Alert.alert("Error retrieving location verification status:", error);
    }
  };

  isInLocation();
}, [navigation])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="close" size={24} color="red" />
        </TouchableOpacity> */}
        <Text style={styles.headerText}>Scan QR Code</Text>
      </View>

      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        zoom={0.2} // Slight zoom to focus on the center
      >
        {/* QR Code Overlay */}
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
      </CameraView>

      {/* Add debugging info to verify bottom sheet state */}
      {/* <Text style={styles.debugText}>
        Bottom Sheet State: {isBottomSheetVisible ? 'Visible' : 'Hidden'}
      </Text> */}

      <CheckinCheckoutbottomsheet
        isVisible={isBottomSheetVisible}
        closeBottomSheet={closeBottomSheet}
      />

      {/* Toast component needs to be at the root level */}
      <View style={styles.toastContainer}>
        <Toast />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  debugText: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: 5,
  },
  toastContainer: {
    zIndex: 10,
  },
});
