import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from 'react-native';

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


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
          if (route.name === "HomeScreen") iconName = "home-outline";
          else if (route.name === "ScannerAuth") iconName = "qr-code-outline";
          else if (route.name === "Timeline") iconName = "time-outline";
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#8BC34A",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
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
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="ScannerAuth" component={ScannerAuth} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
    </Tab.Navigator>
  );
}

// Auth Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <Stack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
      <Stack.Screen name="GuestRegister" component={GuestRegisterScreen} />
      <Stack.Screen name="GuestEmail" component={GuestEmailScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="PasswordEmail" component={PasswordEmailScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GetStartedSeamlessly" component={GetStartedSeamlessly} />
      <Stack.Screen name="GetStartedAttendance" component={GetStartedAttendance} />
      <Stack.Screen name="GetStartedVerified" component={GetStartedVerified} />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AuthNavigator />
      </NavigationContainer>
    </Provider>
  );
}