import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, Platform, Linking } from 'react-native';
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
import Toast from 'react-native-toast-message';
import locationsImage from "../assets/permissionsImage.png"
import CameraImage from "../assets/permissionscamera.png"
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as IntentLauncher from 'expo-intent-launcher';

// HMS Location import for Huawei devices
let HMSLocation = null;
try {
  HMSLocation = require('@hmscore/react-native-hms-location');
} catch (error) {
  console.log('HMS Location not available:', error);
}

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.5;
const SHEET_OVERFLOW = 20;

const PermissionsPopup = ({ isVisible }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [cameraPermissions, setCameraPermissions] = useState(false);
  const [locationPermissions, setLocationPermissions] = useState(false);
  const navigation = useNavigation();
  const [loader, setLoading] = useState(false);
  const [checkedPermissions, setCheckedPermissions] = useState(false);
  const [isHuawei, setIsHuawei] = useState(false);
  const [showManualLocationSetup, setShowManualLocationSetup] = useState(false);
  const [showManualCameraSetup, setShowManualCameraSetup] = useState(false);
  const [hmsAvailable, setHmsAvailable] = useState(false);

  // Enhanced Huawei device detection (only Huawei, no Honor)
  const detectHuaweiDevice = () => {
    const brand = Platform.constants?.Brand?.toLowerCase() || '';
    const manufacturer = Platform.constants?.Manufacturer?.toLowerCase() || '';
    const model = Platform.constants?.Model?.toLowerCase() || '';
    
    return brand.includes('huawei') || 
           manufacturer.includes('huawei') ||
           model.includes('huawei');
  };

  // Initialize HMS Location for Huawei devices
  const initializeHMSLocation = async () => {
    if (!isHuawei || !HMSLocation) {
      return false;
    }

    try {
      // Check if HMS Location is available
      const isAvailable = await HMSLocation.HMSLocationKit.LocationKit.isLocationAvailable();
      console.log('HMS Location available:', isAvailable);
      
      if (isAvailable) {
        // Initialize HMS Location Kit
        await HMSLocation.HMSLocationKit.LocationKit.init();
        setHmsAvailable(true);
        return true;
      }
    } catch (error) {
      console.error('HMS Location initialization error:', error);
    }
    
    return false;
  };

  // Function to open app settings
  const openAppSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          {
            data: 'package:' + 'com.mlab.Codetribe', // Replace with your actual package name
          }
        );
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      try {
        await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.SETTINGS);
      } catch (fallbackError) {
        Alert.alert(
          'Unable to Open Settings',
          'Please manually go to Settings > Apps > Time Management Scanner > Permissions and enable the required permissions.'
        );
      }
    }
  };

  // HMS Location permission request for Huawei devices
  const requestHMSLocationPermission = async () => {
    if (!HMSLocation || !hmsAvailable) {
      console.log('HMS Location not available');
      return false;
    }

    try {
      // Check current permission status
      const hasPermission = await HMSLocation.HMSLocationKit.FusedLocation.hasPermission();
      console.log('HMS Location permission status:', hasPermission);

      if (hasPermission) {
        return true;
      }

      // Request location permission
      const permissionResult = await HMSLocation.HMSLocationKit.FusedLocation.requestPermission();
      console.log('HMS Location permission result:', permissionResult);

      return permissionResult === 0; // 0 means permission granted
    } catch (error) {
      console.error('HMS Location permission request error:', error);
      return false;
    }
  };

  // Get location using HMS Location for Huawei devices
  const getHMSLocation = async () => {
    if (!HMSLocation || !hmsAvailable) {
      throw new Error('HMS Location not available');
    }

    try {
      // Create location request
      const locationRequest = {
        priority: HMSLocation.HMSLocationKit.LocationRequest.PRIORITY_HIGH_ACCURACY,
        interval: 10000,
        numUpdates: 1,
        fastestInterval: 5000,
        expirationTime: 30000,
      };

      // Get last known location first (faster)
      try {
        const lastLocation = await HMSLocation.HMSLocationKit.FusedLocation.getLastLocation();
        if (lastLocation && lastLocation.latitude && lastLocation.longitude) {
          console.log('HMS Last known location:', lastLocation);
          return {
            coords: {
              latitude: lastLocation.latitude,
              longitude: lastLocation.longitude,
              accuracy: lastLocation.accuracy || 0,
            }
          };
        }
      } catch (lastLocationError) {
        console.log('HMS Last location not available:', lastLocationError);
      }

      // If no last location, request current location
      return new Promise((resolve, reject) => {
        const locationCallback = {
          onLocationResult: (locationResult) => {
            console.log('HMS Location result:', locationResult);
            if (locationResult && locationResult.locations && locationResult.locations.length > 0) {
              const location = locationResult.locations[0];
              resolve({
                coords: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  accuracy: location.accuracy || 0,
                }
              });
            } else {
              reject(new Error('No location data received'));
            }
          },
          onLocationAvailability: (locationAvailability) => {
            console.log('HMS Location availability:', locationAvailability);
            if (!locationAvailability.isLocationAvailable) {
              reject(new Error('Location services not available'));
            }
          }
        };

        // Request location updates
        HMSLocation.HMSLocationKit.FusedLocation.requestLocationUpdates(locationRequest, locationCallback)
          .then(() => {
            console.log('HMS Location request started');
            // Set timeout to stop location updates after getting result
            setTimeout(() => {
              HMSLocation.HMSLocationKit.FusedLocation.removeLocationUpdates(locationCallback)
                .catch(error => console.log('Error removing HMS location updates:', error));
            }, 30000);
          })
          .catch(error => {
            console.error('HMS Location request error:', error);
            reject(error);
          });
      });

    } catch (error) {
      console.error('HMS Location error:', error);
      throw error;
    }
  };

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const locPerm = await AsyncStorage.getItem('locationPermissionGranted');
        const camPerm = await AsyncStorage.getItem('cameraPermissionGranted');
        setLocationPermissions(locPerm === 'true');
        setCameraPermissions(camPerm === 'true');
        
        const huaweiDevice = detectHuaweiDevice();
        setIsHuawei(huaweiDevice);
        
        // Initialize HMS Location for Huawei devices
        if (huaweiDevice) {
          await initializeHMSLocation();
        }
      } catch (e) {
        setLocationPermissions(false);
        setCameraPermissions(false);
      } finally {
        setCheckedPermissions(true);
      }
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    if (isVisible && checkedPermissions) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90
      });
    }
  }, [isVisible, checkedPermissions]);

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

  // Enhanced location permission request with Expo first, then HMS fallback
  const requestLocationPermissionWithFallback = async () => {
    let permissionGranted = false;
    let locationMethod = 'none';
    let needsManualSetup = false;

    try {
      // Always try Expo Location first
      console.log('Attempting Expo Location permission request');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        console.log('Expo Location permission granted');
        permissionGranted = true;
        locationMethod = 'expo';
      } else {
        console.log('Expo Location permission denied:', status);
        
        // If Expo fails and this is a Huawei device, try HMS
        if (isHuawei && hmsAvailable) {
          console.log('Trying HMS Location as fallback');
          const hmsPermissionGranted = await requestHMSLocationPermission();
          
          if (hmsPermissionGranted) {
            console.log('HMS Location permission granted');
            permissionGranted = true;
            locationMethod = 'hms';
          } else {
            console.log('HMS Location permission also denied');
            needsManualSetup = true;
          }
        } else {
          // Not Huawei or HMS not available
          needsManualSetup = true;
        }
      }

      if (permissionGranted) {
        return { granted: true, method: locationMethod };
      }

      // Permission denied, show appropriate alert
      if (needsManualSetup) {
        return new Promise((resolve) => {
          const deviceInfo = isHuawei ? 'Huawei devices may require manual permission setup.' : '';
          Alert.alert(
            "Location Permission Required",
            `Location access is required to use the scanner. ${deviceInfo}`,
            [
              {
                text: "Cancel",
                onPress: () => resolve({ granted: false, userCancelled: true }),
                style: "cancel"
              },
              {
                text: "Try Again",
                onPress: async () => {
                  const retryResult = await requestLocationPermissionWithFallback();
                  resolve(retryResult);
                }
              },
              {
                text: "Open Settings",
                onPress: async () => {
                  await openAppSettings();
                  setShowManualLocationSetup(true);
                  resolve({ granted: false, openedSettings: true });
                }
              }
            ]
          );
        });
      }

    } catch (error) {
      console.error('Location permission request error:', error);
      return { granted: false, error: error.message };
    }

    return { granted: false };
  };

  // Enhanced camera permission request
  const requestCameraPermissionWithFallback = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        return { granted: true };
      }
      
      // Permission denied, show appropriate alert based on device type
      return new Promise((resolve) => {
        const deviceInfo = isHuawei ? 'Huawei devices may require manual permission setup.' : '';
        Alert.alert(
          "Camera Permission Required",
          `Camera access is required to use the scanner. ${deviceInfo}`,
          [
            {
              text: "Cancel",
              onPress: () => resolve({ granted: false, userCancelled: true }),
              style: "cancel"
            },
            {
              text: "Try Again",
              onPress: async () => {
                const retryResult = await Camera.requestCameraPermissionsAsync();
                resolve({ granted: retryResult.status === 'granted' });
              }
            },
            {
              text: "Open Settings",
              onPress: async () => {
                await openAppSettings();
                setShowManualCameraSetup(true);
                resolve({ granted: false, openedSettings: true });
              }
            }
          ]
        );
      });
      
    } catch (error) {
      console.error('Camera permission request error:', error);
      return { granted: false, error: error.message };
    }
  };

  // Get current location with Expo first, then HMS fallback
  const getCurrentLocation = async (method) => {
    if (method === 'expo') {
      try {
        console.log('Getting location using Expo Location');
        
        // First check if location services are enabled
        const providerStatus = await Location.getProviderStatusAsync();
        console.log("Expo provider status:", providerStatus);
        
        if (!providerStatus.locationServicesEnabled) {
          throw new Error('Location services are disabled');
        }
        
        // Get current position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          mayShowUserSettingsDialog: true,
          timeout: 15000,
        });
        
        console.log('Expo location success:', location);
        return location;
        
      } catch (expoError) {
        console.error('Expo Location failed:', expoError);
        
        // If Expo fails and we have HMS available, try HMS as fallback
        if (isHuawei && hmsAvailable) {
          console.log('Falling back to HMS Location');
          try {
            const hmsLocation = await getHMSLocation();
            console.log('HMS location fallback success:', hmsLocation);
            return hmsLocation;
          } catch (hmsError) {
            console.error('HMS Location fallback also failed:', hmsError);
            throw new Error(`Both Expo and HMS location failed. Expo: ${expoError.message}, HMS: ${hmsError.message}`);
          }
        } else {
          throw expoError;
        }
      }
    } else if (method === 'hms' && isHuawei && hmsAvailable) {
      // Use HMS Location directly
      console.log('Getting location using HMS Location');
      return await getHMSLocation();
    } else {
      throw new Error('Invalid location method or HMS not available');
    }
  };

  // Enhanced location permission function
  const requestLocationPermission = async () => {
    try {
      const permissionResult = await requestLocationPermissionWithFallback();
      
      if (!permissionResult.granted) {
        if (permissionResult.openedSettings) {
          // User went to settings, don't navigate away yet
          return;
        } else if (permissionResult.userCancelled) {
          // User cancelled
          await AsyncStorage.setItem('locationPermissionGranted', 'false');
          setLocationPermissions(false);
          navigation.navigate("GetStartedScreen");
          return;
        } else {
          // Permission denied
          await AsyncStorage.setItem('locationPermissionGranted', 'false');
          setLocationPermissions(false);
          Alert.alert(
            "Location Permission", 
            "Please enable location services in your device settings to use this feature",
            [{ 
              text: "OK", 
              onPress: () => navigation.navigate("GetStartedScreen")
            }]
          );
          return;
        }
      }

      // Permission granted, continue with location retrieval
      await AsyncStorage.setItem('locationPermissionGranted', 'true');
      setLocationPermissions(true);
      setShowManualLocationSetup(false);
      
      const methodInfo = permissionResult.method === 'hms' ? ' (HMS Fallback)' : ' (Expo)';
      Toast.show({
        type: "success",
        text1: "Location Permission Granted",
        text2: `Location Granted Successfully${methodInfo}`,
        position: "top",
      });
      
      // Show loading state while processing location
      setLoading(true);
      
      try {
        // Get current location using appropriate method
        const location = await getCurrentLocation(permissionResult.method);
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
              latitude,
              method: permissionResult.method,
              isHuawei: isHuawei,
              accuracy: location.coords.accuracy || 0
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
                  await AsyncStorage.setItem("inLocationAndVerified", "true");
                  // If location is allowed, switch to camera permissions
                  setCameraPermissions(false);
                } else {
                  console.error('Location not allowed:', data.message);
                  Alert.alert(
                    "Location Not Allowed",
                    data.message || "Your location is not supported at this time.",
                    [{ 
                      text: "OK",
                      onPress: () => navigation.navigate("TraineeLoginScreen")
                    }]
                  );
                }
              } else {
                Alert.alert(
                  "Location Validation Failed",
                  data.message || "We couldn't validate your location. Please try again.",
                  [{ 
                    text: "OK",
                    onPress: () => navigation.navigate("TraineeLoginScreen")
                  }]
                );
              }
            } catch (jsonError) {
              setLoading(false);
              console.error("Error parsing JSON response:", jsonError);
              Alert.alert(
                "Response Error",
                "Received an invalid response from the server. Please try again later.",
                [{ text: "OK" }]
              );
            }
          } else {
            setLoading(false);
            const textResponse = await response.text();
            console.error("Non-JSON response received:", textResponse);
            Alert.alert(
              "Server Error",
              "The server returned an unexpected response format. Please try again later.",
              [{ text: "OK" }]
            );
          }
        } catch (apiError) {
          setLoading(false);
          console.error("Error posting location data to API:", apiError);
          Alert.alert(
            "Connection Error",
            "Failed to communicate with our servers. Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        }
        
      } catch (locationError) {
        setLoading(false);
        console.error("Error getting current position:", locationError);
        
        const errorMessage = locationError.message || '';
        
        if (errorMessage.includes("rejected") || errorMessage.includes("denied")) {
          Alert.alert(
            "Location Request Rejected",
            `Your device rejected the location request. ${isHuawei ? 'This might happen on Huawei devices due to power management settings.' : 'This might happen if you\'re in battery saving mode.'}`,
            [
              { 
                text: "Try Again", 
                onPress: () => requestLocationPermission()
              },
              { 
                text: "Cancel", 
                onPress: () => navigation.navigate("GetStartedScreen")
              }
            ]
          );
        } else if (errorMessage.includes("Location services are disabled")) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to use this feature.",
            [{ text: "OK" }]
          );
        } else if (errorMessage.includes("Both Expo and HMS")) {
          Alert.alert(
            "Location Error",
            "Unable to get your location using any available method. Please ensure location services are enabled and try again.",
            [
              { 
                text: "Try Again", 
                onPress: () => requestLocationPermission()
              },
              { 
                text: "Cancel", 
                onPress: () => navigation.navigate("GetStartedScreen")
              }
            ]
          );
        } else {
          Alert.alert(
            "Location Error",
            `Unable to get your current location. ${isHuawei ? 'Huawei devices may require additional setup.' : ''} Please try again later.`,
            [
              { 
                text: "Try Again", 
                onPress: () => requestLocationPermission()
              },
              { 
                text: "Cancel", 
                onPress: () => navigation.navigate("GetStartedScreen")
              }
            ]
          );
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error requesting location permission:", error);
      Alert.alert(
        "Permission Error", 
        "Failed to request location permission. Please try again.",
        [
          { 
            text: "Try Again", 
            onPress: () => requestLocationPermission()
          },
          { 
            text: "Cancel", 
            onPress: () => navigation.navigate("GetStartedScreen")
          }
        ]
      );
    }
  };

  // Enhanced camera permission function
  const requestCameraPermission = async () => {
    try {
      const permissionResult = await requestCameraPermissionWithFallback();
      
      if (!permissionResult.granted) {
        if (permissionResult.openedSettings) {
          // User went to settings, don't navigate away yet
          return;
        } else if (permissionResult.userCancelled) {
          // User cancelled
          await AsyncStorage.setItem('cameraPermissionGranted', 'false');
          setCameraPermissions(false);
          navigation.navigate("GetStartedScreen");
          return;
        } else {
          // Permission denied
          await AsyncStorage.setItem('cameraPermissionGranted', 'false');
          setCameraPermissions(false);
          Alert.alert("Camera Permission", "Camera access denied.");
          navigation.navigate("GetStartedScreen");
          return;
        }
      }

      // Permission granted, continue with original logic
      await AsyncStorage.setItem('cameraPermissionGranted', 'true');
      setCameraPermissions(true);
      setShowManualCameraSetup(false);
      
      Toast.show({
        type: "success",
        text1: "Camera Permissions Granted",
        text2: "Camera Permission Granted Successfully",
        position: "top",
      });
      
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("TraineeLoginScreen");
      }, 3000);
      
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert(
        "Camera Permission Error", 
        "Failed to request camera permission. Please try again.",
        [
          { 
            text: "Try Again", 
            onPress: () => requestCameraPermission()
          },
          { 
            text: "Cancel", 
            onPress: () => navigation.navigate("GetStartedScreen")
          }
        ]
      );
    }
  };

  // Function to retry permission after manual setup
  const retryLocationPermission = async () => {
    setShowManualLocationSetup(false);
    
    try {
      // Check both Expo and HMS permissions
      let hasExpoPermission = false;
      let hasHMSPermission = false;
      
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        hasExpoPermission = status === 'granted';
      } catch (error) {
        console.log('Error checking Expo permission:', error);
      }
      
      if (isHuawei && hmsAvailable && HMSLocation) {
        try {
          hasHMSPermission = await HMSLocation.HMSLocationKit.FusedLocation.hasPermission();
        } catch (error) {
          console.log('Error checking HMS permission:', error);
        }
      }
      
      if (hasExpoPermission || hasHMSPermission) {
        await requestLocationPermission();
      } else {
        Alert.alert(
          "Permission Still Required",
          "Location permission is still not granted. Please enable it in Settings > Apps > [App Name] > Permissions.",
          [
            {
              text: "Open Settings Again",
              onPress: openAppSettings
            },
            {
              text: "Cancel",
              onPress: () => navigation.navigate("GetStartedScreen")
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert(
        "Error",
        "Unable to check permission status. Please try again.",
        [
          {
            text: "Open Settings",
            onPress: openAppSettings
          },
          {
            text: "Cancel",
            onPress: () => navigation.navigate("GetStartedScreen")
          }
        ]
      );
    }
  };

  const retryCameraPermission = async () => {
    setShowManualCameraSetup(false);
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      if (status === 'granted') {
        await requestCameraPermission();
      } else {
        Alert.alert(
          "Permission Still Required",
          "Camera permission is still not granted. Please enable it in Settings > Apps > [App Name] > Permissions.",
          [
            {
              text: "Open Settings Again",
              onPress: openAppSettings
            },
            {
              text: "Cancel",
              onPress: () => navigation.navigate("GetStartedScreen")
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      Alert.alert(
        "Error",
        "Unable to check camera permission status. Please try again.",
        [
          {
            text: "Open Settings",
            onPress: openAppSettings
          },
          {
            text: "Cancel",
            onPress: () => navigation.navigate("GetStartedScreen")
          }
        ]
      );
    }
  };

  if (loader) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
        <Text style={styles.loadingText}>
          {isHuawei ? 'Processing with Enhanced Location Services...' : 'Processing location...'}
        </Text>
      </View>
    );
  }

  // Only show popup if permissions are not granted
  if (!isVisible || !checkedPermissions || (locationPermissions && cameraPermissions)) {
    return null;
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
            {!locationPermissions ? (
              <>
                <Image source={locationsImage}/>
                <Text style={styles.textcontainer}>
                  Allow CodeTribe to access your
                </Text>
                <Text style={styles.textcontainer}>
                  <Text style={{color:"#8AC052"}}>LOCATION</Text> while you use the scanner?
                </Text>
                
                {isHuawei && (
                  <View style={styles.huaweiInfoContainer}>
                    <Text style={styles.huaweiWarning}>
                      🔧 Huawei/Honor device detected
                    </Text>
                    <Text style={styles.huaweiInfo}>
                      {hmsAvailable ? 'Using HMS Location Services' : 'HMS Location not available - using standard method'}
                    </Text>
                  </View>
                )}
                
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
                    onPress={async () => {
                      await AsyncStorage.setItem('locationPermissionGranted', 'false');
                      setLocationPermissions(false);
                      navigation.navigate("GetStartedScreen");
                    }}
                    android_ripple={{color: 'rgba(0, 0, 0, 0.1)'}}
                  >
                    <Text style={styles.buttontextDecline}>Decline</Text>
                  </Pressable>
                </View>

                {showManualLocationSetup && (
                  <View style={styles.manualSetupContainer}>
                    <Text style={styles.manualSetupText}>
                      Return here after enabling location permission in Settings
                    </Text>
                    <Pressable 
                      style={styles.retryButton}
                      onPress={retryLocationPermission}
                    >
                      <Text style={styles.retryButtonText}>I've Enabled Permission</Text>
                    </Pressable>
                  </View>
                )}
              </>
            ) : !cameraPermissions ? (
              <>
                <Image source={CameraImage}/>
                <Text style={styles.textcontainer}>
                  Allow CodeTribe to access your
                </Text>
                <Text style={styles.textcontainer}>
                  <Text style={{color:"#8AC052"}}>CAMERA</Text> while you use the scanner?
                </Text>

                {isHuawei && (
                  <Text style={styles.huaweiWarning}>
                    🔧 Huawei/Honor device detected - manual setup may be required
                  </Text>
                )}

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
                    onPress={async () => {
                      await AsyncStorage.setItem('cameraPermissionGranted', 'false');
                      setCameraPermissions(false);
                      navigation.navigate("GetStartedScreen");
                    }}
                    android_ripple={{color: 'rgba(0, 0, 0, 0.1)'}}
                  >
                    <Text style={styles.buttontextDecline}>Decline</Text>
                  </Pressable>
                </View>

                {showManualCameraSetup && (
                  <View style={styles.manualSetupContainer}>
                    <Text style={styles.manualSetupText}>
                      Return here after enabling camera permission in Settings
                    </Text>
                    <Pressable 
                      style={styles.retryButton}
                      onPress={retryCameraPermission}
                    >
                      <Text style={styles.retryButtonText}>I've Enabled Permission</Text>
                    </Pressable>
                  </View>
                )}
              </>
            ) : null}
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
  huaweiInfoContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  huaweiWarning: {
    fontSize: 12,
    textAlign: 'center',
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  huaweiInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
    fontStyle: 'italic',
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
    zIndex: 99999
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  manualSetupContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0EA5E9',
    width: '100%',
  },
  manualSetupText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#0369A1',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PermissionsPopup;