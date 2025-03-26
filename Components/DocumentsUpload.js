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

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Alert, Platform, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
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
const SHEET_HEIGHT = height * 0.65;
const SHEET_OVERFLOW = 20;

const DocumentsUpload = ({ openDocumentsheet, onClose }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [traineeId, setTraineeId] = useState('');
  const [reason, setReason] = useState('Missing Check-in');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token, setToken] = useState('');
  const [userUploads, setUserUploads] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [showUploadsList, setShowUploadsList] = useState(false);

  // Predefined reasons
  const reasons = [
    'Missing Check-in',
    'Illness',
    'Personal Emergency',
    'Technical Issues',
    'Other'
  ];

  // Fetch user data and token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ID = await AsyncStorage.getItem('traineeID');
        const Token = await AsyncStorage.getItem('token');
        setToken(Token);
        setTraineeId(ID);
        
        // If we have an ID, fetch the user's uploads
        if (ID) {
          fetchUserUploads(ID, Token);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Animation effect for the bottom sheet
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

  // Fetch user uploads function
  const fetchUserUploads = async (id, authToken) => {
    if (!id || !authToken) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/trainee/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      setUserUploads(response.data);
    } catch (error) {
      console.error('Error fetching user uploads:', error);
      Alert.alert('Error', 'Failed to fetch your uploads');
    } finally {
      setIsLoading(false);
    }
  };

  // Pan gesture for the bottom sheet
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

  // Format date for display and API
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Date picker change handler
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (fileUri, fileName, fileType) => {
    try {
      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
      
      formData.append('upload_preset', 'absentee'); 
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dkxkx7cn6/upload',
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
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw new Error('Failed to upload to Cloudinary');
    }
  };

  // Upload to Firebase
  const uploadToFirebase = async (documentUrl) => {
    try {
      const formattedDate = formatDate(date);
      const response = await axios.post('https://timemanagementsystemserver.onrender.com/api/create', {
        traineeId,
        documentUrl,
        reason,
        date: formattedDate
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Firebase upload error:', error);
      throw new Error('Failed to upload to Firebase');
    }
  };

  // Pick and upload document
  const pickDocument = async () => {
    if (!traineeId) {
      Alert.alert('Error', 'Your trainee ID could not be found. Please log in again.');
      return;
    }

    try {
      // Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result?.assets?.length) {
        return null;
      }

      return result.assets[0];
    } catch (error) {
      console.error('Document picking error:', error);
      Alert.alert('Error', 'Failed to pick document');
      return null;
    }
  };

  // Handle file upload with confirmation
  const handleFileUpload = async () => {
    // First, pick the document
    const fileDetails = await pickDocument();
    if (!fileDetails) return;

    // Show confirmation alert
    Alert.alert(
      'Confirm Upload',
      `Are you sure you want to upload documentation for your absence on ${formatDate(date)}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Upload',
          onPress: async () => {
            try {
              setIsUploading(true);
              
              // Upload to Cloudinary
              const documentUrl = await uploadToCloudinary(
                fileDetails.uri,
                fileDetails.name,
                fileDetails.mimeType
              );
              
              // Upload to Firebase
              const uploadResult = await uploadToFirebase(documentUrl);
              
              Alert.alert('Success', 'Document uploaded successfully');
              
              // Refresh the uploads list
              await fetchUserUploads(traineeId, token);
              
              // Switch to the uploads list view
              toggleView();
            } catch (error) {
              Alert.alert('Error', error.message || 'Something went wrong during upload');
              console.error(error);
            } finally {
              setIsUploading(false);
            }
          }
        }
      ]
    );
  };

  // Toggle between upload form and uploads list
  const toggleView = () => {
    setShowUploadForm(!showUploadForm);
    setShowUploadsList(!showUploadsList);
  };

  // Render a single upload item
  const renderUploadItem = ({ item }) => {
    const statusColors = {
      pending: '#FFC107',
      approved: '#4CAF50',
      rejected: '#F44336'
    };
  
    // Default status handling
    const status = item.status || 'pending';
    
    return (
      <View style={styles.uploadItem}>
        <Text style={styles.uploadReason}>{item.reason}</Text>
        <Text style={styles.uploadDate}>Date: {item.date}</Text>
        <View style={styles.uploadStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColors[status] }]} />
          <Text style={styles.statusText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
        {item.reviewNotes && (
          <Text style={styles.reviewNotes}>Notes: {item.reviewNotes}</Text>
        )}
      </View>
    );
  };

  // Animated styles
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
          
          {/* Header with toggle button */}
          <View style={styles.headerContainer}>
            <Text style={styles.documentsModalHeader}>
              {showUploadForm ? 'Missing Check-in Notice' : 'My Uploaded Documents'}
            </Text>
            <Pressable
              style={styles.toggleButton}
              onPress={toggleView}
            >
              <Text style={styles.toggleButtonText}>
                {showUploadForm ? 'View My Uploads' : 'Upload New Document'}
              </Text>
            </Pressable>
          </View>

          {/* Upload Form */}
          {showUploadForm && (
            <View style={styles.formContainer}>
              <Text style={styles.documentsModalText}>
                Our records show you were unable to check in.
                Please provide documentation of your absence or cancel the report to record it as a day off.
              </Text>
              
              {/* TraineeID is hidden - removed */}
              
              {/* Reason Picker */}
              <Text style={styles.inputLabel}>Reason:</Text>
              <View style={styles.pickerWrapper}>
                {Platform.OS === 'ios' ? (
                  <Picker
                    selectedValue={reason}
                    onValueChange={(itemValue) => setReason(itemValue)}
                    style={styles.picker}
                  >
                    {reasons.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                ) : (
                  <Picker
                    selectedValue={reason}
                    onValueChange={(itemValue) => setReason(itemValue)}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    {reasons.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                )}
              </View>
              
              {/* Date Picker */}
              <Text style={styles.inputLabel}>Absence Date:</Text>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isUploading}
              >
                <Text>{formatDate(date)}</Text>
              </Pressable>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                />
              )}
              
              {/* Upload Button */}
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
              
              {/* Cancel Button */}
              <Pressable
                style={({ pressed }) => [styles.declineButton, pressed && { opacity: 0.8 }]}
                onPress={onClose}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                disabled={isUploading}
              >
                <Text style={styles.buttontextDecline}>Cancel</Text>
              </Pressable>
            </View>
          )}

          {/* Uploads List View */}
          {showUploadsList && (
            <View style={styles.uploadsContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#053742" style={styles.loader} />
              ) : (
                <SafeAreaView style={{flex: 1, width: '100%'}}>
                  {userUploads.length > 0 ? (
                    <FlatList
                      data={userUploads}
                      renderItem={renderUploadItem}
                      keyExtractor={(item, index) => item.id || `upload-${index}`}
                      contentContainerStyle={styles.uploadsListContent}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      initialNumToRender={5}
                      windowSize={5}
                      maxToRenderPerBatch={10}
                      style={styles.uploadsList}
                    />
                  ) : (
                    <Text style={styles.noUploadsText}>No uploads found</Text>
                  )}
                </SafeAreaView>
              )}
              
              <Pressable
                style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.8 }]}
                onPress={onClose}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Text style={styles.buttontextDecline}>Close</Text>
              </Pressable>
            </View>
          )}
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
    height: SHEET_HEIGHT,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'grey',
    borderRadius: 2,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  documentsModalHeader: {
    color: '#053742',
    fontSize: 18,
    flex: 1,
  },
  toggleButton: {
    padding: 8,
    backgroundColor: '#E8F5FF',
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#053742',
    fontSize: 12,
  },
  formContainer: {
    width: '100%',
  },
  documentsModalText: {
    color: '#7C808D',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#053742',
    marginBottom: 5,
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#053742',
    borderRadius: 10,
    marginBottom: 15,
    height: Platform.OS === 'ios' ? 150 : 46,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 150 : 60,
  },
  dateButton: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#053742',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  datePicker: {
    width: '100%',
    marginBottom: 15,
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
  closeButton: {
    width: '100%',
    height: 44,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#053742',
    marginTop: 10,
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
  uploadsContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 10,
  },
  uploadsList: {
    width: '100%',
    height: '85%', // Set a specific height
  },
  uploadsListContent: {
    paddingBottom: 10,
  },
  uploadItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#053742',
    minHeight: 80, // Reduced height
  },
  uploadReason: {
    fontSize: 13,
    fontWeight: '600',
    color: '#053742',
    marginBottom: 2,
  },
  uploadDate: {
    fontSize: 11,
    color: '#7C808D',
    marginBottom: 2,
  },
  uploadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reviewNotes: {
    fontSize: 11,
    color: '#7C808D',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noUploadsText: {
    textAlign: 'center',
    color: '#7C808D',
    marginTop: 20,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default DocumentsUpload;