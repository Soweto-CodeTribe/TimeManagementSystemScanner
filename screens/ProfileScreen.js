import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.navBar}>
          {/* <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333333" /> <Text>Back</Text>
          </TouchableOpacity> */}
          <Text style={styles.navBarTitle}>Profile</Text>
          <View style={styles.placeholderView} />
        </View>
        <ScrollView>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Z6HPIGZArOlwZgZRYD64JxoekuRd7t.png",
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Oscar Smith</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#8BC34A" />
                <Text style={styles.locationText}>Soweto, Gauteng</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.menuContainer}>
            <MenuItem icon="document-text-outline" title="Documents and Tasks" iconColor="#8BC34A" />
            <MenuItem icon="settings-outline" title="Settings" iconColor="#8BC34A" />
            <MenuItem icon="alert-circle-outline" title="Report Issue" iconColor="#8BC34A" />
            <MenuItem icon="document-outline" title="Terms and Conditions" iconColor="#8BC34A" />
            <MenuItem icon="log-out-outline" title="Sign out" iconColor="#FF5252" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, title, iconColor }) => {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    
    // borderBottomWidth: 1,
    // borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 5,
    display:"flex",
    flexDirection:"row"
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  placeholderView: {
    width: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#8BC34A",
    marginLeft: 4,
  },
  editProfileButton: {
    backgroundColor: "#8BC34A",
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  editProfileText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#666666",
  },
});

export default ProfileScreen;
