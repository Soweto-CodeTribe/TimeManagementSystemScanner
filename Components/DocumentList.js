import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import DocumentPreviewModal from './DocumentPreviewModal';
import axios from 'axios'

const DocumentsList = ({ uploads, onClose, refreshUploads }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [freshCodetribeToken, setCodetribeToken] = useState(null);

  const accessToken=freshCodetribeToken

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          // First, try to get the token from SecureStore
          const storedToken = await SecureStore.getItemAsync('codetribeAccessToken');
          
          if (storedToken) {
            setCodetribeToken(storedToken);
            return;
          }
  
          // If no stored token, fetch a new one
          const loginResponse = await axios.post('https://codetribe-admin.mlab.co.za/auth/login', {
            email: process.env.EXPO_PUBLIC_EMAIL,
            password: process.env.EXPO_PUBLIC_PASSWORD
          });
          
          const freshToken = loginResponse.data.data.access_token;
          
          // Store the new token in SecureStore
          await SecureStore.setItemAsync('codetribeAccessToken', freshToken);
          
          // Set the token in state
          setCodetribeToken(freshToken);
        } catch (error) {
          console.error("Error fetching user data:", error.response ? error.response.data : error.message);
        }
      };
  
    fetchUserData();
  }, []); 


  // Render a single upload item
  const renderUploadItem = ({ item }) => {
    const statusColors = {
      pending: '#FFC107',
      approved: '#4CAF50',
      rejected: '#F44336'
    };
  
    const status = item.status || 'pending';
    
    return (
      <Pressable 
        style={styles.uploadItem}
        onPress={() => setSelectedDocument(item)}
      >
        <View style={styles.uploadDetails}>
          <Text style={styles.uploadReason}>{item.reason}</Text>
          <Text style={styles.uploadDate}>Date: {item.date}</Text>
          <View style={styles.uploadStatus}>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: statusColors[status] }
              ]} 
            />
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
          {item.reviewNotes && (
            <Text style={styles.reviewNotes}>
              Notes: {item.reviewNotes}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.uploadsContainer}>
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        {uploads.length > 0 ? (
          <FlatList
            data={uploads}
            renderItem={renderUploadItem}
            keyExtractor={(item, index) => item.id || `upload-${index}`}
            contentContainerStyle={styles.uploadsListContent}
            showsVerticalScrollIndicator={true}
          />
        ) : (
          <Text style={styles.noUploadsText}>No uploads found</Text>
        )}
      </SafeAreaView>
      
      <Pressable
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.buttontextDecline}>Close</Text>
      </Pressable>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          accessToken={accessToken}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  uploadsContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 10,
  },
  uploadItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#053742',
  },
  uploadDetails: {
    flex: 1,
    justifyContent: 'center',
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
});

export default DocumentsList;