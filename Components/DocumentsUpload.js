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
import { View, Text, StyleSheet, Dimensions, Pressable, Alert, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'; // Add axios for API calls

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.7;
const SHEET_OVERFLOW = 20;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dbicet7rg/image/upload`;
const UPLOAD_PRESET = `images`;
const API_URL = 'https://timemanagementsystemserver.onrender.com/api/absenteeism'; // Replace with your actual API URL

const DocumentsUpload = ({ openDocumentsheet, onClose, traineeId }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  const [file, setFile] = useState(null);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploadedProofs, setUploadedProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (openDocumentsheet) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
      
      // Fetch previously uploaded proofs for this trainee
      if (traineeId) {
        fetchTraineeUploads();
      }
    } else {
      translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 }, () => {
        overlayOpacity.value = withTiming(0, { duration: 200 });
      });
    }
  }, [openDocumentsheet, traineeId]);

  // Fetch trainee's previously uploaded documents
  const fetchTraineeUploads = async () => {
    if (!traineeId) return;
    
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/uploads/trainee/${traineeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUploadedProofs(response.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd(() => {
      if (translateY.value > SHEET_HEIGHT / 3) {
        translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 90 }, () => {
          onClose();
        });
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

      if (!result?.assets?.length) {
        Alert.alert('Upload canceled');
      } else {
        setFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the file');
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      Alert.alert('No File Selected', 'Please select a file first.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Reason Required', 'Please provide a reason for absenteeism.');
      return;
    }

    if (!traineeId) {
      Alert.alert('Error', 'Trainee ID not provided.');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload file to Cloudinary
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const cloudinaryData = await cloudinaryResponse.json();

      if (cloudinaryData.secure_url) {
        // 2. Send data to our backend API
        const token = await AsyncStorage.getItem('authToken');
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        const uploadData = {
          traineeId,
          documentUrl: cloudinaryData.secure_url,
          reason: reason,
          date: formattedDate
        };

        const apiResponse = await axios.post(`${API_URL}/create`, uploadData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Update UI with the new upload
        await fetchTraineeUploads(); // Refresh the uploads list

        // 4. Reset form
        setFile(null);
        setReason('');
        setDate(new Date());
        Alert.alert('Success', 'Document uploaded successfully!');
      } else {
        throw new Error('Upload to Cloudinary failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': default: return 'orange';
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
                Please provide documentation of your condition or cancel the report to record it as a day off.
              </Text>

              {/* Reason Input */}
              <TextInput
                style={styles.input}
                placeholder="Reason for absenteeism"
                value={reason}
                onChangeText={setReason}
              />

              {/* Date Picker */}
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.datePickerText}>
                  Select Date: {date.toISOString().split('T')[0]}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              {/* File Picker */}
              <Pressable 
                style={({ pressed }) => [styles.acceptButton, pressed && { opacity: 0.8 }]}
                onPress={handleFileUpload}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Text style={styles.buttontextAccept}>
                  {file ? 'Change document' : 'Upload a document'}
                </Text>
              </Pressable>

              {/* Display selected file */}
              {file && (
                <View style={styles.selectedFileContainer}>
                  <Text style={styles.selectedFileText}>
                    Selected: {file.name}
                  </Text>
                </View>
              )}

              {/* Upload Button */}
              {file && (
                <Pressable 
                  style={({ pressed }) => [styles.acceptButton, pressed && { opacity: 0.8 }]}
                  onPress={uploadFile}
                  disabled={uploading}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                >
                  <Text style={styles.buttontextAccept}>
                    {uploading ? 'Uploading...' : 'Submit Proof'}
                  </Text>
                </Pressable>
              )}

              {/* Uploaded Proofs Gallery */}
              {isLoading ? (
                <Text style={styles.loadingText}>Loading previous uploads...</Text>
              ) : uploadedProofs.length > 0 ? (
                <ScrollView style={styles.galleryContainer}>
                  <Text style={styles.galleryTitle}>Your Uploaded Proofs:</Text>
                  {uploadedProofs.map((proof, index) => (
                    <View key={index} style={styles.proofItem}>
                      <Image 
                        source={{ uri: proof.documentUrl }} 
                        style={styles.proofImage} 
                      />
                      <View style={styles.proofDetails}>
                        <Text style={styles.proofText}>Reason: {proof.reason}</Text>
                        <Text style={styles.proofText}>Date: {proof.date}</Text>
                        <Text style={[
                          styles.proofStatus, 
                          { color: getStatusColor(proof.status) }
                        ]}>
                          Status: {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : null}

              {/* Cancel Button */}
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
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    zIndex: 1002,
    maxHeight: SHEET_HEIGHT + SHEET_OVERFLOW,
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
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  datePickerButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  acceptButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#8CD136",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
    marginTop: 5,
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
  },
  selectedFileContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 15,
  },
  selectedFileText: {
    fontSize: 14,
    color: '#333',
  },
  galleryContainer: {
    width: '100%',
    maxHeight: 200,
    marginVertical: 10,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  proofItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  proofImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  proofDetails: {
    flex: 1,
  },
  proofText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  proofStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  loadingText: {
    textAlign: 'center',
    margin: 10,
    color: '#666',
  },
});

export default DocumentsUpload;