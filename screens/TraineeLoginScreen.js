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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Login As Trainee</Text>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#88879C" />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
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
            <MaterialCommunityIcons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#88879C" />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setKeepSignedIn(!keepSignedIn)}>
            <MaterialCommunityIcons
              name={keepSignedIn ? "checkbox-marked-outline" : "checkbox-blank-outline"}
              size={20}
              color="#8AC052"
            />
            <Text style={styles.checkboxLabel}>Keep me signed in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace("ForgetPassword")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isLoading ? "#88879C" : "#8CD136" }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
    marginTop:30
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingTop: 20,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "600",
    color: "#88879C",
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
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
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
  },
});
export default TraineeLoginScreen;
