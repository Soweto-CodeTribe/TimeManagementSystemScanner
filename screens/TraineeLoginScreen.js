import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  StyleSheet, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Components/Redux/Slices/AuthenticationSlice";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get('window');

const TraineeLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      handleKeyboardShow
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      handleKeyboardHide
    );

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

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  const handleKeyboardShow = (event) => {
    setKeyboardVisible(true);
    const keyboardHeight = event.endCoordinates.height;
    Animated.timing(formTranslateY, {
      toValue: -keyboardHeight * 0.3,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleKeyboardHide = () => {
    setKeyboardVisible(false);
    Animated.timing(formTranslateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const animateInputFocus = (animRef, focused) => {
    Animated.timing(animRef, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    animateInputFocus(emailBorderAnim, true);
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    animateInputFocus(emailBorderAnim, false);
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    animateInputFocus(passwordBorderAnim, true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    animateInputFocus(passwordBorderAnim, false);
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonPressAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonPressAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = () => {
    if (!email || !password) {
      // Shake animation for error
      const shakeAnimation = Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]);
      shakeAnimation.start();
      
      Alert.alert("Error", "Please enter valid credentials");
      return;
    }
    
    dispatch(loginUser({ email, password, keepSignedIn }))
      .unwrap()
      .then(() => {
        // Success animation
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful! Welcome back.',
          position: 'bottom',
          visibilityTime: 3000,
        });
        
        setTimeout(() => {
          navigation.navigate("MainApp");
        }, 1000);
      })
      .catch((err) => {
        // Error shake animation
        const errorShake = Animated.sequence([
          Animated.timing(slideAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]);
        errorShake.start();

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: err?.message || 'Invalid credentials. Please try again.',
          position: 'bottom',
          visibilityTime: 4000,
        });
      });
  };

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#8CD136'],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#8CD136'],
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardAvoid}
        >
          <Animated.View 
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: formTranslateY },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Header Section */}
            <Animated.View 
              style={[
                styles.headerSection,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
            
              <View style={styles.titleContainer}>
                <Text style={styles.heading}>Right On Time</Text>
                <Text style={styles.subHeading}>Sign in to your trainee account</Text>
              </View>
            </Animated.View>

            {/* Form Section */}
            <Animated.View 
              style={[
                styles.formSection,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, emailFocused && styles.labelFocused]}>
                  Email Address
                </Text>
                <Animated.View 
                  style={[
                    styles.inputContainer,
                    { borderColor: emailBorderColor }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name="email-outline" 
                    size={20} 
                    color={emailFocused ? "#8CD136" : "#666"} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {email.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setEmail("")}
                      style={styles.clearButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialCommunityIcons 
                        name="close-circle" 
                        size={18} 
                        color="#999" 
                      />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, passwordFocused && styles.labelFocused]}>
                  Password
                </Text>
                <Animated.View 
                  style={[
                    styles.inputContainer,
                    { borderColor: passwordBorderColor }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name="lock-outline" 
                    size={20} 
                    color={passwordFocused ? "#8CD136" : "#666"} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons 
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={passwordFocused ? "#8CD136" : "#666"} 
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Options Section */}
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setKeepSignedIn(!keepSignedIn)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, keepSignedIn && styles.checkboxChecked]}>
                    {keepSignedIn && (
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color="#fff"
                      />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Keep me signed in</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => navigation.replace("ForgetPassword")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonPressAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.button, 
                    { 
                      backgroundColor: isLoading ? "#88879C" : "#8CD136",
                      opacity: isLoading ? 0.8 : 1 
                    }
                  ]}
                  onPress={handleLogin}
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <View style={styles.buttonContent}>
                    {isLoading && (
                      <Animated.View style={styles.loadingIndicator}>
                        <MaterialCommunityIcons 
                          name="loading" 
                          size={20} 
                          color="#fff" 
                        />
                      </Animated.View>
                    )}
                    <Text style={styles.buttonText}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Error Message */}
              {error && (
                <Animated.View 
                  style={styles.errorContainer}
                  entering="fadeIn"
                  exiting="fadeOut"
                >
                  <MaterialCommunityIcons 
                    name="alert-circle-outline" 
                    size={18} 
                    color="#FF4444" 
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}
              
              {/* Additional spacing for keyboard */}
              {keyboardVisible && <View style={{ height: 50 }} />}
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerSection: {
    paddingTop: 20,
    marginBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 4,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 70,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "400",
  },
  formSection: {
    flex: 1,
    justifyContent: "flex-start",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginLeft: 2,
  },
  labelFocused: {
    color: "#8CD136",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#FAFBFC",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
    fontWeight: "400",
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  eyeIcon: {
    padding: 6,
    marginLeft: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#8CD136",
    borderColor: "#8CD136",
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  forgotPassword: {
    fontSize: 15,
    color: "#8CD136",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 24,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
    marginBottom: 20,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    fontWeight: "500",
  },
});

export default TraineeLoginScreen;