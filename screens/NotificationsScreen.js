"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import ReadMessagePopup from "../Components/ReadMessagePopup"

export default function NotificationScreen() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigation = useNavigation()

  // Mock notifications data - in a real app, this would come from an API
  const NOTIFICATIONS = [
    {
      id: "1",
      name: "Upjeet Orry",
      time: "4 days ago",
      fullMessage: "This document will serve as a Proof of Upjeet. It SHOULD be UPLOADED by you via the Worker Portal.",
      hasUploadButton: true,
    },
    {
      id: "2",
      name: "Upjeet Orry",
      time: "1 day ago",
      message: "You've provided Proof for 23 February 2023. It will operate until 28 February 2023.",
      hasDownloadButton: true,
    },
    {
      id: "3",
      name: "Upjeet Orry",
      time: "1 day ago",
      fullMessage: "This document will serve as a Proof of Upjeet. It SHOULD be UPLOADED by you via the Worker Portal.",
    },
    {
      id: "4",
      name: "Upjeet Orry",
      time: "Yesterday",
      fullMessage: "This document will serve as a Proof of Upjeet. It SHOULD be UPLOADED by you via the Worker Portal.",
    },
    {
      id: "5",
      name: "Mahlatse Serathi",
      time: "4 weeks ago",
      message: "Hey, I just sent you the updated project files...",
      fullMessage: "The message is rescheduled due to the weather",
    },
    {
      id: "6",
      name: "Mahlatse Serathi",
      time: "4 weeks ago",
      message: "Meeting rescheduled to 3 PM tomorrow",
      fullMessage: "The message is rescheduled due to the weather",
    },
  ]

  // Filter notifications based on search query
  const filteredNotifications = searchQuery
    ? NOTIFICATIONS.filter(
        (notification) =>
          notification.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : NOTIFICATIONS

  // Render notification item component
  const renderNotificationItem = ({ item }) => (
    <Pressable 
      style={styles.notificationCard} 
      onPress={() => (item.fullMessage ? setSelectedMessage(item) : null)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Text>
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationName}>{item.name}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        {item.hasUploadButton && (
          <TouchableOpacity style={styles.actionButton}>
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
  )

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#aaa" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
   
      </View>

      {/* Notifications list */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
                sender: selectedMessage.name,
                message: selectedMessage.fullMessage,
                timestamp: selectedMessage.time,
              }
            : null
        }
        visible={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    flexDirection: "row",
  },
  backButton: {
    paddingTop: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#aaa",
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7c808d",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  notificationName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#2c3e50",
  },
  notificationTime: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  notificationMessage: {
    fontSize: 13,
    color: "#2c3e50",
    lineHeight: 18,
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: "flex-start",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#7f8c8d",
    marginTop: 10,
  },
});