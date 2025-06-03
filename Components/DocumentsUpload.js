import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Pressable, 
  Alert, 
  Platform,
  Modal 
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import sub-components
import DocumentsList from './DocumentList';
import DocumentPreviewModal from './DocumentPreviewModal';
import { uploadToCodetribe, uploadToFirebase } from './UploadUtils.js';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.7;

const DocumentsUpload = ({ openDocumentsheet, onClose }) => {
  // State management
  const [traineeId, setTraineeId] = useState('');
  const [reason, setReason] = useState('Missing Check-in');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token, setToken] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [showUploadsList, setShowUploadsList] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userUploads, setUserUploads] = useState([]);

  // Predefined reasons for absence
  const reasons = [
    'Missing Check-in',
    'Illness',
    'Personal Emergency',
    'Technical Issues',
    'Other'
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ID = await AsyncStorage.getItem('traineeID');
        const Token = await AsyncStorage.getItem('token');
        
        setToken(Token);
        setTraineeId(ID);
        
        if (ID) {
          fetchUserUploads(ID, Token);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch user uploads
  const fetchUserUploads = async (id, authToken) => {
    if (!id || !authToken) return;
    
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
    }
  };

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

  // Toggle between upload form and uploads list
  const toggleView = () => {
    setShowUploadForm(!showUploadForm);
    setShowUploadsList(!showUploadsList);
  };

  // Pick document
  const pickDocument = async () => {
    if (!traineeId) {
      Alert.alert('Error', 'Your trainee ID could not be found. Please log in again.');
      return null;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      return result?.assets?.[0] || null;
    } catch (error) {
      console.error('Document picking error:', error);
      Alert.alert('Error', 'Failed to pick document');
      return null;
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    const fileDetails = await pickDocument();
    if (!fileDetails) return;
  
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
              
              // Upload to Codetribe
              const uploadResponse = await uploadToCodetribe(
                fileDetails.uri,
                fileDetails.name,
                fileDetails.mimeType
              );
              
              // Extract file ID
              const fileId = uploadResponse.data?.data?.id;
              
              if (!fileId) {
                throw new Error('Could not extract file ID from upload response');
              }
              
              // Upload to Firebase
              await uploadToFirebase(fileId, traineeId, token, reason, formatDate(date));
              
              Alert.alert('Success', 'Document uploaded successfully');
              
              // Refresh uploads and toggle view
              await fetchUserUploads(traineeId, token);
              toggleView();
            } catch (error) {
              console.error('Full Error Details:', error);
              Alert.alert('Error', error.message || 'Something went wrong during upload');
            } finally {
              setIsUploading(false);
            }
          }
        }
      ]
    );
  };

  // Render upload form
  const renderUploadForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.documentsModalText}>
        Our records show you were unable to check in.
        Please provide documentation of your absence or cancel the report to record it as a day off.
      </Text>
      
      {/* Reason Picker */}
      <Text style={styles.inputLabel}>Reason:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={reason}
          onValueChange={(itemValue) => setReason(itemValue)}
          style={styles.picker}
          mode={Platform.OS === 'ios' ? 'dialog' : 'dropdown'}
        >
          {reasons.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
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
        style={[
          styles.acceptButton,
          (isUploading && styles.disabledButton)
        ]}
        onPress={handleFileUpload}
        disabled={isUploading}
      >
        <Text style={styles.buttontextAccept}>
          {isUploading ? 'Uploading...' : 'Upload a document'}
        </Text>
      </Pressable>
      
      {/* Cancel Button */}
      <Pressable
        style={styles.declineButton}
        onPress={onClose}
        disabled={isUploading}
      >
        <Text style={styles.buttontextDecline}>Cancel</Text>
      </Pressable>
    </View>
  );

  // If not open, return null
  if (!openDocumentsheet) return null;

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Pressable 
        style={styles.overlay} 
        onPress={onClose} 
      />

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

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

        {/* Conditional Rendering */}
        {showUploadForm 
          ? renderUploadForm() 
          : (
            <DocumentsList 
              uploads={userUploads} 
              onClose={onClose} 
              refreshUploads={() => fetchUserUploads(traineeId, token)}
            />
          )
        }
      </View>
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
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    height: SHEET_HEIGHT,
    width: width,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: -3 
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dragHandle: {
    width: 120,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    height: "13%"
  },
  documentsModalHeader: {
    color: '#053742',
    fontSize: 14,
    flex: 1,
    textTransform: 'uppercase'
  },
  toggleButton: {
    padding: 8,
    backgroundColor: '#E8F5FF',
    borderRadius: 8,
    width: '100%'
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
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'grey',
    borderRadius: 2,
    marginBottom: 10,
  },
  uploadItem: {
    flexDirection: 'row', 
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#053742',
    minHeight: 80,
  },
  uploadImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  uploadItemContent: {
    flex: 1, 
    justifyContent: 'center',
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
    borderColor: 'rgba(0, 0, 0, .2)',
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
    borderColor: 'rgba(0, 0, 0, .2)',
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
    height: 50,
    backgroundColor: "#8CD136",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  declineButton: {
    width: '100%',
    height: 50,
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
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#053742',
    minHeight: 100,
  },
  imagePreviewContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  uploadDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '95%',
    height: '80%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  modalCloseButtonText: {
    color: 'black',
    fontWeight: 'bold',
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