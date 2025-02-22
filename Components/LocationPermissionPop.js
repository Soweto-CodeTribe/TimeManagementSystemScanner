import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.4;
const SHEET_OVERFLOW = 20;

const LocationPermissionPopup = ({ isVisible, onClose }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90
      });
    }
  }, [isVisible]);

  const closeSheet = () => {
    translateY.value = withSpring(SHEET_HEIGHT);
    overlayOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        // Fade overlay as sheet is dragged down
        overlayOpacity.value = interpolate(
          event.translationY,
          [0, SHEET_HEIGHT],
          [1, 0]
        );
      }
    })
    .onEnd((event) => {
      if (event.translationY > SHEET_HEIGHT / 3) {
        closeSheet();
      } else {
        translateY.value = withSpring(0);
        overlayOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
        onTouchStart={() => closeSheet()}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          <Text style={styles.getStartedText}>Get Started</Text>
          <Text style={styles.textcontainer}>
            Scan QR code to continue with the process
          </Text>
          <Pressable style={styles.LetsGoButton}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}>
              Let's Go
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
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
    zIndex: 2,
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
  }
});

export default LocationPermissionPopup;