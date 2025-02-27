"use client"

import { useState } from "react"
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
import ReadMessagePopup from "../Components/ReadMessagePopup"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function NotificationScreen() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigation = useNavigation()

  const NOTIFICATIONS = [
    {
      id: "1",
      name: "Upjeet Orry",
      time: "4 days ago",
      message: "This document will serve as a Proof of Upjeet. It SHOULD be UPLOADED by you via the Worker Portal.",
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
      message: "This document will serve as a Proof of Upjeet. It SHOULD be UPLOADED by you via the Worker Portal.",
    },
    {
      id: "4",
      name: "Upjeet Orry",
      time: "Yesterday",
      message: "This document will serve as a Proof of Upjeet. It SHOULD be UPLOADED by you via the Worker Portal.",
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

  const filteredNotifications = searchQuery
    ? NOTIFICATIONS.filter(
        (notification) =>
          notification.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : NOTIFICATIONS

  const renderNotificationItem = ({ item }) => (
    <Pressable style={styles.notificationCard} onPress={() => (item.fullMessage ? setSelectedMessage(item) : null)}>
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
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Proof</Text>
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
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

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

  },
  header: {
  },
  backButton: {
  },
  headerTitle: {
  },
  profileImage: {
  },
  searchContainer: {
  },
  searchIcon: {
  },
  searchInput: {
  },
  listContent: {
  },
  notificationCard: {
  },
  avatarContainer: {
  },
  avatarText: {
  },
  notificationContent: {
  },
  notificationHeader: {
  },
  notificationName: {
  },
  notificationTime: {
  },
  notificationMessage: {
  },
  uploadButton: {
  },
  uploadButtonText: {
  },
  downloadButton: {
  },
})

