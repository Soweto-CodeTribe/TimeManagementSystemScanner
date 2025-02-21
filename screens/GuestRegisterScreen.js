import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon library
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const GuestRegisterScreen = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
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

  const handleRegister = () => {
    setDetailsModalVisible(true); // Show the details modal
  };

  const handleCloseModal = () => {
    setDetailsModalVisible(false); // Close the modal
    navigation.navigate('GuestEmailScreen'); // Navigate to GuestEmailScreen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
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

      {/* Modal for Registered Details */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.detailsModalContainer}>
          <Text style={styles.detailsTitle}>Registered Details</Text>
          <View style={styles.detailsContent}>
            <Text style={styles.detailsLabel}>Email:</Text>
            <Text style={styles.detailsText}>{email}</Text>

            <Text style={styles.detailsLabel}>Full Names:</Text>
            <Text style={styles.detailsText}>{fullNames}</Text>

            <Text style={styles.detailsLabel}>ID Number:</Text>
            <Text style={styles.detailsText}>{idNumber || 'N/A'}</Text>

            <Text style={styles.detailsLabel}>Phone Number:</Text>
            <Text style={styles.detailsText}>{phoneNumber}</Text>

            <Text style={styles.detailsLabel}>Event:</Text>
            <Text style={styles.detailsText}>{selectedEvent}</Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal} // Use handleCloseModal to close the modal and navigate
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200EE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#888', // Grey text color
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
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
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 18,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  detailsContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  detailsLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GuestRegisterScreen;