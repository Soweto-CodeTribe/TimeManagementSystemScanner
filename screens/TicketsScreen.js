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
  Modal,
  RefreshControl
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Color palette - updated to be less "green heavy" but with green accents
const COLORS = {
  primary: '#4CAF50', // Primary green
  primaryDark: '#388E3C', // Dark green for accents
  accent: '#66BB6A', // Light green for buttons and highlights
  background: '#F9FAFB', // Light gray-white for background
  surface: '#FFFFFF', // White for cards and surfaces
  text: '#1F2937', // Dark gray for text
  textSecondary: '#6B7280', // Medium gray for secondary text
  border: '#E5E7EB', // Light gray for borders
  error: '#EF4444', // Red for errors
  success: '#10B981', // Green for success messages
  warning: '#F59E0B', // Amber for warnings
  info: '#3B82F6', // Blue for info
  disabled: 'rgba(0, 0, 0, 0.38)'
};

const TicketScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
        
        // Ensure ID is a string
        const traineeIdString = ID ? String(ID) : '';
        
        setToken(Token);
        setTraineeId(traineeIdString);

        // Set default axios auth header once token is available
        if (Token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${Token}`;
          // Fetch tickets after setting token and traineeId
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

  // Fetch all tickets for the authenticated user
  const fetchTickets = async (authToken = token, userId = traineeId) => {
    if (!authToken || !userId) {
      console.log('Missing auth token or user ID');
      return;
    }
    
    try {
      setLoading(true);
      // Fix the endpoint to use proper API route
      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/tickets/trainee/${userId}/tickets`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setTickets(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Fetch tickets error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch tickets. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  // Reset form data and errors
  const resetForm = () => {
    setTicketData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'bug',
    });
    setErrors({});
  };

  // Handle form input changes
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

  // Validate form inputs
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

  // Handle ticket creation
  const handleCreateTicket = async () => {
    if (!token || !traineeId) {
      Alert.alert('Error', 'Authorization required. Please log in again.');
      return;
    }

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post(
          `https://timemanagementsystemserver.onrender.com/api/tickets?traineeId=${traineeId}`,
          {
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority,
            category: ticketData.category,
            traineeId: String(traineeId), // Ensure traineeId is a string
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

  // Handle viewing a ticket's details - FIXED
  const handleViewTicket = async (ticketId) => {
    if (!token || !traineeId) {
      Alert.alert('Error', 'Authorization required. Please log in again.');
      return;
    }
  
    try {
      setLoading(true);
      
      // Using axios.request() to configure a GET request with a body
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

  // Setup for editing a ticket
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

  // Handle updating a ticket
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
            traineeId: String(traineeId), // Ensure traineeId is a string
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

  // Handle canceling a ticket
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
                  traineeId: String(traineeId), // Ensure traineeId is a string
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

  // Get status color based on ticket status
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return COLORS.info;
      case 'in-progress':
        return COLORS.warning;
      case 'resolved':
        return COLORS.success;
      case 'closed':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
    }
  };

  // Get priority color based on ticket priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return COLORS.info;
      case 'medium':
        return COLORS.warning;
      case 'high':
        return COLORS.error;
      case 'critical':
        return '#B91C1C'; // Darker red for critical
      default:
        return COLORS.info;
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render a single ticket item
  const renderTicketItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketItem}
      onPress={() => handleViewTicket(item.id)}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.ticketDescription} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.ticketFooter}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
        <Text style={styles.ticketDate}>{formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Tickets</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            resetForm();
            setIsCreateModalVisible(true);
          }}
        >
          <Text style={styles.createButtonText}>New Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* List of Tickets */}
      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ticketList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No tickets found</Text>
              <Text style={styles.emptySubtext}>
                Create a new ticket to get help from our support team
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => {
                  resetForm();
                  setIsCreateModalVisible(true);
                }}
              >
                <Text style={styles.emptyButtonText}>Create Ticket</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

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
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Title Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Enter ticket title"
                  value={ticketData.title}
                  onChangeText={(text) => handleChange('title', text)}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the issue or request in detail"
                  multiline
                  numberOfLines={6}
                  value={ticketData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              {/* Priority Picker */}
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

              {/* Category Picker */}
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

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateTicket}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.surface} />
                ) : (
                  <Text style={styles.submitButtonText}>Create Ticket</Text>
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
              <Text style={styles.modalTitle}>Update Ticket</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Title Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Enter ticket title"
                  value={ticketData.title}
                  onChangeText={(text) => handleChange('title', text)}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the issue or request in detail"
                  multiline
                  numberOfLines={6}
                  value={ticketData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              {/* Priority Picker */}
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

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateTicket}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.surface} />
                ) : (
                  <Text style={styles.submitButtonText}>Update Ticket</Text>
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
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {currentTicket && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>{currentTicket.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentTicket.status) }]}>
                    <Text style={styles.statusText}>{currentTicket.status}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{currentTicket.category}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Priority:</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(currentTicket.priority) }]}>
                    <Text style={styles.priorityText}>{currentTicket.priority}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>{formatDate(currentTicket.createdAt)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Updated:</Text>
                  <Text style={styles.detailValue}>{formatDate(currentTicket.updatedAt)}</Text>
                </View>
                
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Description:</Text>
                  <Text style={styles.descriptionText}>{currentTicket.description}</Text>
                </View>
                
                {/* Actions buttons only for open tickets */}
                {currentTicket.status === 'open' && (
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditSetup(currentTicket)}
                    >
                      <Ionicons name="create-outline" size={18} color={COLORS.surface} />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelTicket(currentTicket.id)}
                    >
                      <Ionicons name="close-circle-outline" size={18} color={COLORS.surface} />
                      <Text style={styles.actionButtonText}>Cancel</Text>
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

// Styles would be defined here


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 25,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
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
  ticketList: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for better scrolling
  },
  ticketItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  ticketDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: '600',
  },
  ticketDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: COLORS.info,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.warning,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  }
});

export default TicketScreen