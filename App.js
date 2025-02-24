import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import ScanScreen from './screens/ScanScreen';
import TraineeLoginScreen from './screens/TraineeLoginScreen';
import GuestRegisterScreen from './screens/GuestRegisterScreen';
import GuestEmailScreen from './screens/GuestEmailScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import PasswordEmailScreen from './screens/PasswordEmailScreen';
import Scanner from './screens/Scanner';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
        <Stack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
        <Stack.Screen name="GuestRegisterScreen" component={GuestRegisterScreen} />
        <Stack.Screen name="GuestEmailScreen" component={GuestEmailScreen} />
        <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
        <Stack.Screen name="PasswordEmailScreen" component={PasswordEmailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
