import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { checkIn } from "./Redux/Slices/AuthenticationSlice";
import {
  startLunch,
  endLunch,
  checkOut,
} from "../Components/Redux/Slices/CheckInOutSlice";



const { height, width } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.42;
const SHEET_OVERFLOW = 20;

const CheckinCheckoutbottomsheet = ({ isVisible, closeBottomSheet }) => {
  // Variables
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const [token, setToken] = useState(null);
  const [traineeId, setTraineeID] = useState(null);
  const { lunchStatus, loading } = useSelector((state) => state.checkInOut);
  const dispatch = useDispatch();
  const today = new Date();
  const [lunchStartTime, setlunchStartTime] = useState(null);
  const [lunchEndtime, setlunchEndTime] = useState(null);
  const [checkInOffice, setCheckIn] = useState(null);
  const [checkout, setCheckOut] = useState(null);
  const [weekData, setWeekData] = useState([]);
  const [username, setUsername] = useState('');
  const [userlocation, setUserLocation] = useState('');
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  console.log("Date", formattedDate);




  // Functions
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ID = await AsyncStorage.getItem("traineeID");
        const Token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("name");
        const location = await AsyncStorage.getItem("Location");

        setToken(Token);
        setTraineeID(ID);
        setUsername(name);
        setUserLocation(location);

      } catch (error) {
        console.error("Message error", error);
      }
    };
    fetchUserData();
  }, []);
   console.log(weekData);
   console.log("NAME FROM ASYNC",username, "LOCATION FROM ASYNC", userlocation);

  //  https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${traineeId}

 
  const handleTimeLine = async () => {
    try {
      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWeekData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (traineeId && token) {
      handleTimeLine();
    }
  }, [traineeId, token]);





  const FindTodayData = () => {
    const todayData = weekData.dailyBreakdown?.find(
      (day) => day.date === formattedDate
    );

    if (todayData && todayData.attended) {
      return {
        checkInTime: todayData.checkInTime,
        checkOutTime: todayData.checkOutTime,
        lunchStartTime: todayData.lunchStartTime,
        lunchEndTime: todayData.lunchEndTime,
        status: todayData.status,
        hoursWorked: todayData.hoursWorked,
      };
    }
    // lunchEndTime
    return null;
  };





  useEffect(() => {
    if (weekData) {
      const todayData = FindTodayData();
      if (todayData) {
        // setCheckInTime(todayData.checkInTime);
        setlunchStartTime(todayData.lunchStartTime);
        setlunchEndTime(todayData.lunchEndTime);
        setCheckOut(todayData.checkOutTime);
        setCheckIn(todayData.checkInTime);
        // setLunchStartTime(todayData.lunchStartTime);
        // setLunchEndTime(todayData.lunchEndTime);
      }
    }
  }, [weekData, formattedDate]);
  console.log("This is my start time to lunch", lunchStartTime);
  console.log("This is my start End of he lunch time", lunchEndtime);
  console.log("This is my start End of the day time", checkout);
  console.log("This is the check in time", checkInOffice);





  useEffect(() => {
    if (isVisible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [isVisible]);


  const closeSheet = () => {
    translateY.value = withSpring(SHEET_HEIGHT, {
      damping: 20,
      stiffness: 90,
    });
    overlayOpacity.value = withTiming(0, { duration: 200 });

    // Call the parent's closeBottomSheet function after animation
    setTimeout(() => {
      closeBottomSheet && closeBottomSheet();
    }, 300);
  };


  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        // Close the sheet if dragged down far enough
        closeSheet();
      } else {
        // Snap back to open position
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 90,
        });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));




  const closeSheetAndNavigate = () => {
    closeSheet();
  };




  const handleCheckInLunch = async () => {
    dispatch(startLunch({ traineeId, token }))
      .unwrap()
      .then(() => {
        closeSheetAndNavigate();
      });
  };

  const handleCheckOutLunch = async () => {
    dispatch(endLunch({ traineeId, token }))
      .unwrap()
      .then(() => {
        closeSheetAndNavigate();
      });
  };

  const handleCheckOut = async () => {
    dispatch(checkOut({ traineeId, token }))
      .unwrap()
      .then(() => {
        closeSheetAndNavigate();
      });
  };

  const handleCheckIn = () => {
    dispatch(checkIn({ 
      traineeId: traineeId, 
      name: username,
      location: userlocation
    }));
  };



 

  // Add another

  // Layout
  return (
    <View style={styles.container}>
      <View style={styles.toaster}>
         <Toast />
      </View>
     
      <Pressable onPress={closeSheet} style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
      </Pressable>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />

          <View style={styles.permissionButtonsContainer}>
            <View style={styles.buttonsContainer}>
              {/* Check In to Lunch */}
              <Pressable
                disabled={loading || lunchEndtime !== "N/A"} // Disable when loading or when lunch has ended
                style={({ pressed }) => [
                  styles.lunchInButton,
                  pressed && { opacity: 0.8 },
                  (loading || lunchEndtime !== "N/A") && {
                    backgroundColor: "#ccc",
                  }, // Disabled button styling
                ]}
                onPress={
                  checkInOffice === "N/A"
                    ? handleCheckIn // Function to handle Check In
                    : lunchStartTime === "N/A"
                    ? handleCheckInLunch // Function to handle Check In to Lunch
                    : handleCheckOutLunch  // Function to handle Check Out of Lunch
                }
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                <Text style={styles.buttonTextLight}>
                  {loading
                    ? "Loading..."
                    : checkInOffice === "N/A"
                    ? "Check In"
                    : lunchStartTime === "N/A"
                    ? "Check In to Lunch"
                    : "Check Out of Lunch"}
                </Text>
              </Pressable>

              {/* Check Out of Lunch */}
              {/* <Pressable
                disabled={loading || lunchEndtime !== "N/A"}
                style={({ pressed }) => [
                  styles.lunchOutButton,
                  pressed && { opacity: 0.8 },
                  (loading || lunchEndtime !== "N/A") && {
                    backgroundColor: "#ccc",
                  },
                ]}
                onPress={handleCheckOutLunch}
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                <Text style={styles.buttonTextDark}>
                  {loading && lunchStatus === "checkedIn"
                    ? "Loading..."
                    : "Check Out of Lunch"}
                </Text>
              </Pressable> */}

              {/* Check Out (always enabled) */}
              <Pressable
                disabled={loading || checkout !== "N/A"}
                style={({ pressed }) => [
                  styles.checkOutButton,
                  pressed && { opacity: 0.8 },
                  (loading || checkout !== "N/A") && {
                    backgroundColor: "#ccc",
                  },
                ]}
                onPress={handleCheckOut}
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                <Text style={styles.buttonTextLight}>
                  {loading && lunchStatus === "checkedIn"
                    ? "Loading..."
                    : "Check Out"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// Syles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1001,
  },
  bottomSheet: {
    position: "absolute",
    bottom: -SHEET_OVERFLOW,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingBottom: SHEET_OVERFLOW + 20,
    height: SHEET_HEIGHT + SHEET_OVERFLOW,
    alignItems: "center",
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
    backgroundColor: "#ffffff40",
    borderRadius: 2,
    marginBottom: 20,
  },
  permissionButtonsContainer: {
    marginTop: 20,
    width: width - 40,
    alignItems: "center",
  },
  lunchInButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#8CD136",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  lunchOutButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#8CD136",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  checkOutButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#8CD136",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  buttonTextLight: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonTextDark: {
    color: "black",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "column",
  },
  toaster:{
     zIndex:100
  }
});

export default CheckinCheckoutbottomsheet;
