import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import UserGuestBottomSheet from '../Components/UserGuestbottomsheet';
import Toast from "react-native-toast-message";
import { 
  verifyQRCode, 
  captureLocation, 
  resetScan, 
  setBottomSheetVisible 
} from '../Components/Redux/Slices/ScanSlice.js';

export default function ScannerScreen({ navigation }) { 
  // Redux hooks
  const dispatch = useDispatch();
  const { 
    scanned, 
    loading, 
    error, 
    isBottomSheetVisible, 
    checkInData 
  } = useSelector(state => state.scan);
  
  // Component state
  const [facing] = useState('back');

  async function handleBarcodeScanned({ data }) {
    if (scanned) return;  
    
    try {
      // First verify the QR code
      const resultAction = await dispatch(verifyQRCode(data));
      
      if (verifyQRCode.fulfilled.match(resultAction)) {
        // QR code verified successfully, now capture location
        const locationResult = await dispatch(captureLocation());
        
        if (captureLocation.fulfilled.match(locationResult)) {
          Toast.show({
            type: "success",
            text1: "Scanned Successfully",
            text2: "You can now log in to check in",
            position: "top",
            zIndex:99999
          });
        } else if (captureLocation.rejected.match(locationResult)) {
          Alert.alert(
            "Location Error",
            locationResult.payload || "Could not get location."
          );
        }
      } else if (verifyQRCode.rejected.match(resultAction)) {
        Alert.alert("Invalid QR Code", "This QR code is expired or incorrect.");
      }
    } catch (err) {
      console.error("Scan Error:", err);
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  const closeBottomSheet = () => {
    dispatch(setBottomSheetVisible(false));
    dispatch(resetScan());
  };

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
          {loading && (
            <Text style={styles.loadingText}>Processing...</Text>
          )}
        </View>
        
        <UserGuestBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}  
          checkInData={checkInData}     
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
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
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