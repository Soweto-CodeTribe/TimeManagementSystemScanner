import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import PermissionsPopup from '../Components/PermissionsPopup';
import UserGuestBottomSheet from '../Components/UserGuestbottomsheet';
import * as Location from "expo-location";
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";

export default function ScannerScreen({ navigation }) { 
  // Hooks
  const [facing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);



  async function handleBarcodeScanned({ data }) {
    if (scanned) return;  // Prevent scanning if already scanned
    setScanned(true);      // Mark as scanned to prevent further scanning
    setLoading(true);
    try {
        const isValid = await verifyQRCode(data);
        if (isValid) {
            const checkIn = Date.now();

            // Capture location
            let location = null;
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    if (Platform.OS === "android") {
                        const isAvailable = await Location.hasServicesEnabledAsync();
                        if (!isAvailable) {
                            throw new Error("Location services are not available on this device.");
                        }
                    }
                    const loc = await Location.getCurrentPositionAsync({
                        enableHighAccuracy: false,
                    });
                    location = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    };
                } else {
                    Alert.alert(
                        "Permission Denied",
                        "Location permission is required to check in."
                    );
                }
            } catch (error) {
                console.error("Location Error:", error);
                Alert.alert(
                    "Location Error",
                    error.message || "Could not get location."
                );
            }
            // Save to local storage
            const checkInData = {
                checkInTime: checkIn,
                location,
            };
            await AsyncStorage.setItem("checkInData", JSON.stringify(checkInData));
            // Alert.alert(
            //     "Check in data captured. You can now log in to finish the process"
            // );
            Toast.show({
              type: "success",
              text1: "Scanned Successfully",
              text2: "You can now log in to check in",
              position: "top",
            });

            setIsBottomSheetVisible(true);
        } else {
            Alert.alert("Invalid QR Code", "This QR code is expired or incorrect.");
        }
    } catch (error) {
        console.error("Scan Error:", error);
        Alert.alert("Error", "Invalid QR Code");
    } finally {
        setLoading(false);
    }
}

  


  async function verifyQRCode(qrId) {
    try {
      const res = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/QR/verify-QRcode",
        { qrId }
    
      );
      return res.data.success;
    } catch (error) {
      console.error(
        "QR Code Verification Error:",
        error.response?.data || error
      );
      return false;
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Toast/>

        <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()} 
          >
            <AntDesign name="close" size={24} color="red" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Scan QR Code</Text>
          
      </View>

      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        zoom={0.2} 
      >
        {/* QR Code Overlay */}
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
        <UserGuestBottomSheet
          isVisible={isBottomSheetVisible}
          // onClose={() => setIsBottomSheetVisible(false)}        
        />
      </CameraView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 20,
    // backgroundColor: '#000', 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
});