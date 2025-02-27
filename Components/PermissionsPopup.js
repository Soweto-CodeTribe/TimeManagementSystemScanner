import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Location from "expo-location";
import { Alert } from 'react-native';
import { Camera } from "expo-camera";
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.5;
const SHEET_OVERFLOW = 20;

const PermissionsPopup = ({ isVisible }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [cameraPermissions, setCameraPermissions] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isVisible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90
      });
    }
  }, [isVisible]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90
      });
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));


// Locations Function
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Alert.alert("Location Permission", "Location access granted.");
        setCameraPermissions(true);
        
        try {
          // First check if location services are enabled before trying to get position
          const providerStatus = await Location.getProviderStatusAsync();
          console.log("Provider status:", providerStatus);
          
          if (!providerStatus.locationServicesEnabled) {
            Alert.alert(
              "Location Services Disabled",
              "Please enable location services in your device settings to use this feature.",
              [{ text: "OK" }]
            );
            return; // Exit early if location services are disabled
          }
          
          // Try with simpler options first
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low, // Try with lower accuracy first
            mayShowUserSettingsDialog: true
          });
          console.log("Current location:", location);
          
        } catch (locationError) {
          console.error("Error getting current position:", locationError);
          
          if (locationError.message.includes("rejected")) {
            Alert.alert(
              "Location Request Rejected",
              "Your device rejected the location request. This might happen if you're in battery saving mode or have restricted background location access.",
              [
                { 
                  text: "Try Again", 
                  onPress: () => requestLocationPermission() // Retry the location request
                },
                { 
                  text: "You cannot continue without granting location permission", 
                  onPress: () =>  navigation.navigate("GetStartedScreen")
                }
              ]
            );
           
          } else {
            // Handle other location errors
            Alert.alert(
              "Location Error",
              "Unable to get your current location. Please try again later.",
              [{ text: "OK" }]
            );
          }
        }
      } else {
        Alert.alert("Location Permission", "Please enable location services in your device settings to use this feature");
        navigation.navigate("GetStartedScreen");
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert("Error", "Failed to request location permission");
    }
  };




// Camera Permissions
  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        Alert.alert("Camera Permission", "Camera access granted.");
        setTimeout(() => {
          navigation.navigate("ScannerScreen");
        }, 2000);
      } else {
        Alert.alert("Camera Permission", "Camera access denied.");
        navigation.navigate("GetStartedScreen");
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert("Error", "Failed to request camera permission");
    }
  };



// Layout UI
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          <Text style={styles.getStartedText}>Get Started</Text>
          
          <View style={styles.permissionButtonsContainer}>
            {!cameraPermissions ? (
              <>
                <Text style={styles.textcontainer}>
                  Allow CodeTribe to access your
                </Text>
                <Text style={styles.textcontainer}>
                  location while you use the scanner?
                </Text>
                
                <View style={styles.buttonsContainer}>
                  <Pressable 
                    style={({pressed}) => [
                      styles.acceptButton,
                      pressed && {opacity: 0.8}
                    ]}
                    onPress={requestLocationPermission}
                    android_ripple={{color: 'rgba(255, 255, 255, 0.3)'}}
                  >
                    <Text style={styles.buttontextAccept}>Accept</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={({pressed}) => [
                      styles.declineButton,
                      pressed && {opacity: 0.8}
                    ]}
                    onPress={() => navigation.navigate("GetStartedScreen")}
                    android_ripple={{color: 'rgba(0, 0, 0, 0.1)'}}
                  >
                    <Text style={styles.buttontextDecline}>Decline</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.textcontainer}>
                  Allow CodeTribe to access your
                </Text>
                <Text style={styles.textcontainer}>
                  camera while you use the scanner?
                </Text>

                <View style={styles.buttonsContainer}>
                  <Pressable 
                    style={({pressed}) => [
                      styles.acceptButton,
                      pressed && {opacity: 0.8}
                    ]}
                    onPress={requestCameraPermission}
                    android_ripple={{color: 'rgba(255, 255, 255, 0.3)'}}
                  >
                    <Text style={styles.buttontextAccept}>Accept</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={({pressed}) => [
                      styles.declineButton,
                      pressed && {opacity: 0.8}
                    ]}
                    onPress={() => navigation.navigate("GetStartedScreen")}
                    android_ripple={{color: 'rgba(0, 0, 0, 0.1)'}}
                  >
                    <Text style={styles.buttontextDecline}>Decline</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: -SHEET_OVERFLOW,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingBottom: SHEET_OVERFLOW + 20,
    height: SHEET_HEIGHT + SHEET_OVERFLOW,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 1002,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ffffff40',
    borderRadius: 2,
    marginBottom: 20,
  },
  getStartedText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 52.79,
  },
  textcontainer: {
    color: "white",
    fontWeight: "400",
    lineHeight: 21.3,
    fontSize: 17,
    textAlign: 'center',
  },
  permissionButtonsContainer: {
    marginTop: 20,
    width: width - 40,
    alignItems: 'center',
  },
  acceptButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#8AC052",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  declineButton: {
    width: '100%',
    height: 44,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttontextDecline: {
    color: 'black',
    fontSize: 17,
    fontWeight: '600',
  },
  buttontextAccept: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 40,
  }
});

export default PermissionsPopup;