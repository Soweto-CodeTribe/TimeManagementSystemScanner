import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "HomeScreen") iconName = "home-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          else if (route.name === "Timeline") iconName = "time-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#8BC34A",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#FFFFFF", height: 60, paddingBottom: 5 },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* <StatusBar style="auto" /> */}
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
          {/* Authentication and onboarding screens */}
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
          <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
          <Stack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
          <Stack.Screen name="GuestRegisterScreen" component={GuestRegisterScreen} />
          <Stack.Screen name="GuestEmailScreen" component={GuestEmailScreen} />
          <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
          <Stack.Screen name="PasswordEmailScreen" component={PasswordEmailScreen} />
          <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="ScannerAuth" component={ScannerAuth} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          
          {/* After authentication, show Bottom Tabs */}
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
