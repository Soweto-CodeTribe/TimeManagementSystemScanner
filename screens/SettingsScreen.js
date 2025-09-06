import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen = ({ navigation }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [checkInRemindersEnabled, setCheckInRemindersEnabled] = useState(false);
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
         <Ionicons name="chevron-back" size={24} color="#999999" /> 
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Account settings</Text>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Two factor authentication</Text>
            <Text style={styles.settingDescription}>Add an extra layer of security in your account</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E5E5', true: '#8E8E93' }}
            thumbColor={twoFactorEnabled ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#E5E5E5"
            onValueChange={() => setTwoFactorEnabled(previousState => !previousState)}
            value={twoFactorEnabled}
          />
        </View>
      </View>

      {/* Notification Settings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Notification Settings</Text>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Check-in Reminders</Text>
            <Text style={styles.settingDescription}>Allow the reminder to check in</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E5E5', true: '#8E8E93' }}
            thumbColor={checkInRemindersEnabled ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#E5E5E5"
            onValueChange={() => setCheckInRemindersEnabled(previousState => !previousState)}
            value={checkInRemindersEnabled}
          />
        </View>
      </View>

      {/* Privacy Settings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Privacy settings</Text>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Location Service</Text>
            <Text style={styles.settingDescription}>Allow the app to access your location</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E5E5', true: '#8E8E93' }}
            thumbColor={locationServiceEnabled ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#E5E5E5"
            onValueChange={() => setLocationServiceEnabled(previousState => !previousState)}
            value={locationServiceEnabled}
          />
        </View>

        <TouchableOpacity style={styles.deleteAccountButton}>
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop:40,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#000000',
    marginRight: 2,
  },
  backText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#888888',
  },
  placeholder: {
    width: 60,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888888',
  },
  deleteAccountButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  deleteAccountText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
});

export default SettingsScreen;