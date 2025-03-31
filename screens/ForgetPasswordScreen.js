import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = useSelector((state) => state.auth.token);
  const BASE_URL = 'https://timemanagementsystemserver.onrender.com';
  const handleForgotPassword = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, 
        { email },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      setLoading(false);
      
      if (response.data.message === "Password reset link sent successfully") {
        navigation.navigate('PasswordEmail', { email });
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (error) {
      setLoading(false); 
      if (error.response) {
        // Server responded with an error
        setError(error.response.data.message || 'Server error');
      } else if (error.request) {
        // No response received
        setError('Network error. Please check your connection.');
      } else {
        // Request setup error
        setError('Failed to send request');
      }
      console.error('Error:', error);
      Alert.alert("Error", error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('TraineeLoginScreen')}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/forgotPassword.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! It happens. Please enter the email address associated with your account
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity
          style={[styles.button, (!email || loading) && styles.buttonDisabled]}
          disabled={!email || loading}
          onPress={handleForgotPassword}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.buttonText, !email && styles.buttonTextDisabled]}>
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 32,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});