// import React, { useRef, useEffect } from 'react';
// import { Modal, Animated, TouchableOpacity, View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

// const windowHeight = Dimensions.get('window').height;
// const windowWidth = Dimensions.get('window').width;

// // Professional color palette
// const COLORS = {
//   primary: '#2E7D32',    // Deep green
//   secondary: '#4CAF50',  // Medium green
//   accent: '#81C784',     // Light green
//   border: '#43A047',     // Border green
//   background: '#F5F9F6', // Light green background
//   text: {
//     dark: '#1C1C1C',
//     medium: '#424242',
//     light: '#757575'
//   }
// };

// const MessagePopup = ({ message, visible, onClose }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(windowHeight)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true
//         }),
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true
//         })
//       ]).start();
//     } else {
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true
//         }),
//         Animated.timing(slideAnim, {
//           toValue: windowHeight,
//           duration: 300,
//           useNativeDriver: true
//         })
//       ]).start();
//     }
//   }, [visible]);

//   if (!visible || !message) return null;

//   return (
//     <Modal transparent={true} visible={visible} onRequestClose={onClose}>
//       <Animated.View 
//         style={[
//           styles.container,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }]
//           }
//         ]}
//       >
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.header}>
//             <View style={styles.headerContent}>
//               <Text style={styles.headerTitle}>Message Details</Text>
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={onClose}
//               >
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
          
//           <View style={styles.content}>
//             <View style={styles.card}>
//               <View style={styles.field}>
//                 <Text style={styles.label}>From</Text>
//                 <Text style={styles.value}>{message.sender}</Text>
//                 <View style={styles.underline} />
//               </View>
              
//               <View style={styles.field}>
//                 <Text style={styles.label}>Message</Text>
//                 <Text style={styles.value}>{message.message}</Text>
//                 <View style={styles.underline} />
//               </View>
              
//               <View style={styles.field}>
//                 <Text style={styles.label}>Date & Time</Text>
//                 <Text style={styles.value}>{message.timestamp}</Text>
//                 <View style={styles.underline} />
//               </View>
//             </View>
//           </View>
//         </SafeAreaView>
//       </Animated.View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     width: windowWidth,
//     height: windowHeight
//   },
//   safeArea: {
//     flex: 1
//   },
//   header: {
//     backgroundColor: COLORS.primary,
//     borderBottomWidth: 2,
//     borderBottomColor: COLORS.border,
//     paddingTop: 8,
//     paddingBottom: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: 'white'
//   },
//   closeButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)'
//   },
//   closeButtonText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: '300'
//   },
//   content: {
//     flex: 1,
//     padding: 20
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 24,
//     marginTop: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   field: {
//     marginBottom: 32
//   },
//   label: {
//     fontSize: 14,
//     color: COLORS.primary,
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//     fontWeight: '600'
//   },
//   value: {
//     fontSize: 18,
//     color: COLORS.text.dark,
//     marginBottom: 8,
//     lineHeight: 24
//   },
//   underline: {
//     height: 1,
//     backgroundColor: COLORS.accent,
//     opacity: 0.5
//   }
// });

// export default MessagePopup;
import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Professional color palette
const COLORS = {
  primary: '#2E7D32',    // Deep green
  secondary: '#4CAF50',  // Medium green
  accent: '#81C784',     // Light green
  border: '#43A047',     // Border green
  background: '#F5F9F6', // Light green background
  overlay: 'rgba(0,0,0,0.5)',
  text: {
    dark: '#1C1C1C',
    medium: '#424242',
    light: '#757575'
  }
};

const ReadMessageBottomSheet = ({ 
  message, 
  visible, 
  onClose 
}) => {
  const insets = useSafeAreaInsets();
  
  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  // Gesture handling
  const gestureHandler = useRef(null);

  useEffect(() => {
    if (visible) {
      // Slide up the bottom sheet
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic)
      });
      // Fade in the overlay
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic)
      });
    } else {
      // Slide down the bottom sheet
      translateY.value = withTiming(SCREEN_HEIGHT, {
        duration: 300,
        easing: Easing.out(Easing.cubic)
      });
      // Fade out the overlay
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic)
      });
    }
  }, [visible]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });

  if (!visible || !message) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Overlay */}
      <Animated.View 
        style={[
          styles.overlay, 
          overlayStyle, 
          { height: SCREEN_HEIGHT }
        ]} 
        onTouchEnd={onClose}
      />

      {/* Bottom Sheet */}
      <PanGestureHandler ref={gestureHandler}>
        <Animated.View 
          style={[
            styles.bottomSheet, 
            animatedStyle,
            { paddingBottom: insets.bottom }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.grabber} />
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>From</Text>
                <Text style={styles.value}>{message.sender}</Text>
                <View style={styles.underline} />
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>Message</Text>
                <Text style={styles.value}>{message.message}</Text>
                <View style={styles.underline} />
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>{message.timestamp}</Text>
                <View style={styles.underline} />
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10
  },
  grabber: {
    width: 50,
    height: 5,
    backgroundColor: COLORS.accent,
    borderRadius: 2.5
  },
  content: {
    padding: 20
  },
  card: {

    borderRadius: 12,
    padding: 24,
  
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2
  },
  field: {
    marginBottom: 32
  },
  label: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600'
  },
  value: {
    fontSize: 18,
    color: COLORS.text.dark,
    marginBottom: 8,
    lineHeight: 24
  },
  underline: {
    height: 1,
    backgroundColor: COLORS.accent,
    opacity: 0.5
  }
});

export default ReadMessageBottomSheet;