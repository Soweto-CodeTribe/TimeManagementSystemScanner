// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Switch,
//   SafeAreaView,
//   StatusBar,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const SettingsScreen = ({ navigation }) => {
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
//   const [checkInRemindersEnabled, setCheckInRemindersEnabled] = useState(false);
//   const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="chevron-back" size={24} color="#999999" />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Settings</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Account Settings Section */}
//       {/* <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionHeaderText}>Account settings</Text>
//         </View>

//         <View style={styles.settingItem}>
//           <View style={styles.settingTextContainer}>
//             <Text style={styles.settingTitle}>Two factor authentication</Text>
//             <Text style={styles.settingDescription}>
//               Add an extra layer of security in your account
//             </Text>
//           </View>
//           <Switch
//             trackColor={{ false: "#E5E5E5", true: "#8E8E93" }}
//             thumbColor={twoFactorEnabled ? "#FFFFFF" : "#FFFFFF"}
//             ios_backgroundColor="#E5E5E5"
//             onValueChange={() =>
//               setTwoFactorEnabled((previousState) => !previousState)
//             }
//             value={twoFactorEnabled}
//           />
//         </View>
//       </View> */}

//       {/* Notification Settings Section */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionHeaderText}>Notification Settings</Text>
//         </View>

//         <View style={styles.settingItem}>
//           <View style={styles.settingTextContainer}>
//             <Text style={styles.settingTitle}>Check-in Reminders</Text>
//             <Text style={styles.settingDescription}>
//               Allow the reminder to check in
//             </Text>
//           </View>
//           <Switch
//             trackColor={{ false: "#E5E5E5", true: "#8E8E93" }}
//             thumbColor={checkInRemindersEnabled ? "#FFFFFF" : "#FFFFFF"}
//             ios_backgroundColor="#E5E5E5"
//             onValueChange={() =>
//               setCheckInRemindersEnabled((previousState) => !previousState)
//             }
//             value={checkInRemindersEnabled}
//           />
//         </View>
//       </View>

//       {/* Privacy Settings Section */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionHeaderText}>Privacy settings</Text>
//         </View>

//         {/* <View style={styles.settingItem}>
//           <View style={styles.settingTextContainer}>
//             <Text style={styles.settingTitle}>Location Service</Text>
//             <Text style={styles.settingDescription}>Allow the app to access your location</Text>
//           </View>
//           <Switch
//             trackColor={{ false: '#E5E5E5', true: '#8E8E93' }}
//             thumbColor={locationServiceEnabled ? '#FFFFFF' : '#FFFFFF'}
//             ios_backgroundColor="#E5E5E5"
//             onValueChange={() => setLocationServiceEnabled(previousState => !previousState)}
//             value={locationServiceEnabled}
//           />
//         </View> */}

//         <TouchableOpacity
//           style={styles.resetPermissionsButton}
//           onPress={async () => {
//             await AsyncStorage.removeItem("locationPermissionGranted");
//             await AsyncStorage.removeItem("cameraPermissionGranted");
//             Alert.alert(
//               "Permissions Reset",
//               "Permission prompts will be shown again next time they are needed."
//             );
//           }}
//         >
//           <Text style={styles.settingTitle}>Reset Permissions</Text>
//           <Text style={styles.settingDescription}>
//           Permission prompts will be shown again next time they are needed.            </Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity style={styles.deleteAccountButton}>
//           <Text style={styles.deleteAccountText}>Delete Account</Text>
//         </TouchableOpacity> */}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     marginTop: 40,
//     borderBottomColor: "#F5F5F5",
//   },
//   backButton: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   backArrow: {
//     fontSize: 18,
//     color: "#000000",
//     marginRight: 2,
//   },
//   backText: {
//     color: "#000000",
//     fontWeight: "400",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "500",
//     color: "#888888",
//   },
//   placeholder: {
//     width: 60,
//   },
//   section: {
//     marginBottom: 16,
//   },
//   sectionHeader: {
//     backgroundColor: "#F5F5F5",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   sectionHeaderText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#000000",
//   },
//   settingItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F5F5F5",
//   },
//   settingTextContainer: {
//     flex: 1,
//   },
//   settingTitle: {
//     fontSize: 16,
//     fontWeight: "400",
//     color: "#000000",
//     marginBottom: 4,
//   },
//   settingDescription: {
//     fontSize: 14,
//     color: "#888888",
//   },
//   deleteAccountButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   deleteAccountText: {
//     fontSize: 16,
//     fontWeight: "400",
//     color: "#000000",
//   },
//   resetPermissionsButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   resetPermissionsText: {
//     fontSize: 16,
//     fontWeight: "400",
//     color: "#8E8E93",
//   },
// });

// export default SettingsScreen;

// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../Components/NotificationService';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(enabled !== 'false'); // Default to true
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      setNotificationsEnabled(value);
      await NotificationService.setNotificationsEnabled(value);
      
      // Show confirmation
      Alert.alert(
        'Notifications Updated',
        value 
          ? 'You will now receive daily check-in reminders at 8:00 AM and 12:00 PM'
          : 'Push notifications have been disabled. You won\'t receive any reminders.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error toggling notifications:', error);
      // Revert on error
      setNotificationsEnabled(!value);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const testNotification = async () => {
    try {
      await NotificationService.sendImmediateNotification(
        'Test Notification 🔔',
        'This is a test notification to verify everything is working!',
        { type: 'test' }
      );
      Alert.alert('Test Sent', 'Check your notifications!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const showScheduledNotifications = async () => {
    try {
      const notifications = await NotificationService.getScheduledNotifications();
      const count = notifications.length;
      Alert.alert(
        'Scheduled Notifications',
        `You have ${count} scheduled notifications.\n\n${
          count > 0 
            ? 'Morning reminder: 8:00 AM daily\nLunch reminder: 12:00 PM daily'
            : 'No notifications scheduled'
        }`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get notification info');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Text style={styles.settingDescription}>
                Get reminded to check in at 8:00 AM and lunch at 12:00 PM
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#8BC34A' }}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {/* Test Notification Button */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={testNotification}
          >
            <Ionicons name="notifications-outline" size={20} color="#8BC34A" />
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>

          {/* Show Scheduled Notifications */}
          <TouchableOpacity
            style={styles.infoButton}
            onPress={showScheduledNotifications}
          >
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.infoButtonText}>View Scheduled Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Other Settings Sections */}
        

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Help & FAQ</Text>
              <Text style={styles.settingDescription}>
                Get help and find answers
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Contact Support</Text>
              <Text style={styles.settingDescription}>
                Reach out to our support team
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 60,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  testButtonText: {
    fontSize: 16,
    color: '#8BC34A',
    marginLeft: 10,
    fontWeight: '500',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  infoButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
});

export default SettingsScreen;