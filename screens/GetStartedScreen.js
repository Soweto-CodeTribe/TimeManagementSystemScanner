import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import QRcode from "../assets/qrcode.png"

// Dimensions
const { width, height } = Dimensions.get('window');

const GetStartedScreen = () => {

  // declaring variable navigation to useNavigation for usage 
  const navigation = useNavigation(); 

  return (
    <>

    {/*Status Bar*/}
      <StatusBar style="dark" />

    {/* Safe area view */}
      <SafeAreaView style={styles.container}> 

        <View style={styles.wrapper}>

          {/* Decorative gradient in top-right corner */}
          <LinearGradient
            colors={[
              'rgba(138, 192, 82, 0.15)',  
              'rgba(138, 192, 82, 0.1)',   
              'rgba(138, 192, 82, 0)'      
            ]}
            start={{ x: 0.1, y: 0.1 }}         
            end={{ x: 1, y: 1 }}
            style={styles.cornerGradient}
          />


          {/* Main content container */}
          <View style={styles.contentContainer}>

              <Image  source={QRcode} style={styles.image}/>
              {/* <Text style={styles.boxText}>Logo</Text> */}
        
          </View>


          {/* Bottom container with gradient background */}
          <LinearGradient
            colors={['#7C808D', '#7C808D']}
            style={styles.getStartedContainer}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Text style={styles.textcontainer}>Track Time effortly, work brilliantly,</Text>
            <Text style={styles.textcontainer}>eleminate the need of a pen.</Text>
            <Pressable style={styles.LetsGoButton} onPress={()=> navigation.navigate("ScanScreen")}><Text style={{color:"white"}}>Let's Go</Text></Pressable>
          </LinearGradient>

        </View>
      </SafeAreaView>
    </>
  );
};

export default GetStartedScreen;



// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    position: "relative",
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: width * 0.30,              
    height: width * 0.30,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",             
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cornerGradient: {
    width: width * 0.8,        
    height: width * 0.7,
    borderRadius: width * 0.4,
    position: "absolute",
    top: -width * 0.4,               
    right: -width * 0.4,             
  },
  getStartedContainer: {
    width: "100%",
    height: height * 0.40,           
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    shadowColor: "#000", 
    gap:10,            
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  getStartedText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight:52.79,
  },
  textcontainer:{
    color:"white", fontWeight:"400", lineHeight:21.3, fontSize:17
  },
  LetsGoButton:{
    width:352,
    height:44,
    backgroundColor:"#8AC052",
    borderRadius:10,
    marginTop:30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});