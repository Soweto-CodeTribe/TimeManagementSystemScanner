import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon library

const GuestEmailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Email Icon at the Top (Centered Horizontally) */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="email" size={150} color="#4CAF50" style={styles.icon} /> {/* Green */}
        <MaterialIcons name="email" size={150} color="#FFF" style={[styles.icon, styles.iconOverlay]} /> {/* White */}
        <MaterialIcons name="email" size={150} color="#888" style={[styles.icon, styles.iconOverlay2]} /> {/* Grey */}
      </View>

      {/* Title */}
      <Text style={styles.title}>Check Your Mail</Text>

      {/* Message */}
      <Text style={styles.message}>
        We have sent you future credentials that you will use to login to the system
      </Text>

      {/* Finish Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SplashScreen')} // Navigate to SplashScreen
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the rest of the content
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  iconContainer: {
    position: 'absolute', // Position the icon container absolutely
    top: 100, // Move the icon a bit towards the middle (adjust this value as needed)
    alignSelf: 'center', // Center the icon horizontally
  },
  icon: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center', // Center the icon horizontally
  },
  iconOverlay: {
    top: 2,
    opacity: 0.7,
  },
  iconOverlay2: {
    top: 4,
    opacity: 0.4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50', // Green color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
});

export default GuestEmailScreen;