import axios from 'axios';
import useEffect from 'react';
import * as SecureStore from 'expo-secure-store';



export const uploadToCodetribe = async (fileUri, fileName, fileType) => {
  try {
    // Retrieve the token from SecureStore
    let token = await SecureStore.getItemAsync('codetribeAccessToken');
    
    // If no token is found, fetch a new one instead of throwing an error
    if (!token) {
      console.log('No stored token found, fetching a new one');
      const loginResponse = await axios.post('https://codetribe-admin.mlab.co.za/auth/login', {
        email: process.env.EXPO_PUBLIC_EMAIL,
        password: process.env.EXPO_PUBLIC_PASSWORD
      });
      
      token = loginResponse.data.data.access_token;
      
      // Store the new token in SecureStore for future use
      await SecureStore.setItemAsync('codetribeAccessToken', token);
    }

    // Create the form data
    const formData = new FormData();
    formData.append('folder', '73fa2f76-07be-4165-bcbd-789b73ecb1ff');
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType,
    });
    
    // Attempt the upload with the token (either stored or newly fetched)
    const response = await axios.post(
      'https://codetribe-admin.mlab.co.za/files', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      }
    );
    
    return response;
  } catch (error) {
    console.error('Codetribe upload error:', error);
    
    // If the error might be due to an invalid token, try to refresh and retry
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      try {
        console.log('Token might be expired, fetching a new one');
        // Fetch a new token
        const loginResponse = await axios.post('https://codetribe-admin.mlab.co.za/auth/login', {
          email: process.env.EXPO_PUBLIC_EMAIL,
          password: process.env.EXPO_PUBLIC_PASSWORD
        });
        
        const freshToken = loginResponse.data.data.access_token;
        
        // Store the new token in SecureStore
        await SecureStore.setItemAsync('codetribeAccessToken', freshToken);
        
        // Retry the upload with the new token
        const formData = new FormData();
        formData.append('folder', '73fa2f76-07be-4165-bcbd-789b73ecb1ff');
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
        
        const retryResponse = await axios.post(
          'https://codetribe-admin.mlab.co.za/files', 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${freshToken}`
            },
          }
        );
        
        return retryResponse;
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        throw new Error('Failed to upload to Codetribe after token refresh');
      }
    }
    
    // If it's not a token issue or refresh failed, throw the original error
    throw new Error(`Failed to upload to Codetribe: ${error.message}`);
  }
};


export const uploadToFirebase = async (fileId, traineeId, token, reason, formattedDate) => {
  try {
    const response = await axios.post('https://timemanagementsystemserver.onrender.com/api/create', {
      traineeId,
      documentUrl: fileId,
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
    console.error('Firebase upload error:', error.response ? error.response.data : error);
    throw new Error('Failed to upload to Firebase');
  }
};