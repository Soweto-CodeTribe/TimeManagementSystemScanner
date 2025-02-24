import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function Scanner() {
  // Hooks
  const [facing, setFacing] = useState('back');
//   const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

//   if (!permission) {
//     return <View />;
//   }

//   // Handle Permissions
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </View>
//     );
//   }

  // Barcode scanner function
  function handleBarcodeScanned({ data }) {
    if (!scanned) {
      setScanned(true);
      Alert.alert('QR Code Scanned', `Data: ${data}`, [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
      console.log(data);
    }
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken edges
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Light white tint to improve contrast
  },
});