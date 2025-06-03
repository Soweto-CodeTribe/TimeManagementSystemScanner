import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const GetStartedSeamlessly = ({ navigation, onComplete }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  
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

  const handleNext = () => {
    if (navigation) {
      navigation.navigate('GetStartedAttendance');
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = async() => {
    if (navigation) {
      await AsyncStorage.setItem('onBoarded', 'true');
      navigation.navigate('PermissionsScreen');
    } else if (onComplete) {
      onComplete(true);
    }
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header - Now inside SafeAreaView */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#999999" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

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

          {/* Text Content */}
          <Animated.View 
            style={[
              styles.textContainer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.heading}>Check In Seamlessly With Just a Tap</Text>
            <Text style={styles.subheading}>
              Use QR codes, GPS, or biometrics to log attendance quickly and securely.
            </Text>
          </Animated.View>

          {/* Pagination Indicator */}
          <View style={styles.paginationContainer}>
            <View style={[styles.paginationDot, styles.paginationInactive]} />
            <View style={[styles.paginationDot, styles.paginationActive]} />
            <View style={[styles.paginationDot, styles.paginationInactive]} />
            <View style={[styles.paginationDot, styles.paginationInactive]} />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingVertical: 5,
    zIndex: 10,
    flexDirection: "row"
  },
  backText: {
    color: '#555555',
    fontWeight: '500',
    padding: 2,
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
    justifyContent: 'space-between',
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
  textContainer: {
    alignItems: 'center',
    marginTop: height * 0.03,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 14,
  },
  subheading: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.05,
    
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,

  },
  paginationActive: {
    backgroundColor: '#8CE01C',
    width: 24,
  },
  paginationInactive: {
    backgroundColor: '#DDDDDD',
  },
  nextButton: {
    backgroundColor: '#8CE01C',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8CE01C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GetStartedSeamlessly;