import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import ProfileButtomSheet from "../Components/ProfileSheet";

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [openProfileSheet, setOpenProfileSheet] = useState(false);

  const defaultImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Z6HPIGZArOlwZgZRYD64JxoekuRd7t.png";



  // Fetch user Data from Async Storage on componenet Mount such as name and picked image for persistancy 
  useEffect(() => {

    const loadProfileData = async () => {

      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        const storedName = await AsyncStorage.getItem("name");

        if (storedImage) 
          {setImage(storedImage);}

        if (storedName) 
          {setName(storedName);}

      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    // Run the function on component mount
    loadProfileData();
  }, []);

  // Function to handle navigation back to the home screen with the delay of 2 seconds for navigation
  const handleNavigation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 2000);
  };


// Function to pick an image from the Gallery 
  const pickImage = async () => {
    // Request permission to access the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // If the user cancels the image picker, return null
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      await AsyncStorage.setItem("profileImage", selectedImage);
    }
  };


//  Loader layout if the state is true
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }


// Layout of the Profile Screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        <View style={styles.navBar}>
          <Pressable style={styles.backButton} onPress={handleNavigation}>
            <Ionicons name="chevron-back" size={24} color="#999999" />
          </Pressable>
          <Text style={styles.navBarTitle}>Profile</Text>
        </View>

        <ScrollView>
          <View style={styles.profileHeader}>
            <Image source={{ uri: image || defaultImage }} style={styles.profileImage} />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Ionicons name="camera-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name || "User"}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#8BC34A" />
                <Text style={styles.locationText}>Soweto, Gauteng</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileButton} onPress={()=> setOpenProfileSheet(true)}>
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
      
      {
        openProfileSheet && <ProfileButtomSheet setOpenProfileSheet={setOpenProfileSheet} openProfileSheet={openProfileSheet}/>
      }
    </SafeAreaView>
  );
};


// Menu Item Component 
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



// Styles for the Profile SCREEN
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    marginTop: 40,
  },
  backButton: {
    padding: 5,
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  imagePickerButton: {
    position: "absolute",
    bottom: 10,
    left: 60,
    backgroundColor: "#8BC34A",
    borderRadius: 20,
    padding: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default ProfileScreen;
