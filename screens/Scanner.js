import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import PermissionsPopup from '../Components/PermissionsPopup';
import UserGuestBottomSheet from '../Components/UserGuestbottomsheet';

export default function ScannerScreen({ navigation }) { 
  // Hooks
  const [facing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  function handleBarcodeScanned({ data }) {
    if (!scanned) {
      setScanned(true);
      Alert.alert('QR Code Scanned', `Data: ${data}`, [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
      setIsBottomSheetVisible(true)
      console.log(data); 
    }
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