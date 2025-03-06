import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions 
} from 'react-native';
import CodeTribe from "../assets/codetribetext.png";
import GetStartedImage from "../assets/getstarted.png"

const { width } = Dimensions.get('window');

const GetStartedScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo - Now as an image and centered */}
        <View style={styles.logoContainer}>
          <Image 
            source= {CodeTribe}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={GetStartedImage} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        
        {/* Text Content - Now centered */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            <Text style={styles.headingGreen}>Track Attendance</Text>
            <Text style={styles.headingGray}>, {'\n'}Stay Accountable</Text>
          </Text>
          <Text style={styles.subheading}>
            Secure check-ins and accurate records{'\n'}for every session.
          </Text>
        </View>
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
        </View>
        
        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("GetStartedSeamlessly")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center', // Center the logo
    marginTop: 20,
    width: '100%',
  },
  logo: {
    width: 150,
    height: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.7,
    marginVertical: 20,
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.8,
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center', // Center the text
  },
  heading: {
    fontSize: 32, // Increased font size
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 38,
    textAlign: 'center', // Center text alignment
  },
  headingGreen: {
    color: '#8CD136',
  },
  headingGray: {
    color: '#555555',
  },
  subheading: {
    fontSize: 16, // Increased font size
    color: '#999999',
    lineHeight: 22,
    textAlign: 'center', // Center text alignment
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressDot: {
    width: 30,
    height: 4,
    backgroundColor: '#8CD136',
    borderRadius: 2,
  },
  button: {
    backgroundColor: '#8CD136',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen ;