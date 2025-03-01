import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as DocumentPicker from 'expo-document-picker';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.3;
const SHEET_OVERFLOW = 20;

const DocumentsUpload = ({ isVisible, onClose }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 });
    }
  }, [isVisible]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd(() => {
      if (translateY.value > SHEET_HEIGHT / 3) {
        onClose();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
      }
    });

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Alert.alert('Upload canceled');
      } else {
        Alert.alert('File Selected', `Name: ${result.assets[0].name}`);
        console.log('File Details:', result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the file');
      console.error(error);
    }
  };

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
        onTouchStart={onClose}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          
          <View style={styles.permissionButtonsContainer}>
            <View style={styles.buttonsContainer}>
              <Text style={styles.documentsModalHeader}>Missing Check-in Notice</Text>
              <Text style={styles.documentsModalText}>
                Our records show you were unable to check in yesterday due to being upset. 
                Please provide documentation of your condition or cancel the report to record it as a day off.
              </Text>
              
              <Pressable 
                style={({ pressed }) => [styles.acceptButton, pressed && { opacity: 0.8 }]}
                onPress={handleFileUpload}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Text style={styles.buttontextAccept}>Upload a document</Text>
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [styles.declineButton, pressed && { opacity: 0.8 }]}
                onPress={onClose}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Text style={styles.buttontextDecline}>Cancel</Text>
              </Pressable>
            </View>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingBottom: SHEET_OVERFLOW + 20,
    alignItems: 'center',
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    // elevation: 6,
    zIndex: 1002,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'grey',
    borderRadius: 2,
  },
  documentsModalHeader: {
    color: '#053742',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  documentsModalText: {
    color: '#7C808D',
    textAlign: 'center',
    marginBottom: 40,
  },
  permissionButtonsContainer: {
    marginTop: 20,
    width: width - 40,
    alignItems: 'center',
    textAlign: 'center',
  },
  acceptButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#8AC052",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  declineButton: {
    width: '100%',
    height: 44,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#053742',
  },
  buttontextDecline: {
    color: '#053742',
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
  }
});

export default DocumentsUpload;
