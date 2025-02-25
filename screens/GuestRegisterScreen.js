import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon library
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const GuestRegisterScreen = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false); // State for GuestDetailsScreen modal
  const [selectedEvent, setSelectedEvent] = useState('Choose Event');
  const [email, setEmail] = useState('');
  const [fullNames, setFullNames] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const events = [
    'React Bootcamp',
    'Code Tribe Orientation',
    'IoT Workshop',
    'Python Workshop',
    'React Native Bootcamp',
    'Soft Skills Program',
    'Other',
  ];

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setModalVisible(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/;
    return regex.test(email);
  };

  const validateIDNumber = (idNumber) => {
    const regex = /^\d{13}$/;
    return regex.test(idNumber);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber);
  };

  const handleRegister = () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address ending with @gmail.com or @yahoo.com.');
      return;
    }

    if (idNumber && !validateIDNumber(idNumber)) {
      Alert.alert('Invalid ID Number', 'Please enter a valid 13-digit South African ID number.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setDetailsModalVisible(true); // Show GuestDetailsScreen modal
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false); // Close GuestDetailsScreen modal
    navigation.navigate('GuestEmailScreen'); // Navigate to GuestEmailScreen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button with Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#000" style={styles.backIcon} /> {/* Back arrow icon */}
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Register As Guest</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Full Names Input */}
      <Text style={styles.label}>Full Names</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your full names"
          placeholderTextColor="#888"
          value={fullNames}
          onChangeText={setFullNames}
        />
      </View>

      {/* ID Number Input */}
      <Text style={styles.label}>ID Number</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Optional"
          placeholderTextColor="#888"
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="numeric"
          maxLength={13}
        />
      </View>

      {/* Phone Number Input */}
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#888"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      {/* Event Dropdown */}
      <Text style={styles.label}>Event</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{selectedEvent}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#888" style={styles.dropdownIcon} />
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Modal for Event Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)} // Close modal when clicking outside
        >
          <View style={styles.modalContent}>
            {events.map((event, index) => (
              <Pressable
                key={index}
                style={styles.eventItem}
                onPress={() => handleEventSelection(event)}
              >
                <Text style={styles.eventText}>{event}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Modal for GuestDetailsScreen */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.detailsModalContainer}>
          {/* Back Button with Arrow */}
          <TouchableOpacity style={styles.backButton} onPress={handleCloseDetailsModal}>
            <MaterialIcons name="arrow-back" size={24} color="#000" style={styles.backIcon} /> {/* Back arrow icon */}
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.detailsTitle}>Guest Details</Text>

          {/* Email Section */}
          <View style={styles.detailSection}>
            <MaterialIcons name="email" size={24} color="#888" style={styles.icon} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
          </View>

          {/* Full Names Section */}
          <View style={styles.detailSection}>
            <MaterialIcons name="person" size={24} color="#888" style={styles.icon} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Full Names</Text>
              <Text style={styles.value}>{fullNames}</Text>
            </View>
          </View>

          {/* ID Number Section */}
          <View style={styles.detailSection}>
            <MaterialIcons name="credit-card" size={24} color="#888" style={styles.icon} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>ID Number</Text>
              <Text style={styles.value}>{idNumber || 'N/A'}</Text>
            </View>
          </View>

          {/* Phone Number Section */}
          <View style={styles.detailSection}>
            <MaterialIcons name="phone" size={24} color="#888" style={styles.icon} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{phoneNumber}</Text>
            </View>
          </View>

          {/* Event Section */}
          <View style={styles.detailSection}>
            <MaterialIcons name="event" size={24} color="#888" style={styles.icon} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Event</Text>
              <Text style={styles.value}>{selectedEvent}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center items vertically
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 5, // Space between icon and text
  },
  backButtonText: {
    fontSize: 10,
    color: '#000', // Black text color
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#888', // Grey text color
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  icon: {
    marginLeft: 15,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    width: '70%', // Smaller width for the dropdown
  },
  dropdownText: {
    fontSize: 16,
    color: '#888',
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  registerButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // Very light grey
    marginTop: 25,
  },
  registerButtonText: {
    fontSize: 15,
    color: '#888', // Grey text
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  eventItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  eventText: {
    fontSize: 16,
    color: '#888', // Grey text color
  },
  detailsModalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  detailTextContainer: {
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});

export default GuestRegisterScreen;