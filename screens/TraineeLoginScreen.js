import React, { useState,useEffect  } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import * as Location from "expo-location";


const TraineeLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check if email is valid
  const isEmailValid = emailRegex.test(email) && email.length > 0;

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedPassword = await AsyncStorage.getItem("password");
        const storedKeepSignedIn = await AsyncStorage.getItem("keepSignedIn");
  
        if (storedKeepSignedIn === "true" && storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setKeepSignedIn(true);
        }
      } catch (error) {
        console.error("Error loading stored credentials:", error);
      }
    };
  
    loadCredentials();
  }, []);
  
  // const handleLogin = () => {
  //   setEmailError("");
  //   setPasswordError("");

  //   if (!email) {
  //     setEmailError("Please enter your email.");
  //   } else if (!isEmailValid) {
  //     setEmailError("Please enter a valid email.");
  //     return;
  //   }

  //   if (!password) {
  //     setPasswordError("Please enter your password.");
  //   }

  //   if (email && password && isEmailValid) {
  //     console.log("Email:", email);
  //     console.log("Password:", password);
  //     console.log("Keep Signed In:", keepSignedIn);
  //   }
  // };

  //handle login with firebase
  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
  
    if (!email) {
      setEmailError("Please enter your email.");
      return;
    } else if (!isEmailValid) {
      setEmailError("Please enter a valid email.");
      return;
    }
  
    if (!password) {
      setPasswordError("Please enter your password.");
      return;
    }
  
    try {
      const response = await fetch(
        "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
  
      const text = await response.text();
      console.log("Raw response:", text);
  
      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error("Error parsing error response:", err);
        }
        throw new Error(errorMessage);
      }
  
      const data = JSON.parse(text);
      console.log("Login successful:", data);
  
      // Store only email, not the password
      if (keepSignedIn) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("keepSignedIn", "true");
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("keepSignedIn");
      }
  
      // Call the check-in function after successful login
      await checkIn(data.traineeId, data.name);
  
      // Navigate only after successful login and check-in
      navigation.replace("HomeScreen");
    } catch (error) {
      console.error("Error logging in:", error.message);
      setPasswordError(error.message); // Display error to user
    }
  };
  
  // Define the checkIn function
  const checkIn = async (traineeId, name, token) => {
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required for check-in.");
        return;
      }
  
      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
  
      // Get current time
      const currentTime = new Date().toISOString();
  
      console.log("Current Time:", currentTime);
      console.log("Current Location:", currentLocation);
  
      // Send check-in request with current time & location
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/session/check-in",
        {
          traineeId,
          name,
          // currentTime,
          // currentLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );
  
      console.log("Check-in Response:", response.data);
      Alert.alert("Check-in Successful", `Welcome, ${name}`);
  
    } catch (error) {
      console.error("Check-in Error:", error.response?.data || error);
  
      let errorMessage = "Failed to check in. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
  
      Alert.alert("Error", errorMessage);
    }
  };
  
  // Check if form is valid
  const isFormValid = email && password && isEmailValid;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>



        <Text style={styles.heading}>Login As Trainee</Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#88879C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {isEmailValid && (
            <MaterialCommunityIcons name="check-circle-outline" size={20} color="green" style={styles.icon} />
          )}
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#88879C"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        {/* Keep Me Signed In & Forgot Password */}
        <View style={styles.optionsContainer}>
        <TouchableOpacity 
  style={styles.checkboxContainer} 
  onPress={() => setKeepSignedIn(!keepSignedIn)}
>
  <MaterialCommunityIcons
    name={keepSignedIn ? "checkbox-marked-outline" : "checkbox-blank-outline"}
    size={20}
    color="#8AC052"
  />
  <Text style={styles.checkboxLabel}>Keep me signed in</Text>
</TouchableOpacity>


          <TouchableOpacity>
            <Text style={styles.forgotPassword} onPress={() => navigation.replace("ForgetPasswordScreen")}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? "#8AC052" : "#88879C" }]} // Conditionally change button color
          onPress={handleLogin}
          disabled={!isFormValid} // Disable button if form is invalid
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>  
      </View>
    </SafeAreaView>
  );
};

export default TraineeLoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingTop:40,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: -10,
    color: "#88879C",
    lineHeight: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#F7FBFD",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#053742",
  },
  icon: {
    marginLeft: 5,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#8AC052",
    fontWeight: "400",
  },
  button: {
    width: "100%",
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "rgba(245, 130, 41, 0.16)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
    letterSpacing: 0.32,
    lineHeight: 22,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: "flex-start",
  },
});
