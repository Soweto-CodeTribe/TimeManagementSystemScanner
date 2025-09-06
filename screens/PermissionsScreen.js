import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';

import QRCode from "../assets/qrcode.png";
import CodeTribe from "../assets/codetribetext.png";
import PermissionsPopup from '../Components/PermissionsPopup';

const { width, height } = Dimensions.get('window');

const PermissionsScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  
  // Animate components on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

      useEffect(() => {
      setIsBottomSheetVisible(true);
    }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Logo */}
          <Animated.View 
            style={[
              styles.logoContainer, 
              { opacity: fadeAnim }
            ]}
          >
            <Image
              source={CodeTribe}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* QR Code with animation */}
          <Animated.View 
            style={[
              styles.qrFrameContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.qrCodeShadow}>
              <Image
                source={QRCode}
                style={styles.qrCodeImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.scanningLine} />
          </Animated.View>

          <PermissionsPopup
          isVisible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}        
           />

        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#555555',
    fontWeight: '500',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#555555',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 40,
  },
  qrFrameContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.03,
    position: 'relative',
  },
  qrCodeShadow: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  qrCodeImage: {
    width: '90%',
    height: '90%',
  },
  scanningLine: {
    position: 'absolute',
    width: '75%',
    height:
    2,
    backgroundColor: 'rgba(140, 224, 28, 0.8)',
    top: '50%',
    left: '12.5%',
  },
});

export default PermissionsScreen;