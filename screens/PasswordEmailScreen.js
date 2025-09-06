import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const PasswordEmailScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/checkPassword.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Check Your Mail</Text>
          <Text style={styles.subtitle}>
            We have sent a password recover instructions to your email
          </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TraineeLoginScreen')} 
        >
          <Text style={styles.buttonText}>
            Finish
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default PasswordEmailScreen;
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
    // paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 24,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40', 
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});