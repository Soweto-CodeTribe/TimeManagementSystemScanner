import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  FlatList,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const TicketScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [traineeId, setTraineeId] = useState('');
  const [token, setToken] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'bug',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ID = await AsyncStorage.getItem('traineeID');
        const Token = await AsyncStorage.getItem('token');
        
        const traineeIdString = ID ? String(ID) : '';
        
        setToken(Token);
        setTraineeId(traineeIdString);

        if (Token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${Token}`;
          if (traineeIdString) {
            fetchTickets(Token, traineeIdString);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        Alert.alert('Error', 'Failed to load user data. Please log in again.');
      }
    };
    fetchUserData();
  }, []);

  const fetchTickets = async (authToken = token, userId = traineeId) => {
    if (!authToken || !userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/tickets/trainee/${userId}/tickets`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setTickets(response.data);
    } catch (error) {
      console.error('Fetch tickets error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTicketData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'bug',
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setTicketData({
      ...ticketData,
      [field]: value,
    });
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTicket = async () => {
    if (!token || !traineeId) {
      Alert.alert('Error', 'Authorization required. Please log in again.');
      return;
    }

    if (validateForm()) {
      try {
        setLoading(true);
        await axios.post(
          `https://timemanagementsystemserver.onrender.com/api/tickets?traineeId=${traineeId}`,
          {
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority,
            category: ticketData.category,
            traineeId: String(traineeId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        Alert.alert('Success', 'Ticket created successfully!');
        setIsCreateModalVisible(false);
        resetForm();
        fetchTickets();
      } catch (error) {
        console.error('Create ticket error:', error.response?.data || error.message);
        const errorMsg = error.response?.data?.error || 'Failed to create ticket';
        Alert.alert('Error', errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fix the errors in the form');
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!token || !traineeId) {
      Alert.alert('Error', 'Authorization required. Please log in again.');
      return;
    }
  
    Alert.alert(
      'Cancel Ticket',
      'Are you sure you want to cancel this ticket? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.post(
                `https://timemanagementsystemserver.onrender.com/api/tickets/my-tickets/${ticketId}/cancel?traineeId=${traineeId}`,
                {
                  traineeId: String(traineeId),
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              
              Alert.alert('Success', 'Ticket has been canceled');
              setIsDetailModalVisible(false);
              fetchTickets();
            } catch (error) {
              console.error('Cancel ticket error:', error.response?.data || error.message);
              const errorMsg = error.response?.data?.error || 'Failed to cancel ticket';
              Alert.alert('Error', errorMsg);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditSetup = (ticket) => {
    setTicketData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority || 'medium',
      category: ticket.category || 'bug',
    });
    setCurrentTicket(ticket);
    setIsDetailModalVisible(false);
    setIsEditModalVisible(true);
  };

  const handleUpdateTicket = async () => {
    if (!token || !traineeId || !currentTicket) {
      Alert.alert('Error', 'Missing required information. Please try again.');
      return;
    }

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.put(
          `https://timemanagementsystemserver.onrender.com/api/tickets/my-tickets/${currentTicket.id}?traineeId=${traineeId}`,
          {
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority,
            category: ticketData.category,
            traineeId: String(traineeId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        Alert.alert('Success', 'Ticket updated successfully!');
        setIsEditModalVisible(false);
        resetForm();
        fetchTickets();
      } catch (error) {
        console.error('Update ticket error:', error.response?.data || error.message);
        const errorMsg = error.response?.data?.error || 'Failed to update ticket';
        Alert.alert('Error', errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fix the errors in the form');
    }
  };

  const handleViewTicket = async (ticketId) => {
    if (!token || !traineeId) {
      Alert.alert('Error', 'Authorization required. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/tickets/my-tickets/${ticketId}?traineeId=${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCurrentTicket(response.data);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error('View ticket error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || 'Failed to fetch ticket details';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleViewTicket(item.id)}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: '#8BC34A20' }]}>
          <Ionicons name="ticket-outline" size={20} color="#8BC34A" />
        </View>
        <View style={styles.ticketContent}>
          <Text style={styles.menuItemText} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.ticketSubtext} numberOfLines={1}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { 
          color: item.status === 'closed' ? '#4CAF50' : 
                 item.status === 'cancelled' ? '#F44336' : 
                 item.status === 'in-progress' ? '#FFC107' : '#2196F3'
        }]}>
          {item.status}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#2196F3';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#999999" />
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>Support Tickets</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BC34A" />
        </View>
      )}

      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.menuContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={64} color="#999999" />
              <Text style={styles.emptyText}>No tickets found</Text>
              <Text style={styles.emptySubtext}>
                Create a new ticket to get help from our support team
              </Text>
            </View>
          ) : null
        }
      />

      {/* Floating Create Ticket Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          resetForm();
          setIsCreateModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Ticket Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Ticket</Text>
              <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Enter ticket title"
                  value={ticketData.title}
                  onChangeText={(text) => handleChange('title', text)}
                  placeholderTextColor="#999999"
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the issue or request in detail"
                  multiline
                  numberOfLines={6}
                  value={ticketData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholderTextColor="#999999"
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={ticketData.priority}
                    onValueChange={(value) => handleChange('priority', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Low" value="low" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="High" value="high" />
                    <Picker.Item label="Critical" value="critical" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={ticketData.category}
                    onValueChange={(value) => handleChange('category', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Bug" value="bug" />
                    <Picker.Item label="Feature Request" value="feature" />
                    <Picker.Item label="Technical Support" value="support" />
                    <Picker.Item label="Documentation" value="docs" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleCreateTicket}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.editProfileText}>Create Ticket</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Ticket Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Ticket</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Enter ticket title"
                  value={ticketData.title}
                  onChangeText={(text) => handleChange('title', text)}
                  placeholderTextColor="#999999"
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the issue or request in detail"
                  multiline
                  numberOfLines={6}
                  value={ticketData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholderTextColor="#999999"
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={ticketData.priority}
                    onValueChange={(value) => handleChange('priority', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Low" value="low" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="High" value="high" />
                    <Picker.Item label="Critical" value="critical" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={ticketData.category}
                    onValueChange={(value) => handleChange('category', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Bug" value="bug" />
                    <Picker.Item label="Feature Request" value="feature" />
                    <Picker.Item label="Technical Support" value="support" />
                    <Picker.Item label="Documentation" value="docs" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleUpdateTicket}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.editProfileText}>Update Ticket</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Ticket Details Modal */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ticket Details</Text>
              <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            {currentTicket && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{currentTicket.title}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="document-text-outline" size={16} color="#8BC34A" />
                    <Text style={styles.locationText}>{currentTicket.category}</Text>
                  </View>
                </View>

                <View style={[styles.menuItem, { marginTop: 15 }]}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#8BC34A20' }]}>
                      <Ionicons name="flag-outline" size={20} color="#8BC34A" />
                    </View>
                    <View>
                      <Text style={styles.menuItemText}>Priority</Text>
                      <Text style={[styles.ticketSubtext, { 
                        color: getPriorityColor(currentTicket.priority) 
                      }]}>
                        {currentTicket.priority}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#8BC34A20' }]}>
                      <Ionicons name="time-outline" size={20} color="#8BC34A" />
                    </View>
                    <View>
                      <Text style={styles.menuItemText}>Status</Text>
                      <Text style={[styles.ticketSubtext, { 
                        color: currentTicket.status === 'closed' ? '#4CAF50' : 
                               currentTicket.status === 'cancelled' ? '#F44336' : 
                               currentTicket.status === 'in-progress' ? '#FFC107' : '#2196F3'
                      }]}>
                        {currentTicket.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#8BC34A20' }]}>
                      <Ionicons name="calendar-outline" size={20} color="#8BC34A" />
                    </View>
                    <View>
                      <Text style={styles.menuItemText}>Created At</Text>
                      <Text style={styles.ticketSubtext}>
                        {new Date(currentTicket.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {currentTicket.updatedAt && (
                  <View style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: '#8BC34A20' }]}>
                        <Ionicons name="refresh-outline" size={20} color="#8BC34A" />
                      </View>
                      <View>
                        <Text style={styles.menuItemText}>Last Updated</Text>
                        <Text style={styles.ticketSubtext}>
                          {new Date(currentTicket.updatedAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.descriptionContainer}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={styles.descriptionText}>{currentTicket.description}</Text>
                </View>

                {currentTicket.status === 'open' && (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.editButton, { backgroundColor: '#8BC34A' }]}
                      onPress={() => handleEditSetup(currentTicket)}
                    >
                      <Text style={styles.buttonText}>Edit Ticket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editButton, { backgroundColor: '#F44336' }]}
                      onPress={() => handleCancelTicket(currentTicket.id)}
                    >
                      <Text style={styles.buttonText}>Cancel Ticket</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    marginTop: 40,
  },
  backButton: {
    padding: 5,
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#666666",
  },
  ticketContent: {
    flex: 1,
    flexDirection: "column",
  },
  ticketSubtext: {
    fontSize: 12,
    color: "#999999",
  },
  statusBadge: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8BC34A',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 30,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  editProfileButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  editProfileText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#8BC34A',
    marginLeft: 4,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TicketScreen;