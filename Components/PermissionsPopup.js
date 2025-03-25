import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
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
import Toast from 'react-native-toast-message'; // Add this import
import locationsImage from "../assets/permissionsImage.png"
import CameraImage from "../assets/permissionscamera.png"
import { ActivityIndicator } from 'react-native';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.5;
const SHEET_OVERFLOW = 20;

const PermissionsPopup = ({ isVisible }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [cameraPermissions, setCameraPermissions] = useState(false);
  const navigation = useNavigation();
  const [loader, setLoading]= useState(false);

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
        Toast.show({
          type: "success",
          text1: "Location Permission Granted",
          text2: "Location Granted Successfully",
          position: "top",
        });
        
        // Show loading state while processing location
        setLoading(true);
        
        try {
          // First check if location services are enabled
          const providerStatus = await Location.getProviderStatusAsync();
          console.log("Provider status:", providerStatus);
          
          if (!providerStatus.locationServicesEnabled) {
            setLoading(false); // Hide loader
            Alert.alert(
              "Location Services Disabled",
              "Please enable location services in your device settings to use this feature.",
              [{ text: "OK" }]
            );
            return;
          }
          
          // Try with simpler options first
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
            mayShowUserSettingsDialog: true
          });
          console.log("Current location:", location);
          
          // Extract longitude and latitude
          const { longitude, latitude } = location.coords;
          
          // Post the location data to API
          try {
            const response = await fetch('https://timemanagementsystemserver.onrender.com/api/validate-location', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                longitude,
                latitude
              }),
            });
            
            // Check if response is valid JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              try {
                const data = await response.json();
                console.log('Location validation response:', data);
                
                // Hide loader after receiving response
                setLoading(false);
                
                // Handle the API response
                if (response.ok) {
                  if (data.allowed === true) {
                    console.log('Location allowed');
                    // If location is allowed, switch to camera permissions
                    setCameraPermissions(true);
                  } else {
                    console.error('Location not allowed:', data.message);
                    Alert.alert(
                      "Location Not Allowed",
                      data.message || "Your location is not supported at this time.",
                      [{ 
                        text: "OK",
                        onPress: () => navigation.navigate("GetStartedScreen")
                      }]
                    );
                  }
                } else {
                  // console.error('Location validation failed:', data);
                  Alert.alert(
                    "Location Validation Failed",
                    data.message || "We couldn't validate your location. Please try again.",
                    [{ 
                      text: "OK",
                      onPress: () => navigation.navigate("GetStartedScreen")
                    }]
                  );
                }
              } catch (jsonError) {
                setLoading(false); // Hide loader
                console.error("Error parsing JSON response:", jsonError);
                Alert.alert(
                  "Response Error",
                  "Received an invalid response from the server. Please try again later.",
                  [{ text: "OK" }]
                );
              }
            } else {
              setLoading(false); // Hide loader
              // Handle non-JSON responses
              const textResponse = await response.text();
              console.error("Non-JSON response received:", textResponse);
              Alert.alert(
                "Server Error",
                "The server returned an unexpected response format. Please try again later.",
                [{ text: "OK" }]
              );
            }
          } catch (apiError) {
            setLoading(false); // Hide loader
            console.error("Error posting location data to API:", apiError);
            Alert.alert(
              "Connection Error",
              "Failed to communicate with our servers. Please check your internet connection and try again.",
              [{ text: "OK" }]
            );
          }
          
        } catch (locationError) {
          setLoading(false); // Hide loader
          console.error("Error getting current position:", locationError);
          
          if (locationError.message.includes("rejected")) {
            Alert.alert(
              "Location Request Rejected",
              "Your device rejected the location request. This might happen if you're in battery saving mode or have restricted background location access.",
              [
                { 
                  text: "Try Again", 
                  onPress: () => requestLocationPermission()
                },
                { 
                  text: "You cannot continue without granting location permission", 
                  onPress: () => navigation.navigate("GetStartedScreen")
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
        Alert.alert(
          "Location Permission", 
          "Please enable location services in your device settings to use this feature",
          [{ 
            text: "OK", 
            onPress: () => navigation.navigate("GetStartedScreen")
          }]
        );
      }
    } catch (error) {
      setLoading(false); // Hide loader in case of any unhandled error
      console.error("Error requesting location permission:", error);
      Alert.alert("Error", "Failed to request location permission");
    }
  };

// Camera Permissions
  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        Toast.show({
          type: "success",
          text1: "Camera Permissions Granted",
          text2: "Camera Permission Granted Successfully",
          position: "top",
        });
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigation.navigate("ScannerScreen");
        }, 3000);
      } else {
        Alert.alert("Camera Permission", "Camera access denied.");
        navigation.navigate("GetStartedScreen");
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert("Error", "Failed to request camera permission");
    }
  };


  if (loader) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }





// Layout UI
  return (
    <View style={styles.container}>
       <Toast/>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
      />

      <View style={styles.toastContainer}>
         <Toast/>
      </View>
      
      <GestureDetector gesture={gesture}>
      
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
        
          <View style={styles.handle} />
          
          <View style={styles.permissionButtonsContainer}>
            {!cameraPermissions ? (
              <>
              <Image source={locationsImage}/>
                <Text style={styles.textcontainer}>
                  Allow CodeTribe to access your
                </Text>
                <Text style={styles.textcontainer}>
                 <Text style={{color:"#8AC052"}}>LOCATION</Text> while you use the scanner?
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
                <Image source={CameraImage}/>
                <Text style={styles.textcontainer}>
                  Allow CodeTribe to access your
                </Text>
                <Text style={styles.textcontainer}>
                  <Text style={{color:"#8AC052"}}>CAMERA</Text> while you use the scanner?
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#b3b3b3',
    borderRadius: 2,
    marginBottom: 20,
  },
  getStartedText: {
    color: '#b3b3b3',
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 52.79,
  },
  textcontainer: {
    color: "#b3b3b3",
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
    height: 50,
    backgroundColor: "#8CE01C",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 6,
    shadowColor: '#8CE01C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  declineButton: {
    width: '100%',
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    // shadowColor: '#8CE01C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  },
toastContainer: {
  position: 'absolute',
  top: 50, 
  left: 0,
  right: 0,
  alignItems: 'center',
  zIndex: 1003, 
},
loadingContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  zIndex:99999
},
});

export default PermissionsPopup;