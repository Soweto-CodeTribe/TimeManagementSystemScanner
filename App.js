import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';  
import store from './Components/Redux/Store.js';
import SplashScreen from './screens/SplashScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import TraineeLoginScreen from './screens/TraineeLoginScreen';
import GuestRegisterScreen from './screens/GuestRegisterScreen';
import GuestEmailScreen from './screens/GuestEmailScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import PasswordEmailScreen from './screens/PasswordEmailScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import ScannerScreen from './screens/Scanner';
import HomeScreen from './screens/HomeScreen.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}> 
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
          <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
          <Stack.Screen name="TraineeLoginScreen" component={TraineeLoginScreen} />
          <Stack.Screen name="GuestRegisterScreen" component={GuestRegisterScreen} />
          <Stack.Screen name="GuestEmailScreen" component={GuestEmailScreen} />
          <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
          <Stack.Screen name="PasswordEmailScreen" component={PasswordEmailScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
