
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ReadMessagePopup from "../Components/ReadMessagePopup";

// Replace with your actual API base URL
const API_BASE_URL = "https://timemanagementsystemserver.onrender.com/api";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Get trainee ID and token from AsyncStorage
      const traineeId = await AsyncStorage.getItem("traineeID");
      const token = await AsyncStorage.getItem("token");

      if (!traineeId || !token) {
        throw new Error("You need to login first");
      }

      // Fetch notifications from the backend
      const response = await axios.get(
        `${API_BASE_URL}/notifications/${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Format the notifications data
      const formattedNotifications = response.data.notifications.map(notification => ({
        id: notification.id,
        name: notification.sentBy || "Admin", // Add default value
        time: formatTimestamp(notification.createdAt),
        message: notification.subject,
        fullMessage: notification.message,
        isRead: notification.isRead,
        type: notification.type || "general",
        hasUploadButton: notification.type === "upload_required",
        hasDownloadButton: notification.type === "download_available",
      }));

      setNotifications(formattedNotifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error fetching notifications:", error);
      setError(error.message || "Failed to load notifications");
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to load notifications");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Show confirmation dialog
      Alert.alert(
        "Delete Notification",
        "Are you sure you want to delete this notification?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Call the backend API to delete the notification
                await axios.delete(
                  `${API_BASE_URL}/notifications/${notificationId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                // Remove the notification from local state
                setNotifications(prevNotifications =>
                  prevNotifications.filter(notification => notification.id !== notificationId)
                );

                // Optional: Show success message
                Alert.alert("Success", "Notification deleted successfully");
              } catch (deleteError) {
                console.error("Error deleting notification:", deleteError);
                Alert.alert("Error deleting notification:", deleteError);

                // Restore the notification if deletion fails
                Alert.alert(
                  "Error",
                  deleteError.response?.data?.msg || "Failed to delete notification"
                );
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error("Error preparing notification deletion:", error);
      Alert.alert("Error", "Failed to prepare notification deletion");
    }
  };
  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Call the backend API to mark notification as read
      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to mark notification as read");
    }
  };

  const handleNotificationPress = (item) => {
    setSelectedMessage(item);

    // Mark notification as read if it isn't already
    if (!item.isRead) {
      markAsRead(item.id);
    }
  };

  // Helper function to format timestamp
  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";

    try {
      // Parse the timestamp - could be a Firestore timestamp or an ISO string
      let date;
      if (timestamp.seconds) {
        // Firestore timestamp
        date = new Date(timestamp.seconds * 1000);
      } else if (typeof timestamp === 'string') {
        // ISO string
        date = new Date(timestamp);
      } else {
        // Fallback to current date if parsing fails
        date = new Date();
      }

      return formatRelativeTime(date);
    } catch (error) {
      console.error('Error parsing timestamp:', error);
      return "Unknown time";
    }
  };
  // Helper function to format relative time (e.g., "2 days ago")
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    if (diffInDays < 7) {
      if (diffInDays === 1) return "Yesterday";
      return `${diffInDays} days ago`;
    }
    if (diffInWeeks < 4) return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;

    // For older dates, return the actual date
    return date.toLocaleDateString();
  };

  // Generate avatar text from name
  const getAvatarInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Render notification item component
  const renderNotificationItem = ({ item }) => (
    <Pressable
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {getAvatarInitials(item.name)}
        </Text>
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationName}>{item.name || "Unknown"}</Text>
          <View style={styles.headerActions}>
            <Text style={styles.notificationTime}>{item.time}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNotification(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        {item.hasUploadButton && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("UploadProof", { notificationId: item.id })}
          >
            <Text style={styles.actionButtonText}>Upload Proof</Text>
          </TouchableOpacity>
        )}
      </View>
      {item.hasDownloadButton && (
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#aaa" />
          <Text style={styles.backtext}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchNotifications}>
          <Ionicons name="refresh" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CD964" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchNotifications}
          style={{ padding: 5, }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={60} color="#7f8c8d" />
          <Text style={styles.emptyText}>No notifications found</Text>
        </View>
      )}

      {/* Read message popup */}
      <ReadMessagePopup
        message={
          selectedMessage
            ? {
              id: selectedMessage.id,
              sender: selectedMessage.name || "Unknown",
              message: selectedMessage.fullMessage,
              timestamp: selectedMessage.time,
            }
            : null
        }
        visible={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 45,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 8,
    flexDirection: "row"
  },

  backtext: {
    padding: 2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#8BC34A10",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    marginBottom: 8,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});