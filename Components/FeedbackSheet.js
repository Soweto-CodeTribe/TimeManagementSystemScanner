import React, { useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';

const FeedbackBottomSheet = ({ setOpenFeedbackSheet, openFeedbacksheet }) => {
  const [feedbackText, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken]= useState(null);
  const [traineeId, setTraineeID] = useState(null);

  useEffect(()=>{
    const fetchUserData = async ()=>{
     try {
       const ID = await AsyncStorage.getItem('traineeID');
       const Token = await AsyncStorage.getItem('token');

       setToken(Token);
       setTraineeID(ID)
       console.log("This is the Token Nigger", Token);
     } catch (error) {
       console.error("Message error", error)
     }
    }
    fetchUserData();
 },[])

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://timemanagementsystemserver.onrender.com/api/add-user/feedback',
        { feedbackText },
        { headers: { Authorization: `Bearer ${token}`,} }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Feedback submitted successfully.');
        setMessage('');
        setOpenFeedbackSheet(false);
      }

      console.log(response.status);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openFeedbacksheet}
      onRequestClose={() => setOpenFeedbackSheet(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpenFeedbackSheet(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <View style={styles.indicator} />

              <Text style={styles.title}>Send Feedback</Text>

              <Text style={styles.subtitle}>
                Provide feedback about the app so we can improve on user experience.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Message"
                  placeholderTextColor="#BBBBBB"
                  multiline={true}
                  numberOfLines={6}
                  value={feedbackText}
                  onChangeText={setMessage}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  indicator: {
    width: 120,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F3B4C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7A8A97',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  inputContainer: { 
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    padding: 15,
    height: 180,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8BC34A',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
});

export default FeedbackBottomSheet;
