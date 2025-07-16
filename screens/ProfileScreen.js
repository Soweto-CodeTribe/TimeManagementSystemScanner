import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import ProfileButtomSheet from "../Components/ProfileSheet";
import FeedbackBottomSheet from "../Components/FeedbackSheet";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Components/Redux/Slices/AuthenticationSlice";
import DocumentsUpload from "../Components/DocumentsUpload";
import TermsAndConditions from "../Components/TermsAndConditions";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [location, setlocation] = useState("");
  const [openProfileSheet, setOpenProfileSheet] = useState(false);
  const [openFeedbacksheet, setOpenFeedbackSheet] = useState(false);
  const [openDocumentsheet, setDocumentsheet] = useState(false);
  const [openTermssheeet, setTermssheeet] = useState(false);
  const [activity, setActivity] = useState(false);
  const dispatch = useDispatch();

  const defaultImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Z6HPIGZArOlwZgZRYD64JxoekuRd7t.png";

  // Fetch user Data from Async Storage on component Mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        const storedName = await AsyncStorage.getItem("name");
        const storedlocation = await AsyncStorage.getItem("Location");

        if (storedImage) setImage(storedImage);
        if (storedName) setName(storedName);
        if (storedlocation) setlocation(storedlocation);
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const logUserOut = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      axios.post(
        "https://timemanagementsystemserver.onrender.com/api/auth/logout",
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error);
      Alert.alert("Logout Error:", error.response?.data || error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      await AsyncStorage.setItem("profileImage", selectedImage);
    }
  };

  if (isLoading || activity) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>
          {activity ? "Logging out..." : "Loading..."}
        </Text>
      </View>
    );
  }

  const HandleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setActivity(true);
            await logUserOut();
            setTimeout(() => {
              dispatch(logout());
              setTimeout(() => {
                setActivity(false);
                navigation.navigate("PermissionsScreen");
              }, 3000);
            }, 100);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header with Gradient */}

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backtext}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: image || defaultImage }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name || "User"}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="red" />
            <Text style={styles.locationText}>{location || "Add location"}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Edit Profile Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setOpenProfileSheet(true)}
          >
            <LinearGradient
              colors={['#8BC34A', '#8BC34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editButtonGradient}
            >
              <Text style={styles.editProfileText}>View Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="document-text"
              title="Documents"
              subtitle="Manage your files"
              iconColor="#3B82F6"
              backgroundColor="#EFF6FF"
              onPress={() => setDocumentsheet(true)}
            />
            <MenuDivider />
            <MenuItem
              icon="settings"
              title="Settings"
              subtitle="App preferences"
              iconColor="#8B5CF6"
              backgroundColor="#F3E8FF"
              onPress={() => navigation.navigate("SettingsScreen")}
            />
            <MenuDivider />
            <MenuItem
              icon="ticket"
              title="Support Tickets"
              subtitle="Get help & support"
              iconColor="#F59E0B"
              backgroundColor="#FEF3C7"
              onPress={() => navigation.navigate("TicketScreen")}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Feedback & Legal</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="chatbubble-ellipses"
              title="Send Feedback"
              subtitle="Help us improve"
              iconColor="#10B981"
              backgroundColor="#D1FAE5"
              onPress={() => setOpenFeedbackSheet(true)}
            />
            <MenuDivider />
            <MenuItem
              icon="document-text"
              title="Terms & Conditions"
              subtitle="Legal information"
              iconColor="#8BC34A"
              backgroundColor="rgba(76, 175, 80, 0.3)"
              onPress={() => setTermssheeet(true)}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={HandleLogout}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Sheets */}
      {openProfileSheet && (
        <ProfileButtomSheet
          setOpenProfileSheet={setOpenProfileSheet}
          openProfileSheet={openProfileSheet}
        />
      )}
      {openFeedbacksheet && (
        <FeedbackBottomSheet
          setOpenFeedbackSheet={setOpenFeedbackSheet}
          openFeedbacksheet={openFeedbacksheet}
        />
      )}
      {openDocumentsheet && (
        <DocumentsUpload
          openDocumentsheet={openDocumentsheet}
          onClose={() => setDocumentsheet(false)}
        />
      )}
      {openTermssheeet && (
        <TermsAndConditions
          openTermssheeet={openTermssheeet}
          onClose={() => setTermssheeet(false)}
        />
      )}
    </SafeAreaView>
  );
};

// Menu Item Component
const MenuItem = ({ icon, title, subtitle, iconColor, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const MenuDivider = () => <View style={styles.menuDivider} />;

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 30,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 15,
  },
  backButton: {
    paddingVertical: 5,
    zIndex: 10,
    flexDirection: "row",
  },
  backtext: {
    padding: 2,
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  placeholder: {
    width: 40,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  imagePickerButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8BC34A",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 6,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  editProfileButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  editButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  editProfileText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginHorizontal: 20,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "rgba(0, 0, 0, .055)",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 80,
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "rgba(0, 0, 0, .055)",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});

export default ProfileScreen;