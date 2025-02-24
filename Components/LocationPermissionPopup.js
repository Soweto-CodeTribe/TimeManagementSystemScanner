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
const SHEET_HEIGHT = height * 0.4;
const SHEET_OVERFLOW = 20;




const LocationPermissionPopup = ({ isVisible }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [cameraPermissions, setCameraPermissions] = useState(false);

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

  // Locations Permissions
  const requestLocationPermission = async () => {
    console.log('Request permission function called');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      Alert.alert("Location Permission", "Location access granted.");
      setCameraPermissions(true); 
    } else {
      Alert.alert("Location Permission", "Location access denied.");
      navigation.navigate("GetStartedScreen");
    }
  };

  // Camera Permissions
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      Alert.alert("Camera Permission", "Camera access granted.");

      setTimeout(()=>{
        navigation.navigate("Scanner");
      },3000)
                                                             
    } else {
      Alert.alert("Camera Permission", "Camera access denied.");
    }
  };


  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
        pointerEvents="none"
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          <Text style={styles.getStartedText}>Get Started</Text>
          <Text style={styles.textcontainer}>
            Scan QR code to continue with the process
          </Text>
          <View style={styles.permissionButtonsContainer}>
            {!cameraPermissions ? (  
              <>
                <Pressable 
                  style={styles.acceptButton} 
                  onPress={requestLocationPermission}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </Pressable>
                <Pressable 
                  style={styles.declineButton}
                  onPress={() => console.log('Decline pressed')}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable 
                  style={styles.acceptButton} 
                  onPress={requestCameraPermission} 
                >
                  <Text style={styles.buttonText}>Accept Camera Permission</Text>
                </Pressable>
                <Pressable 
                  style={styles.declineButton}
                  onPress={() => console.log('Decline Camera pressed')}
                >
                  <Text style={styles.buttonText}>Decline Camera Permission</Text>
                </Pressable>
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginTop: 10,
  },
  LetsGoButton: {
    width: width - 40,
    height: 44,
    backgroundColor: "#8AC052",
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  declineButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#FF4D4D",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default LocationPermissionPopup;
