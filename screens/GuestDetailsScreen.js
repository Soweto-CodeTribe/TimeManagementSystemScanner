import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons
import { useRoute } from '@react-navigation/native'; // To access route params

const GuestDetailsScreen = () => {
  const route = useRoute();
  const { email, fullNames, idNumber, phoneNumber, selectedEvent } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Guest Details</Text>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
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
  icon: {
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});

export default GuestDetailsScreen;