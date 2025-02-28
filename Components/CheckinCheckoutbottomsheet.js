import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Linking, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "react-native-toast-message";
import axios from 'axios';



const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.3;
const SHEET_OVERFLOW = 20;

const CheckinCheckoutbottomsheet = ({ isVisible }) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  // const traineeId = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const TraineeID = useSelector((state) => state.auth.traineeID);
  
  const dispatch = useDispatch();
  
  console.log('Current trainee ID:', TraineeID);
  console.log('Auth token:', token);


  const [lunchStatus, setLunchStatus] = useState("notStarted");
   const navigation = useNavigation();

  useEffect(() => {
    if (isVisible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90
      });
    }
  }, [isVisible]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90
      });
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));


  const  HandleCheckInLunch = async ()=>{

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const Time = `${hours}:${minutes} ${ampm}`;

      console.log(Time);

      try {

        const response = await axios.post('https://timemanagementsystemserver.onrender.com/api/session/lunch-start',
          { 
            traineeId: TraineeID, 
            lunchStartTime: Time 
          },
          {
            headers: { 
              Authorization: `Bearer ${token}`
            }
          }
        )

         Toast.show({
                type: "success",
                text1: "Scanned Successfully",
                text2: "Checked out Successfully from Lunch",
                position: "top",
              });

              setTimeout(()=>{
                navigation.navigate("HomeScreen")
          }, 2000);
        
      } catch (error) {
        console.error("Check-in error", error)
      Alert.alert("Error" )}
  
  }

  const   HandleCheckOutLunch = async ()=>{

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const Time = `${hours}:${minutes} ${ampm}`;

      console.log(Time);

      try {

        const response = await axios.post('https://timemanagementsystemserver.onrender.com/api/session/lunch-end',
          { 
            traineeId: TraineeID, 
            lunchEndTime: Time  
          },
          {
            headers: { 
              Authorization: `Bearer ${token}`
            }
          }
        )

         Toast.show({
                type: "success",
                text1: "Scanned Successfully",
                text2: "Checked out Successfully from Lunch",
                position: "top",
              });

              setTimeout(()=>{
                navigation.navigate("HomeScreen")
          }, 2000);
        
      } catch (error) {
        console.error("Check-in error", error)
      Alert.alert("Error" )}
  
  }


  const  HandleCheckOut = async ()=>{

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const Time = `${hours}:${minutes} ${ampm}`;

      console.log(Time);

      try {

        const response = await axios.post('https://timemanagementsystemserver.onrender.com/api/session/check-out',
          { 
            traineeId: TraineeID, 
            checkOutTime: Time  
          },
          {
            headers: { 
              Authorization: `Bearer ${token}`
            }
          }
        )

        Toast.show({
          type: "success",
          text1: "Scanned Successfully",
          text2: "Checked Out Successfully",
          position: "top",
        });

              setTimeout(()=>{
                navigation.navigate("HomeScreen")
          }, 2000);
        
      } catch (error) {
        console.error("Check-in error", error)
      Alert.alert("Error" )}
  
  }


  return (
    <View style={styles.container}>
      <Toast/>
      <Animated.View 
        style={[styles.overlay, animatedOverlayStyle]} 
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          
          <View style={styles.permissionButtonsContainer}>
            <View style={styles.buttonsContainer}>
              {/* Check In to Lunch */}
              <Pressable 
                // disabled={lunchStatus !== "notStarted"}
                style={({ pressed }) => [
                  styles.lunchInButton,
                  pressed && { opacity: 0.8 },
                  // lunchStatus !== "notStarted" && { backgroundColor: '#ccc' }
                ]}
                onPress={() => {
                  setLunchStatus("checkedIn");
                  HandleCheckInLunch()
                }}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Text style={styles.buttonTextLight}>Check In to Lunch</Text>
              </Pressable>
              
              {/* Check Out of Lunch */}
              <Pressable 
                // disabled={lunchStatus !== "checkedIn"}
                style={({ pressed }) => [
                  styles.lunchOutButton,
                  pressed && { opacity: 0.8 },
                  // lunchStatus !== "checkedIn" && { backgroundColor: '#ccc' }
                ]}
                onPress={() => {
                  setLunchStatus("checkedOut");
                  HandleCheckOutLunch();
                }}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Text style={styles.buttonTextDark}>Check Out of Lunch</Text>
              </Pressable>
              
              {/* Check Out (always enabled) */}
              <Pressable 
                style={({ pressed }) => [
                  styles.checkOutButton,
                  pressed && { opacity: 0.8 }
                ]}
                onPress={() => HandleCheckOut()}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Text style={styles.buttonTextLight}>Check Out</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: -SHEET_OVERFLOW,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingBottom: SHEET_OVERFLOW + 20,
    height: SHEET_HEIGHT + SHEET_OVERFLOW,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 1002,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ffffff40',
    borderRadius: 2,
    marginBottom: 20,
  },
  permissionButtonsContainer: {
    marginTop: 20,
    width: width - 40,
    alignItems: 'center',
  },
  lunchInButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#F4A261",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  lunchOutButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#E9C46A",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  checkOutButton: {
    width: '100%',
    height: 44,
    backgroundColor: "#E76F51",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonTextLight: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: 'black',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "column",
  }
});

export default CheckinCheckoutbottomsheet;
