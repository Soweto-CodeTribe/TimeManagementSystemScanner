import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable } from 'react-native';
import ReadMessagePopup from '../Components/ReadMessagePopup';

import { useNavigation } from '@react-navigation/native'; 


export default function NotificationScreen() {
  const [selectedMessage, setSelectedMessage] = useState(null);
 const navigation = useNavigation(); 
  const SAMPLE_MESSAGES = [
    { id: '1', sender: 'Mahlatse Serathi', preview: 'Hey, I just sent you the updated project files...', timestamp: 'Sent: 2025-02-02', message:"The message is rescheduled due to the weather" },
    { id: '2', sender: 'Mahlatse Serathi', preview: 'Meeting rescheduled to 3 PM tomorrow', timestamp: 'Sent: 2025-02-02', message:"The message is rescheduled due to the weather" },
  ];

  const MessageItem = ({ item }) => (
    <Pressable style={styles.messageCard} onPress={() => setSelectedMessage(item)}>
      <Text style={styles.senderName}>{item.sender}</Text>
      <Text style={styles.messagePreview}>{item.preview}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Center</Text>

      <TextInput style={styles.searchbar} placeholder="Search for Messages..." />

      <FlatList data={SAMPLE_MESSAGES} renderItem={MessageItem} keyExtractor={(item) => item.id} />

      <ReadMessagePopup message={selectedMessage} visible={!!selectedMessage} onClose={() => setSelectedMessage(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  searchbar: { borderRadius: 8, borderWidth: 1, borderColor: "#ddd", height: 48, paddingHorizontal: 16, backgroundColor: "white", marginBottom: 16 },
  messageCard: { backgroundColor: "#ffffff", padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: "#8CC1518F" },
  senderName: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  messagePreview: { fontSize: 14, color: "#666666", marginVertical: 4 },
  timestamp: { fontSize: 12, color: "#999999", alignSelf: "flex-end" },
});

