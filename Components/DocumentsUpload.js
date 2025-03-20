// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
// import Animated, { 
//   useSharedValue, 
//   useAnimatedStyle, 
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';
// import { GestureDetector, Gesture } from 'react-native-gesture-handler';
// import * as DocumentPicker from 'expo-document-picker';

// const { height, width } = Dimensions.get('window');
// const SHEET_HEIGHT = height * 0.3;
// const SHEET_OVERFLOW = 20;

// const DocumentsUpload = ({ openDocumentsheet, onClose }) => {
//   const translateY = useSharedValue(SHEET_HEIGHT);
//   const overlayOpacity = useSharedValue(0);

//   useEffect(() => {
//     if (openDocumentsheet) {
//       overlayOpacity.value = withTiming(1, { duration: 200 });
//       translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
//     } else {
//       translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 }, () => {
//         overlayOpacity.value = withTiming(0, { duration: 200 });
//       });
//     }
//   }, [openDocumentsheet]);

//   const gesture = Gesture.Pan()
//     .onUpdate((event) => {
//       if (event.translationY > 0) {
//         translateY.value = event.translationY * 0.2;
//       }
//     })
//     .onEnd(() => {
//       if (translateY.value > SHEET_HEIGHT / 3) {
//         translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 }, () => {
//           onClose(); // Ensure smooth closing animation before closing
//         });
//       } else {
//         translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
//       }
//     });

//   const handleFileUpload = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*', 
//         copyToCacheDirectory: true,
//       });

//       if (!result?.assets?.length) {
//         Alert.alert('Upload canceled');
//       } else {
//         Alert.alert('File Selected', `Name: ${result.assets[0].name}`);
//         console.log('File Details:', result.assets[0]);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while selecting the file');
//       console.error(error);
//     }
//   };

//   const animatedSheetStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   const animatedOverlayStyle = useAnimatedStyle(() => ({
//     opacity: overlayOpacity.value,
//   }));

//   if (!openDocumentsheet) return null;

//   return (
//     <View style={styles.container}>
//       <Animated.View 
//         style={[styles.overlay, animatedOverlayStyle]} 
//         onTouchStart={onClose}
//       />
//       <GestureDetector gesture={gesture}>
//         <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
//           <View style={styles.handle} />
          
//           <View style={styles.permissionButtonsContainer}>
//             <View style={styles.buttonsContainer}>
//               <Text style={styles.documentsModalHeader}>Missing Check-in Notice</Text>
//               <Text style={styles.documentsModalText}>
//                 Our records show you were unable to check in yesterday due to being upset. 
//                 Please provide documentation of your condition or cancel the report to record it as a day off.
//               </Text>
              
//               <Pressable 
//                 style={({ pressed }) => [styles.acceptButton, pressed && { opacity: 0.8 }]}
//                 onPress={handleFileUpload}
//                 android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
//               >
//                 <Text style={styles.buttontextAccept}>Upload a document</Text>
//               </Pressable>
              
//               <Pressable 
//                 style={({ pressed }) => [styles.declineButton, pressed && { opacity: 0.8 }]}
//                 onPress={onClose}
//                 android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
//               >
//                 <Text style={styles.buttontextDecline}>Cancel</Text>
//               </Pressable>
//             </View>
//           </View>
//         </Animated.View>
//       </GestureDetector>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1000,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 1001,
//   },
//   bottomSheet: {
//     position: 'absolute',
//     bottom: -SHEET_OVERFLOW,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     padding: 20,
//     paddingBottom: SHEET_OVERFLOW + 20,
//     alignItems: 'center',
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4.65,
//     zIndex: 1002,
//   },
//   handle: {
//     width: 40,
//     height: 4,
//     backgroundColor: 'grey',
//     borderRadius: 2,
//   },
//   documentsModalHeader: {
//     color: '#053742',
//     textAlign: 'center',
//     marginBottom: 20,
//     fontSize: 18,
//   },
//   documentsModalText: {
//     color: '#7C808D',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   permissionButtonsContainer: {
//     marginTop: 20,
//     width: width - 40,
//     alignItems: 'center',
//     textAlign: 'center',
//   },
//   acceptButton: {
//     width: '100%',
//     height: 44,
//     backgroundColor: "#8CD136",
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   declineButton: {
//     width: '100%',
//     height: 44,
//     backgroundColor: "white",
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#053742',
//   },
//   buttontextDecline: {
//     color: '#053742',
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   buttontextAccept: {
//     color: 'white',
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   buttonsContainer: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//   }
// });

// export default DocumentsUpload;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Alert, TextInput, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.5; // Increased height to accommodate new fields
const SHEET_OVERFLOW = 20;
const DocumentsUpload = ({ openDocumentsheet, onClose }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [isUploading, setIsUploading] = useState(false);
  const [traineeId, setTraineeId] = useState('');
  const [reason, setReason] = useState('Missing Check-in');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token,setToken] = useState('');
  

  useEffect(()=>{
    const fetchUserData = async ()=>{
     try {
       const ID = await AsyncStorage.getItem('traineeID');
       const Token = await AsyncStorage.getItem('token');
       setToken(Token);
       setTraineeId(ID);
     } catch (error) {
       console.error("Message error", error)
     }
    }
    fetchUserData();
 },[]);







  // Predefined reasons
  const reasons = [
    'Missing Check-in',
    'Illness',
    'Personal Emergency',
    'Technical Issues',
    'Other'
  ];
  useEffect(() => {
    if (openDocumentsheet) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    } else {
      translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 }, () => {
        overlayOpacity.value = withTiming(0, { duration: 200 });
      });
    }
  }, [openDocumentsheet]);
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd(() => {
      if (translateY.value > SHEET_HEIGHT / 3) {
        translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 }, () => {
          onClose(); // Ensure smooth closing animation before closing
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
      }
    });
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const uploadToCloudinary = async (fileUri, fileName, fileType) => {
    try {
      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
      formData.append('upload_preset', 'absentee'); // Replace with your Cloudinary upload preset
      // Upload to Cloudinary
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dkxkx7cn6/upload', // Replace with your cloud name
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload to Cloudinary');
    }
  };
  const uploadToFirebase = async (documentUrl) => {
    try {
      const formattedDate = formatDate(date);
      // Change this to your API endpoint
      const response = await axios.post('https://timemanagementsystemserver.onrender.com/api/create', {
        traineeId,
        documentUrl,
        reason,
        date: formattedDate
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Firebase upload error:', error);
      throw new Error('Failed to upload to Firebase');
    }
  };
  const handleFileUpload = async () => {
    if (!traineeId) {
      Alert.alert('Error', 'Please enter a trainee ID');
      return;
    }
    try {
      setIsUploading(true);
      // Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result?.assets?.length) {
        Alert.alert('Upload canceled');
        setIsUploading(false);
        return;
      }
      const fileDetails = result.assets[0];
      console.log('File Details:', fileDetails);
      // Upload to Cloudinary
      const documentUrl = await uploadToCloudinary(
        fileDetails.uri,
        fileDetails.name,
        fileDetails.mimeType
      );
      // Upload to Firebase
      const uploadResult = await uploadToFirebase(documentUrl);
      Alert.alert('Success', 'Document uploaded successfully');
      console.log('Upload result:', uploadResult);
      // Close the sheet
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong during upload');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  if (!openDocumentsheet) return null;
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
                Our records show you were unable to check in.
                Please provide documentation of your absence or cancel the report to record it as a day off.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Trainee ID"
                value={traineeId}
                onChangeText={setTraineeId}
                keyboardType="numeric"
              />
              <View style={styles.pickerContainer}>
                <Text style={styles.inputLabel}>Reason:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={reason}
                    onValueChange={(itemValue) => setReason(itemValue)}
                    style={styles.picker}
                  >
                    {reasons.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.inputLabel}>Absence Date:</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{formatDate(date)}</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.acceptButton,
                  pressed && { opacity: 0.8 },
                  isUploading && { opacity: 0.6 }
                ]}
                onPress={handleFileUpload}
                disabled={isUploading}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Text style={styles.buttontextAccept}>
                  {isUploading ? 'Uploading...' : 'Upload a document'}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.declineButton, pressed && { opacity: 0.8 }]}
                onPress={onClose}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                disabled={isUploading}
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
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
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
    marginBottom: 20,
  },
  permissionButtonsContainer: {
    marginTop: 20,
    width: width - 40,
    alignItems: 'center',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#053742',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputLabel: {
    color: '#053742',
    marginBottom: 5,
    fontSize: 14,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#053742',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 44,
  },
  dateContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dateButton: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#053742',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  acceptButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#8CD136",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  declineButton: {
    width: '100%',
    height: 44,
    backgroundColor: "white",
    borderRadius: 10,
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






