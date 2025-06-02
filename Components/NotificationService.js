// services/NotificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.isInitialized = false;
  }

  // Initialize notification service
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions and get token
      const token = await this.registerForPushNotificationsAsync();
      
      if (token) {
        console.log('Notification token:', token);
        // Store token if needed for server communication
        await AsyncStorage.setItem('notificationToken', token);
      }

      // Set up listeners
      this.setupNotificationListeners();
      
      // Schedule daily reminders
      await this.scheduleDailyReminders();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  // Request notification permissions and get token
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Handle notification received while app is open
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const { data } = response.notification.request.content;
      
      // Handle navigation based on notification type
      if (data?.type === 'checkin_reminder') {
        // Navigate to scanner or home screen
        // You'll need to pass navigation reference here
        this.handleCheckinReminderTap(data);
      }
    });
  }

  // Handle when user taps on check-in reminder
  handleCheckinReminderTap(data) {
    // This would need navigation reference passed from App.js
    // For now, just log the action
    console.log('User tapped check-in reminder:', data);
  }

  // Schedule daily recurring reminders
  async scheduleDailyReminders() {
    try {
      // Check if notifications are enabled in settings
      const notificationsEnabled = await this.areNotificationsEnabled();
      if (!notificationsEnabled) {
        console.log('Notifications disabled by user');
        return;
      }

      // Cancel existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule morning check-in reminder (8:00 AM daily)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Morning! 🌅",
          body: "Don't forget to check in for today. Start your day right!",
          data: { 
            type: 'checkin_reminder', 
            period: 'morning' 
          },
          sound: true,
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      // Schedule lunch check-in reminder (12:00 PM daily)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lunch Break Time! 🍽️",
          body: "Remember to check in for your lunch break.",
          data: { 
            type: 'checkin_reminder', 
            period: 'lunch' 
          },
          sound: true,
        },
        trigger: {
          hour: 12,
          minute: 0,
          repeats: true,
        },
      });

      console.log('Daily reminders scheduled successfully');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  // Check if notifications are enabled in user settings
  async areNotificationsEnabled() {
    try {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      return enabled !== 'false'; // Default to true if not set
    } catch (error) {
      console.error('Error checking notification settings:', error);
      return true; // Default to enabled
    }
  }

  // Enable/disable notifications (called from settings)
  async setNotificationsEnabled(enabled) {
    try {
      await AsyncStorage.setItem('notificationsEnabled', enabled.toString());
      
      if (enabled) {
        // Re-schedule notifications
        await this.scheduleDailyReminders();
      } else {
        // Cancel all scheduled notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      
      console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  // Send immediate notification (for testing or special cases)
  async sendImmediateNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  // Get all scheduled notifications (for debugging)
  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Scheduled notifications:', notifications);
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Cleanup listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Custom reminder times (for premium features or user customization)
  async scheduleCustomReminder(hour, minute, title, body, data = {}) {
    try {
      const notificationsEnabled = await this.areNotificationsEnabled();
      if (!notificationsEnabled) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling custom reminder:', error);
    }
  }
}

// Export singleton instance
export default new NotificationService();