import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "react-native-toast-message";

// Import the actions from your new slice
import { 
  startLunch, 
  endLunch, 
  checkOut 
} from '../Components/Redux/Slices/CheckInOutSlice';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * .42;
const SHEET_OVERFLOW = 20;

const CheckinCheckoutbottomsheet = ({ isVisible }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  
  // Get state from Redux
  const token = useSelector((state) => state.auth.token);
  const traineeId = useSelector((state) => state.auth.traineeID);
  const { lunchStatus, loading } = useSelector((state) => state.checkInOut);
  
  const dispatch = useDispatch();
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

  const handleCheckInLunch = async () => {
    dispatch(startLunch({ traineeId, token }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigation.navigate("HomeScreen");
        }, 3000);
      });
  };

  const handleCheckOutLunch = async () => {
    dispatch(endLunch({ traineeId, token }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigation.navigate("HomeScreen");
        }, 3000);
      });
  };

  const handleCheckOut = async () => {
    dispatch(checkOut({ traineeId, token }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigation.navigate("HomeScreen");
        }, 3000);
      });
  };

  return (
    <View style={styles.container}>
      <Toast/>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          
          <View style={styles.permissionButtonsContainer}>
            <View style={styles.buttonsContainer}>
              {/* Check In to Lunch */}
              <Pressable 
                disabled={loading || lunchStatus !== "notStarted"}
                style={({ pressed }) => [
                  styles.lunchInButton,
                  pressed && { opacity: 0.8 },
                  (loading || lunchStatus !== "notStarted") && { backgroundColor: '#ccc' }
                ]}
                onPress={handleCheckInLunch}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Text style={styles.buttonTextLight}>
                  {loading && lunchStatus === "notStarted" ? "Loading..." : "Check In to Lunch"}
                </Text>
              </Pressable>
              
              {/* Check Out of Lunch */}
              <Pressable 
                disabled={loading || lunchStatus !== "checkedIn"}
                style={({ pressed }) => [
                  styles.lunchOutButton,
                  pressed && { opacity: 0.8 },
                  (loading || lunchStatus !== "checkedIn") && { backgroundColor: '#ccc' }
                ]}
                onPress={handleCheckOutLunch}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Text style={styles.buttonTextDark}>
                  {loading && lunchStatus === "checkedIn" ? "Loading..." : "Check Out of Lunch"}
                </Text>
              </Pressable>
              
              {/* Check Out (always enabled) */}
              <Pressable 
                disabled={loading}
                style={({ pressed }) => [
                  styles.checkOutButton,
                  pressed && { opacity: 0.8 },
                  loading && { backgroundColor: '#ccc' }
                ]}
                onPress={handleCheckOut}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Text style={styles.buttonTextLight}>
                  {loading ? "Loading..." : "Check Out"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles...
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
  permissionButtonsContainer: {
    marginTop: 20,
    width: width - 40,
    alignItems: 'center',
  },
  lunchInButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#F4A261",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  lunchOutButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#E9C46A",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  checkOutButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#E76F51",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonTextLight: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: 'black',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "column",
  }
});

export default CheckinCheckoutbottomsheet;