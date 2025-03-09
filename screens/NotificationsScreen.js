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
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginRight: 24, 
  },
  listContent: {
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
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
    alignItems: 'flex-start',
    marginBottom: 4,
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
    height: 60,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#999',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
});