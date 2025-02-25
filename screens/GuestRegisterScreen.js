import React, { useState, useEffect } from 'react'; // Added useEffect
import { Platform, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native'; // React Native components
import { MaterialIcons } from '@expo/vector-icons'; // For React Native icons
import { MdArrowBack, MdEmail, MdPerson, MdCreditCard, MdPhone, MdEvent, MdArrowDropDown, MdCheck } from 'react-icons/md'; // For Web icons

const GuestRegisterScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('Choose Event');
  const [email, setEmail] = useState('');
  const [fullNames, setFullNames] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Loading state for the Registering button
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox

  const events = [
    'React Bootcamp',
    'Code Tribe Orientation',
    'IoT Workshop',
    'Python Workshop',
    'React Native Bootcamp',
    'Soft Skills Program',
    'Other',
  ];

  // Platform-specific icons
  const ArrowBackIcon = Platform.OS === 'web' ? MdArrowBack : MaterialIcons;
  const EmailIcon = Platform.OS === 'web' ? MdEmail : MaterialIcons;
  const PersonIcon = Platform.OS === 'web' ? MdPerson : MaterialIcons;
  const CreditCardIcon = Platform.OS === 'web' ? MdCreditCard : MaterialIcons;
  const PhoneIcon = Platform.OS === 'web' ? MdPhone : MaterialIcons;
  const EventIcon = Platform.OS === 'web' ? MdEvent : MaterialIcons;
  const ArrowDropDownIcon = Platform.OS === 'web' ? MdArrowDropDown : MaterialIcons;
  const CheckIcon = Platform.OS === 'web' ? MdCheck : MaterialIcons;

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

    if (!isChecked) {
      Alert.alert('Agreement Required', 'You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setDetailsModalVisible(true); // Show GuestDetailsScreen modal
  };

  // Automatically trigger the loading process when the modal opens
  useEffect(() => {
    if (detailsModalVisible) {
      setIsRegistering(true); // Show loading indicator
      const timer = setTimeout(() => {
        setIsRegistering(false); // Hide loading indicator
        setDetailsModalVisible(false); // Close GuestDetailsScreen modal
        navigation.navigate('GuestEmailScreen', { email }); // Navigate to GuestEmailScreen with email data
      }, 2000); // Simulate a 2-second registration process

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [detailsModalVisible]); // Trigger effect when detailsModalVisible changes

  // Platform-specific styles
  const styles = {
    container: {
      padding: 20,
      backgroundColor: '#f5f5f5',
      flex: 1,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButtonText: {
      fontSize: 14,
      color: '#000',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 32,
    },
    label: {
      fontSize: 14,
      color: '#888',
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#888',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      height: 40, // Reduced height for text inputs
      paddingHorizontal: 15,
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
      backgroundColor: '#fff',
      width: '70%',
    },
    dropdownText: {
      fontSize: 16,
      color: '#888',
    },
    registerButton: {
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'green', // Green color for the Register button
      marginTop: 25,
    },
    registerButtonText: {
      fontSize: 15,
      color: '#fff', // White text color
      fontWeight: 'bold',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#888',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    checkboxChecked: {
      backgroundColor: '#888',
    },
    checkboxText: {
      fontSize: 14,
      color: '#888',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
    },
    eventItem: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    eventText: {
      fontSize: 16,
      color: '#888',
    },
    detailsModalContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    detailsTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 32,
    },
    detailSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15, // Reduced margin for better spacing
      backgroundColor: '#fff',
      padding: 10, // Reduced padding
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#eee',
    },
    detailTextContainer: {
      flex: 1,
    },
    value: {
      fontSize: 16,
      color: '#000',
    },
    registeringButton: {
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'green',
      marginTop: 25,
    },
    registeringButtonText: {
      fontSize: 15,
      color: '#fff',
      fontWeight: 'bold',
    },
    checkIcon: {
      marginRight: 15,
      backgroundColor: 'green',
      borderRadius: 12,
      padding: 4,
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button with Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowBackIcon name={Platform.OS === 'web' ? undefined : 'arrow-back'} size={24} color="#000" style={{ marginRight: 5 }} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Register As Guest</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <EmailIcon name={Platform.OS === 'web' ? undefined : 'email'} size={24} color="#888" style={{ marginLeft: 15 }} />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Full Names Input */}
      <Text style={styles.label}>Full Names</Text>
      <View style={styles.inputContainer}>
        <PersonIcon name={Platform.OS === 'web' ? undefined : 'person'} size={24} color="#888" style={{ marginLeft: 15 }} />
        <TextInput
          style={styles.input}
          placeholder="Enter your full names"
          value={fullNames}
          onChangeText={setFullNames}
        />
      </View>

      {/* ID Number Input */}
      <Text style={styles.label}>ID Number</Text>
      <View style={styles.inputContainer}>
        <CreditCardIcon name={Platform.OS === 'web' ? undefined : 'credit-card'} size={24} color="#888" style={{ marginLeft: 15 }} />
        <TextInput
          style={styles.input}
          placeholder="Optional"
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="numeric"
          maxLength={13}
        />
      </View>

      {/* Phone Number Input */}
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputContainer}>
        <PhoneIcon name={Platform.OS === 'web' ? undefined : 'phone'} size={24} color="#888" style={{ marginLeft: 15 }} />
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      {/* Event Dropdown */}
      <Text style={styles.label}>Event</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedEvent}</Text>
        <ArrowDropDownIcon name={Platform.OS === 'web' ? undefined : 'arrow-drop-down'} size={24} color="#888" style={{ marginLeft: 10 }} />
      </TouchableOpacity>

      {/* Checkbox for Terms & Conditions */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <CheckIcon name={Platform.OS === 'web' ? undefined : 'check'} size={16} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>I agree to the Terms & Conditions and Privacy Policy.</Text>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Modal for Event Selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {events.map((event, index) => (
              <TouchableOpacity key={index} style={styles.eventItem} onPress={() => handleEventSelection(event)}>
                <Text style={styles.eventText}>{event}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal for GuestDetailsScreen */}
      <Modal
        visible={detailsModalVisible}
        transparent={false}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.detailsModalContainer}>
          {/* Back Button with Arrow */}
          <TouchableOpacity style={styles.backButton} onPress={() => setDetailsModalVisible(false)}>
            <ArrowBackIcon name={Platform.OS === 'web' ? undefined : 'arrow-back'} size={24} color="#000" style={{ marginRight: 5 }} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.detailsTitle}>Register As Guest</Text> {/* Updated heading */}

          {/* Email Section */}
          <View style={styles.detailSection}>
            <EmailIcon name={Platform.OS === 'web' ? undefined : 'email'} size={24} color="#888" style={{ marginRight: 15 }} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
            {validateEmail(email) && (
              <CheckIcon name={Platform.OS === 'web' ? undefined : 'check'} size={20} color="#fff" style={styles.checkIcon} />
            )}
          </View>

          {/* Full Names Section */}
          <View style={styles.detailSection}>
            <PersonIcon name={Platform.OS === 'web' ? undefined : 'person'} size={24} color="#888" style={{ marginRight: 15 }} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Full Names</Text>
              <Text style={styles.value}>{fullNames}</Text>
            </View>
            {fullNames && (
              <CheckIcon name={Platform.OS === 'web' ? undefined : 'check'} size={20} color="#fff" style={styles.checkIcon} />
            )}
          </View>

          {/* ID Number Section */}
          <View style={styles.detailSection}>
            <CreditCardIcon name={Platform.OS === 'web' ? undefined : 'credit-card'} size={24} color="#888" style={{ marginRight: 15 }} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>ID Number</Text>
              <Text style={styles.value}>{idNumber || 'N/A'}</Text>
            </View>
            {idNumber && validateIDNumber(idNumber) && (
              <CheckIcon name={Platform.OS === 'web' ? undefined : 'check'} size={20} color="#fff" style={styles.checkIcon} />
            )}
          </View>

          {/* Phone Number Section */}
          <View style={styles.detailSection}>
            <PhoneIcon name={Platform.OS === 'web' ? undefined : 'phone'} size={24} color="#888" style={{ marginRight: 15 }} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{phoneNumber}</Text>
            </View>
            {validatePhoneNumber(phoneNumber) && (
              <CheckIcon name={Platform.OS === 'web' ? undefined : 'check'} size={20} color="#fff" style={styles.checkIcon} />
            )}
          </View>

          {/* Event Section */}
          <View style={styles.detailSection}>
            <EventIcon name={Platform.OS === 'web' ? undefined : 'event'} size={24} color="#888" style={{ marginRight: 15 }} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.label}>Event</Text>
              <Text style={styles.value}>{selectedEvent}</Text>
            </View>
          </View>

          {/* Checkbox for Terms & Conditions (already ticked) */}
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, styles.checkboxChecked]}>
              <CheckIcon name={Platform.OS === 'web' ? undefined : 'check'} size={16} color="#fff" />
            </View>
            <Text style={styles.checkboxText}>I agree to the Terms & Conditions and Privacy Policy.</Text>
          </View>

          {/* Registering Button */}
          <View style={styles.registeringButton}>
            {isRegistering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registeringButtonText}>Registering...</Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default GuestRegisterScreen;