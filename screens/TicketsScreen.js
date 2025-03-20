import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TicketScreen = ({ navigation }) => {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'bug',
    assignee: '',
  });
  const [errors, setErrors] = useState({});

  const priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  const categories = [
    { label: 'Bug', value: 'bug' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Technical Support', value: 'support' },
    { label: 'Documentation', value: 'docs' },
    { label: 'Other', value: 'other' },
  ];

  const handleChange = (field, value) => {
    setTicketData({
      ...ticketData,
      [field]: value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!ticketData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (ticketData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!ticketData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (ticketData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!ticketData.assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically make an API call to create the ticket
      console.log('Submitting ticket:', ticketData);
      Alert.alert(
        'Success',
        'Ticket created successfully!',
        [{ text: 'OK', onPress: () => resetForm() }]
      );
    } else {
      Alert.alert('Error', 'Please fix the errors in the form');
    }
  };

  const resetForm = () => {
    setTicketData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'bug',
      assignee: '',
    });
    setErrors({});
  };

  const handleBack = () => {
    // You can add confirmation if form has changes
    if (ticketData.title || ticketData.description || ticketData.assignee) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to go back? All changes will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Ticket</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Enter ticket title"
              value={ticketData.title}
              onChangeText={(text) => handleChange('title', text)}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe the issue or request"
              multiline
              numberOfLines={4}
              value={ticketData.description}
              onChangeText={(text) => handleChange('description', text)}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ticketData.priority}
                style={styles.picker}
                onValueChange={(value) => handleChange('priority', value)}
              >
                {priorities.map((priority) => (
                  <Picker.Item 
                    key={priority.value} 
                    label={priority.label} 
                    value={priority.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ticketData.category}
                style={styles.picker}
                onValueChange={(value) => handleChange('category', value)}
              >
                {categories.map((category) => (
                  <Picker.Item 
                    key={category.value} 
                    label={category.label} 
                    value={category.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Assignee</Text>
            <TextInput
              style={[styles.input, errors.assignee && styles.inputError]}
              placeholder="Who should handle this ticket?"
              value={ticketData.assignee}
              onChangeText={(text) => handleChange('assignee', text)}
            />
            {errors.assignee && <Text style={styles.errorText}>{errors.assignee}</Text>}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Create Ticket</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop:40
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: '500',
  },
  headerSpacer: {
    width: 48, // To balance the back button width
  },
  scrollContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TicketScreen;