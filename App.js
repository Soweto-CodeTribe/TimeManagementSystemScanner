// import React, { useState, useEffect } from "react";
// import { StatusBar } from "expo-status-bar";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Provider, useSelector } from "react-redux";
// import { Ionicons } from "@expo/vector-icons";
// import { TouchableOpacity, View } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import store from "./Components/Redux/Store.js";

// // Import all screens
// import SplashScreen from "./screens/SplashScreen";
// import GetStartedScreen from "./screens/GetStartedScreen";
// import TraineeLoginScreen from "./screens/TraineeLoginScreen";
// import GuestRegisterScreen from "./screens/GuestRegisterScreen";
// import GuestEmailScreen from "./screens/GuestEmailScreen";
// import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
// import PasswordEmailScreen from "./screens/PasswordEmailScreen";
// import PermissionsScreen from "./screens/PermissionsScreen";
// import ScannerScreen from "./screens/Scanner";
// import HomeScreen from "./screens/HomeScreen.js";
// import NotificationScreen from "./screens/NotificationsScreen.js";
// import ScannerAuth from "./screens/AuthScanner.js";
// import ProfileScreen from "./screens/ProfileScreen.js";
// import TimelineScreen from "./screens/TimeLineScreen.js";
// import GetStartedSeamlessly from "./screens/GetStartedSeamlessly.js";
// import GetStartedAttendance from "./screens/GetStartedAttendance.js";
// import GetStartedVerified from "./screens/GetStartedVerified.js";
// import SettingsScreen from "./screens/SettingsScreen.js";
// import TicketScreen from "./screens/TicketsScreen.js";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Bottom Tab Navigator for authenticated users
// function BottomTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarStyle: {
//           position: 'absolute',
//           bottom: 0,
//           left: 20,
//           right: 20,
//           elevation: 4,
//           height: 60,
//           backgroundColor: '#fff',
//           paddingBottom: 5,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.1,
//           shadowRadius: 8,
//         },
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "HomeScreen") iconName = "home-outline";
//           else if (route.name === "ScannerAuth") iconName = "qr-code-outline";
//           else if (route.name === "Timeline") iconName = "time-outline";
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#8BC34A",
//         tabBarInactiveTintColor: "gray",
//         tabBarButton: (props) => {
//           if (route.name === 'ScannerAuth') {
//             return (
//               <TouchableOpacity
//                 {...props}
//                 style={{
//                   top: -10,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//                 activeOpacity={0.7}
//               >
//                 <View
//                   style={{
//                     width: 70,
//                     height: 70,
//                     borderRadius: 35,
//                     backgroundColor: '#8CD136',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Ionicons name="qr-code-outline" size={32} color="#fff" />
//                 </View>
//               </TouchableOpacity>
//             );
//           }
//           return <TouchableOpacity {...props} />;
//         },
//       })}
//     >
//       <Tab.Screen name="HomeScreen" component={HomeScreen} />
//       <Tab.Screen name="ScannerAuth" component={ScannerAuth} />
//       <Tab.Screen name="Timeline" component={TimelineScreen} />
//     </Tab.Navigator>
//   );
// }

// // Main App Navigator with splash screen and token retrieval
// function AppNavigator() {
//   const [showSplash, setShowSplash] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);
//   const [onBoarded, setOnBoarded] = useState(false);
//   const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

//   useEffect(() => {
//     const initializeApp = async () => {
//       try {
//         // Show splash screen for minimum 2 seconds
//         const splashTimer = new Promise(resolve => setTimeout(resolve, 6000));

//         // Check stored data
//         const checkStoredData = async () => {
//           const storedToken = await AsyncStorage.getItem("token");
//           const onBoarded = await AsyncStorage.getItem("onBoarded");
//           const location = await AsyncStorage.getItem("locationPermissionGranted");

//           setToken(storedToken);
//           setOnBoarded(onBoarded);
//           setLocationPermissionGranted(location);
//         };

//         // Wait for both splash timer and data checking
//         await Promise.all([splashTimer, checkStoredData()]);

//       } catch (error) {
//         console.error("Error during app initialization:", error);
//       } finally {
//         setShowSplash(false);
//         setLoading(false);
//       }
//     };

//     initializeApp();
//   }, []);

//   // Show splash screen
//   if (showSplash) {
//     return <SplashScreen />;
//   }

//   // Show loading state (optional, since splash handles initial loading)
//   if (loading) return null;

//   // Determine initial route based on stored data
//   const getInitialRoute = () => {
//     if (token) {
//       return "MainApp"; // User is logged in
//     } else if (onBoarded && locationPermissionGranted) {
//       return "TraineeLoginScreen"; // User has completed onboarding
//     } else {
//       return "GetStartedScreen"; // New user
//     }
//   };

//   return (
//     <Stack.Navigator 
//       initialRouteName={getInitialRoute()}
//       screenOptions={{ headerShown: false }}
//     >
//       <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
//       <Stack.Screen name="GetStartedSeamlessly" component={GetStartedSeamlessly} />
//       <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
//       <Stack.Screen name="GetStartedVerified" component={GetStartedVerified} />
//       <Stack.Screen name="GetStartedAttendance" component={GetStartedAttendance} />
//       <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
//       <Stack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
//       <Stack.Screen name="GuestRegister" component={GuestRegisterScreen} />
//       <Stack.Screen name="GuestEmail" component={GuestEmailScreen} />
//       <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
//       <Stack.Screen name="PasswordEmail" component={PasswordEmailScreen} />
//       <Stack.Screen name="MainApp" component={BottomTabNavigator} />
//       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
//       <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
//       <Stack.Screen name="TicketScreen" component={TicketScreen} />
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <StatusBar style="auto" />
//         <AppNavigator />
//       </NavigationContainer>
//     </Provider>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./Components/Redux/Store.js";
import NotificationService from "./Components/NotificationService.js";
import Toast from "react-native-toast-message";

// Import all screens
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
import TicketScreen from "./screens/TicketsScreen.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Fixed Bottom Tab Navigator with white border around scanner button
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          height: 60,
          backgroundColor: '#F8F8FF',
          paddingBottom: 5,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "HomeScreen") iconName = "home-outline";
          else if (route.name === "ScannerAuth") iconName = "qr-code-outline";
          else if (route.name === "Timeline") iconName = "calendar-outline";
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
                {/* White background/border container */}
                <View style={{
                  width: 76,
                  height: 76,
                  borderRadius: 38,
                  backgroundColor: '#F8F8FF',
                  justifyContent: 'center',
                  alignItems: 'center',

                }}>
                  {/* Green circle with icon */}
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: '#8CD136',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#8CD136',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons name="qr-code-outline" size={28} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
          return <TouchableOpacity {...props} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="ScannerAuth"
        component={ScannerAuth}
        options={{
          tabBarLabel: 'Scan',
          tabBarLabelStyle: { marginTop: 8 }
        }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ tabBarLabel: 'Timeline' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator with splash screen and token retrieval
function AppNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [onBoarded, setOnBoarded] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const navigationRef = useRef();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Show splash screen for minimum 2 seconds
        const splashTimer = new Promise(resolve => setTimeout(resolve, 6000));

        // Check stored data
        const checkStoredData = async () => {
          const storedToken = await AsyncStorage.getItem("token");
          const onBoarded = await AsyncStorage.getItem("onBoarded");
          const location = await AsyncStorage.getItem("locationPermissionGranted");

          setToken(storedToken);
          setOnBoarded(onBoarded);
          setLocationPermissionGranted(location);
        };

        // Wait for both splash timer and data checking
        await Promise.all([splashTimer, checkStoredData()]);

      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setShowSplash(false);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Initialize notifications after navigation is ready
  useEffect(() => {
    const initializeNotifications = async () => {
      if (!loading && !showSplash) {
        try {
          // Initialize notification service
          await NotificationService.initialize();

          // Set up navigation reference for notification handling
          NotificationService.navigationRef = navigationRef;

          console.log('Notifications initialized successfully');
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      NotificationService.cleanup();
    };
  }, [loading, showSplash]);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show loading state (optional, since splash handles initial loading)
  if (loading) return null;

  // Determine initial route based on stored data
  const getInitialRoute = () => {
    if (token) {
      return "MainApp"; // User is logged in
    } else if (onBoarded && locationPermissionGranted) {
      return "TraineeLoginScreen"; // User has completed onboarding
    } else {
      return "GetStartedScreen"; // New user
    }
  };




  return (
    <Stack.Navigator
      ref={navigationRef}
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <Stack.Screen name="GetStartedSeamlessly" component={GetStartedSeamlessly} />
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <Stack.Screen name="GetStartedVerified" component={GetStartedVerified} />
      <Stack.Screen name="GetStartedAttendance" component={GetStartedAttendance} />
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
      <Stack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
      <Stack.Screen name="GuestRegister" component={GuestRegisterScreen} />
      <Stack.Screen name="GuestEmail" component={GuestEmailScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="PasswordEmail" component={PasswordEmailScreen} />
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="TicketScreen" component={TicketScreen} />
    </Stack.Navigator>
  );
}

export default function App() {

  const navigationRef = useRef();
  
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>

      {/* TOAST */}
      <Toast />
      {/* ENDS */}
    </Provider>
  );
}