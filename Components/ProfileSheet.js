import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Pressable
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const { height } = Dimensions.get('window');

const ProfileBottomSheet = ({ openProfileSheet, setOpenProfileSheet }) => {
  const [number, setNumber]= useState("");
  const [usersurname, setSurname]= useState('');
  const [email, setEmail]= useState("");
  const [name, setName]= useState("");
  const [id,setId]= useState("");
  const [location, setLocation] = useState("");


  // Animation value
  const slideAnim = useRef(new Animated.Value(height)).current;


  const GetUserDetails = async ()=>{
    try {
      const userName = await AsyncStorage.getItem("name");
      const userSurname = await AsyncStorage.getItem("Surname");
      const userEmail = await AsyncStorage.getItem("email");
      const userid = await AsyncStorage.getItem("ID Number");
      const Location = await AsyncStorage.getItem("Location");
      const userCellNumber = await AsyncStorage.getItem("cellphone");

      setName(userName)
      setNumber(userCellNumber);
      setEmail(userEmail);
      setId(userid);
      setLocation(Location);
      setSurname(userSurname);
      console.log(Location)

    } catch (error) {
      console.error("Error loading Profile Data", error)
    }
  }

  useEffect(()=>{
    GetUserDetails();
  },[]);

  
 

  // Slide in animation
  useEffect(() => {
    if (openProfileSheet) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [openProfileSheet]);

  // Close sheet when overlay is pressed
  const handleOverlayPress = () => {
    setOpenProfileSheet(false);
  };

  // Prevent touch events from propagating to the overlay
  const handleContentTouch = (e) => {
    e.stopPropagation();
  };

  // Slide down gesture handler
  const handleSlideDown = () => {
    setOpenProfileSheet(false);
  };

  if (!openProfileSheet) return null;

  return (
    <TouchableWithoutFeedback onPress={handleOverlayPress}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleContentTouch}>
          <Animated.View 
            style={[
              styles.bottomSheet, 
              { 
                transform: [{ 
                  translateY: slideAnim 
                }] 
              }
            ]}
          >
            {/* Drag indicator */}
            <TouchableOpacity 
              style={styles.dragIndicator} 
              onPress={handleSlideDown}
            />
            
            {/* Title */}
            <Text style={styles.title}>Personal Details</Text>
            
            {/* Fields */}
            <View style={styles.field}>
              <View style={styles.iconContainer}>
                <FontAwesome name="phone" size={20} color="#6B7280" />
              </View>
              <Text style={styles.fieldText}>{number}</Text>
              <Pressable style={styles.actionIcon} onPress={()=>console.log("Edit Number")}>
                <Feather name="edit-2" size={20} color="#6B7280" />
              </ Pressable>
            </View>
            
            <View style={styles.field}>
              <View style={styles.iconContainer}>
                <FontAwesome name="at" size={20} color="#6B7280" />
              </View>
              <Text style={styles.fieldText}>{email}</Text>
              <View style={styles.actionIcon}>
                <Feather name="lock" size={20} color="#6B7280" />
              </View>
            </View>
            
            <View style={styles.field}>
              <View style={styles.iconContainer}>
                <FontAwesome name="user" size={20} color="#6B7280" />
              </View>
              <Text style={styles.fieldText}>{name || "User"} {usersurname}</Text>
              <View style={styles.actionIcon}>
                <Feather name="lock" size={20} color="#6B7280" />
              </View>
            </View>
            
            <View style={styles.field}>
              <View style={styles.iconContainer}>
                <FontAwesome name="id-card" size={20} color="#6B7280" />
              </View>
              <Text style={styles.fieldText}>{id}</Text>
              <View style={styles.actionIcon}>
                <Feather name="lock" size={20} color="#6B7280" />
              </View>
            </View>
            
            <View style={styles.field}>
              <View style={styles.iconContainer}>
                <FontAwesome name="map-marker" size={20} color="#6B7280" />
              </View>
              <Text style={styles.fieldText}>{location} Lab</Text>
              <View style={styles.actionIcon}>
                <Feather name="lock" size={20} color="#6B7280" />
              </View>
            </View>
            
            {/* Bottom indicator */}
            <View style={styles.bottomIndicator} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 15,
    alignItems: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 25,
    alignSelf: 'center',
    cursor: 'pointer',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F3C4C',
    marginBottom: 30,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    marginBottom: 15,
    padding: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  fieldText: {
    flex: 1,
    fontSize: 16,
    color: '#6B7280',
    fontSize:13
  },
  actionIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIndicator: {
    width: 120,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    marginTop: 20,
    opacity: 0.2,
  },
});

export default ProfileBottomSheet;