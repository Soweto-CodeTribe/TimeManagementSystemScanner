import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Components/Redux/Slices/AuthenticationSlice";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TraineeLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedPassword = await AsyncStorage.getItem("password");
        const storedKeepSignedIn = await AsyncStorage.getItem("keepSignedIn");
        if (storedKeepSignedIn === "true" && storedEmail) {
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

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter valid credentials");
      return;
    }
    dispatch(loginUser({ email, password, keepSignedIn }))
      .unwrap()
      .then(() => {
        navigation.navigate("MainApp");
      })
      .catch((err) => Alert.alert("Login Failed", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Login As Trainee</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#88879C" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#88879C"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#88879C" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#88879C"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setPasswordVisible(!passwordVisible)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons 
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#88879C" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Options Section */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setKeepSignedIn(!keepSignedIn)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={keepSignedIn ? "checkbox-marked-outline" : "checkbox-blank-outline"}
                size={20}
                color="#8AC052"
                style={styles.checkboxIcon}
              />
              <Text style={styles.checkboxLabel}>Keep me signed in</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.replace("ForgetPassword")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isLoading ? "#88879C" : "#8CD136" }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#FF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30
  },
  headerSection: {
    paddingTop: 20,
    marginBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 30,
    paddingVertical: 5,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    fontWeight: "400",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  formSection: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 52,
    backgroundColor: "#F7FBFD",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#053742",
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxIcon: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#8AC052",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#8CD136",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: "400",
  },
});

export default TraineeLoginScreen;