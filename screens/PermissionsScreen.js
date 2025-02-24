import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import QRcode from "../assets/qrcode.png";
import PermissionsPopup from '../Components/PermissionsPopup';
import { useState, useEffect } from 'react';
import CodeTribeText from "../assets/codetribetext.png"

const { width, height } = Dimensions.get('window');

// Constants for consistent styling
const COLORS = {
  primary: '#8AC052',
  secondary: '#7C808D',
  white: '#FFFFFF',
  shadow: '#000000',
};

// Spacing for responsiveness on different screens
const SPACING = {
  xs: 10,
  sm: 12,
  md: 20,
  lg: 30,
  xl: 40,
};

const PermissionsScreen = () => {
  const navigation = useNavigation();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

    useEffect(() => {
      // Show bottom sheet when screen mounts
      setIsBottomSheetVisible(true);
    }, []);

  const handleGetStarted = () => {
    navigation.navigate("ScanScreen");
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>
          {/* Decorative top gradient */}
          <LinearGradient
            colors={[
              'rgba(138, 192, 82, 0.15)',
              'rgba(138, 192, 82, 0.1)',
              'rgba(138, 192, 82, 0)',
            ]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={styles.cornerGradient}
          />

          {/* Main content */}
          <View style={styles.contentContainer}>

            <Image
             source={CodeTribeText}
              style={styles.qrImage}
              resizeMode="contain"
            />
            <Image
              source={QRcode}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          {/* Bottom section */}
          <PermissionsPopup
          isVisible={isBottomSheetVisible}
          // onClose={() => setIsBottomSheetVisible(false)}        
        />
          
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom:340
  },
  qrImage: {
    width: width * 0.5,
    height: width * 0.4,
    borderRadius: SPACING.sm,
  },
  cornerGradient: {
    width: width * 0.8,
    height: width * 0.7,
    borderRadius: width * 0.4,
    position: 'absolute',
    top: -width * 0.4,
    right: -width * 0.4,
  },
  bottomContainer: {
    width: '100%',
    height: height * 0.4,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: SPACING.xl,
    borderTopLeftRadius: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  textGroup: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  heading: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 53,
    marginBottom: SPACING.xs,
  },
  subheading: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 21,
  },
  button: {
    width: '100%',
    maxWidth: 352,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PermissionsScreen;