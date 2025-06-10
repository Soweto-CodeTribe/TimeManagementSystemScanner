
// screens/SettingsScreen.js
import React, { useState, useEffect } from "react";
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
  Modal,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationService from "../Components/NotificationService";

const { height: screenHeight } = Dimensions.get("window");

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem("notificationsEnabled");
      setNotificationsEnabled(enabled !== "false"); // Default to true
    } catch (error) {
      console.error("Error loading notification settings:", error);
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
        "Notifications Updated",
        value
          ? "You will now receive daily check-in reminders at 8:00 AM and 12:00 PM"
          : "Push notifications have been disabled. You won't receive any reminders.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error toggling notifications:", error);
      // Revert on error
      setNotificationsEnabled(!value);
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  const testNotification = async () => {
    try {
      await NotificationService.sendImmediateNotification(
        "Test Notification 🔔",
        "This is a test notification to verify everything is working!",
        { type: "test" }
      );
      Alert.alert("Test Sent", "Check your notifications!");
    } catch (error) {
      Alert.alert("Error", "Failed to send test notification");
    }
  };

  const showScheduledNotifications = async () => {
    try {
      const notifications =
        await NotificationService.getScheduledNotifications();
      const count = notifications.length;
      Alert.alert(
        "Scheduled Notifications",
        `You have ${count} scheduled notifications.\n\n${count > 0
          ? "Morning reminder: 8:00 AM daily\nLunch reminder: 12:00 PM daily"
          : "No notifications scheduled"
        }`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to get notification info");
    }
  };

  // Modal animation functions
  const showModal = (setModalVisible) => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = (setModalVisible) => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  // Handle external links
  const openURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open link");
    }
  };

  // FAQ Items
  const faqItems = [
    {
      question: "How do I enable notifications?",
      answer:
        "Go to Settings > Notifications and toggle the Daily Reminders switch.",
    },
    {
      question: "When will I receive reminders?",
      answer:
        "You'll receive reminders at 8:00 AM and 12:00 PM daily when notifications are enabled.",
    },
    {
      question: "How do I reset my data?",
      answer:
        "Currently, data reset is not available. Contact support if you need assistance.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, all your data is stored locally on your device and is not shared with third parties.",
    },
  ];

  // Help Modal Component
  const HelpModal = () => (
    <Modal
      transparent={true}
      visible={helpModalVisible}
      animationType="none"
      onRequestClose={() => hideModal(setHelpModalVisible)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => hideModal(setHelpModalVisible)}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => hideModal(setHelpModalVisible)}
              style={styles.closeButton}
            >
              <View style={styles.closeLine} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Help & FAQ</Text>
          </View>

          <ScrollView style={styles.modalContent}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  // Contact Modal Component
  const ContactModal = () => (
    <Modal
      transparent={true}
      visible={contactModalVisible}
      animationType="none"
      onRequestClose={() => hideModal(setContactModalVisible)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => hideModal(setContactModalVisible)}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => hideModal(setContactModalVisible)}
              style={styles.closeButton}
            >
              <View style={styles.closeLine} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Support</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.contactDescription}>
              Get in touch with our support team:
            </Text>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => openURL("mailto:support@yourapp.com")}
            >
              <Ionicons name="mail-outline" size={24} color="#8BC34A" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email Support</Text>
                <Text style={styles.contactValue}>elevenbit@support.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => openURL("tel:+1234567890")}
            >
              <Ionicons name="call-outline" size={24} color="#8BC34A" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone Support</Text>
                <Text style={styles.contactValue}>+27 (660) 850-741</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => openURL("https://elevenbit.com")}
            >
              <Ionicons name="globe-outline" size={24} color="#8BC34A" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Online Support</Text>
                <Text style={styles.contactValue}>Visit our help center</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.supportHours}>
              <Text style={styles.supportHoursTitle}>Support Hours</Text>
              <Text style={styles.supportHoursText}>
                Monday - Friday: 9 AM - 6 PM EST
              </Text>
              <Text style={styles.supportHoursText}>
                Saturday - Sunday: 10 AM - 2 PM EST
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

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
            <Ionicons name="chevron-back" size={24} color="#999999" />
            <Text style={styles.backtext}>Back</Text>
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
              trackColor={{ false: "#767577", true: "#8BC34A" }}
              thumbColor={notificationsEnabled ? "#4CAF50" : "#f4f3f4"}
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
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
            />
            <Text style={styles.infoButtonText}>
              View Scheduled Notifications
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={async () => {
              await AsyncStorage.removeItem("locationPermissionGranted");
              await AsyncStorage.removeItem("cameraPermissionGranted");
              await AsyncStorage.removeItem("inLocationAndVerified");
              Alert.alert(
                "Permissions Reset",
                "Permission prompts will be shown again next time they are needed."
              );
            }}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Reset Permissions</Text>
              <Text style={styles.settingDescription}>
                Reach out to our support team
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => showModal(setHelpModalVisible)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Help & FAQ</Text>
              <Text style={styles.settingDescription}>
                Get help and find answers
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => showModal(setContactModalVisible)}
          >
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

      {/* Modals */}
      <HelpModal />
      <ContactModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    minHeight: 60,
    width: "100%",
  },
  backButton: {
    paddingVertical: 5,
    zIndex: 10,
    flexDirection: "row",
  },
  backtext: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
    marginLeft: 70,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  testButtonText: {
    fontSize: 16,
    color: "#8BC34A",
    marginLeft: 10,
    fontWeight: "500",
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  infoButtonText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.72,
  },
  modalHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeLine: {
    height: 4,
    width: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  // FAQ Styles
  faqItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  // Contact Styles
  contactDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: "#666",
  },
  supportHours: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  supportHoursTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  supportHoursText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});

export default SettingsScreen;
