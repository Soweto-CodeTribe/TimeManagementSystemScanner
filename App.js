import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import store from "./Components/Redux/Store.js";
import SplashScreen from "./screens/SplashScreen";
import GetStartedScreen from "./screens/GetStartedScreen";
import TraineeLoginScreen from "./screens/TraineeLoginScreen";
import GuestRegisterScreen from "./screens/GuestRegisterScreen";
import GuestEmailScreen from "./screens/GuestEmailScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import PasswordEmailScreen from "./screens/PasswordEmailScreen";
import PermissionsScreen from "./screens/PermissionsScreen";
import ScannerScreen from "./screens/Scanner";
import HomeScreen from "./screens/HomeScreen.js";
import NotificationScreen from "./screens/NotificationsScreen.js";
import ScannerAuth from "./screens/AuthScanner.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import TimelineScreen from "./screens/TimeLineScreen.js";
import GetStartedSeamlessly from "./screens/GetStartedSeamlessly.js";
import GetStartedAttendance from "./screens/GetStartedAttendance.js";
import GetStartedVerified from "./screens/GetStartedVerified.js";
import SettingsScreen from "./screens/SettingsScreen.js";

const Stack = createStackNavigator();
const OnboardingStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          elevation: 4,
          height: 60,
          backgroundColor: '#fff',
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "ScannerAuth") iconName = "qr-code-outline";
          else if (route.name === "Timeline") iconName = "time-outline";
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#8BC34A",
        tabBarInactiveTintColor: "gray",
        tabBarButton: (props) => {
          if (route.name === 'ScannerAuth') {
            return (
              <TouchableOpacity
                {...props}
                style={{
                  top: -10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: '#8BC34A',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                >
                  <Ionicons name="qr-code-outline" size={35} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }
          return <TouchableOpacity {...props} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ScannerAuth" component={ScannerAuth} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
    </Tab.Navigator>
  );
}

// Main Stack (for authenticated users)
function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainApp" component={BottomTabNavigator} />
      <MainStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <MainStack.Screen name="NotificationScreen" component={NotificationScreen} />
      <MainStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <MainStack.Screen name="SplashScreen" component={SplashScreen} />
      <MainStack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <MainStack.Screen name="GetStartedSeamlessly" component={GetStartedSeamlessly} />
      <MainStack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <MainStack.Screen name="GetStartedVerified" component={GetStartedVerified} />
      <MainStack.Screen name="GetStartedAttendance" component={GetStartedAttendance} />
      <MainStack.Screen name="ScannerScreen" component={ScannerScreen} />
      <MainStack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
      <MainStack.Screen name="GuestRegister" component={GuestRegisterScreen} />
      <MainStack.Screen name="GuestEmail" component={GuestEmailScreen} />
      <MainStack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <MainStack.Screen name="PasswordEmail" component={PasswordEmailScreen} />
    </MainStack.Navigator>
  );
}

// Onboarding Stack Navigator
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="SplashScreen" component={SplashScreen} />
      <OnboardingStack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <OnboardingStack.Screen name="GetStartedSeamlessly" component={GetStartedSeamlessly} />
      <OnboardingStack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <OnboardingStack.Screen name="GetStartedVerified" component={GetStartedVerified} />
      <OnboardingStack.Screen name="GetStartedAttendance" component={GetStartedAttendance} />
      <OnboardingStack.Screen name="ScannerScreen" component={ScannerScreen} />
      <OnboardingStack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
      <OnboardingStack.Screen name="GuestRegister" component={GuestRegisterScreen} />
      <OnboardingStack.Screen name="GuestEmail" component={GuestEmailScreen} />
      <OnboardingStack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <OnboardingStack.Screen name="PasswordEmail" component={PasswordEmailScreen} />
    </OnboardingStack.Navigator>
  );
}

// Root Navigator Component
function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialToken, setInitialToken] = useState(null);
  const token = useSelector(state => state.auth.token);
  
  useEffect(() => {
    // Check if token exists in AsyncStorage on app start
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setInitialToken(storedToken);
        setIsLoading(false);
      } catch (error) {
        console.log('Error retrieving token:', error);
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    // Show loading indicator while checking for token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  // Use Redux state token if available, otherwise use initial token from AsyncStorage
  const isAuthenticated = token || initialToken;

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {isAuthenticated ? (
        // User is authenticated, show main app with access to all screens
        <MainStackNavigator />
      ) : (
        // User is not authenticated, show onboarding flow
        <OnboardingNavigator />
      )}
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}