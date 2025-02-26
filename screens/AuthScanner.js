import { CameraView } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import UserGuestBottomSheet from '../Components/UserGuestbottomsheet';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScannerAuth({ navigation }) {
  // Hooks
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);



  // Handle QR Code Scanned
  function handleBarcodeScanned({ data }) {
    if (!scanned) {
      setScanned(true);
      Alert.alert('QR Code Scanned', `Data: ${data}`, [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
      console.log(data);
    }
  }
  // Close Bottom Sheet
  function closeBottomSheet() {
    setIsBottomSheetVisible(false);
    setScanned(false); // Allow scanning again
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
        zoom={0.2} // Slight zoom to focus on the center
      >
        {/* QR Code Overlay */}
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
      </CameraView>

      <UserGuestBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={closeBottomSheet} // Pass a function to close the bottom sheet
      />
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
