"use client"

import { StatusBar } from "expo-status-bar"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native"
import { BarChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Progress Guide component based on the screenshot
const AttendanceProgressBar = ({ percentage, showLabel = false }) => {
  // Determine the color based on percentage thresholds
  const getBarColor = (percent) => {
    if (percent > 80) return "#007BFF"; // Blue
    if (percent >= 60) return "#FF9800"; // Orange
    return "#FF0000"; // Red
  };

 
  const barColor = getBarColor(percentage);

  return (
    <View style={styles.progressContainer}>
      <View 
        style={[
          styles.progressBar, 
          { 
            width: `${percentage}%`,
            backgroundColor: barColor 
          }
        ]} 
      />
      {showLabel && (
        <View style={styles.progressGuideContainer}>
          <Text style={styles.progressGuideText}>
            {percentage > 80 
              ? "If A Monthly/Yearly Attendance is Over 80%, The Progress Bar Must Be Blue"
              : percentage >= 60 
                ? "If A Monthly/Yearly Attendance is Between 60% And 80%, The Progress Bar Must Be Orange"
                : "If A Monthly/Yearly Attendance is Under 60%, The Progress Bar Must Be Red"
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [activeStats, setActiveStats] = useState("monthly")
  const [isDayMissed, setIsDayMissed] = useState(false)
  const [name, setName] = useState("User") // Default value
  const [image, setImage] = useState(null)


  useEffect(()=>{
    const getProfile = async ()=>{
      try {
        const ProfileImage = await AsyncStorage.getItem('profileImage');
        setImage(ProfileImage);
  
        console.log("This is the image",ProfileImage)
        
      } catch (error) {
        console.error("Error Loading Image", error)
      }
    }
    
    getProfile();
  },[]);
  
  // Fetch name from AsyncStorage
  const fetchName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('name');
      if (storedName) setName(storedName);
    } catch (error) {
      console.log("Error fetching name:", error);
    }
  };
  
  // Call fetchName when component mounts
  useState(() => {
    fetchName();
  }, []);

  // Weekly attendance data for the chart
  const weeklyData = {
    labels: ["M", "T", "W", "T", "F"],
    datasets: [
      {
        data: [40, 80, 85, 55, 60],
      },
    ],
  }

  // Current date
  const today = new Date()
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const currentDate = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`

  // Monthly stats data
  const monthlyStats = [
    // Excellent attendance (>80%) - Blue progress bars
    { month: "January", attended: 28, total: 31, percentage: 90 },
    { month: "February", attended: 27, total: 28, percentage: 96 },
    { month: "March", attended: 29, total: 31, percentage: 94 },
    
    // Moderate attendance (60-80%) - Orange progress bars
    { month: "April", attended: 21, total: 30, percentage: 70 },
    { month: "May", attended: 22, total: 31, percentage: 71 },
    { month: "June", attended: 24, total: 30, percentage: 80 },
    
    // Poor attendance (<60%) - Red progress bars
    { month: "July", attended: 15, total: 31, percentage: 48 },
    { month: "August", attended: 17, total: 31, percentage: 55 },
    { month: "September", attended: 16, total: 30, percentage: 53 },
    
    // Mixed recent months
    { month: "October", attended: 28, total: 31, percentage: 90 }, // Good - Blue
    { month: "November", attended: 19, total: 30, percentage: 63 }, // Moderate - Orange
    { month: "December", attended: 12, total: 31, percentage: 39 }  // Poor - Red
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} style={'dark'}/>
      
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {name}</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={()=> navigation.navigate('NotificationScreen')} style={styles.iconButton}>
            <Text style={{fontSize: 20}}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate("ProfileScreen")} style={styles.iconButton}>
          <Image
              source={{
                 uri: image 
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
     
      {/* Weekly Attendance Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Attendance</Text>
        <BarChart
          data={weeklyData}
          width={Dimensions.get("window").width - 40}
          height={180}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(107, 189, 49, ${opacity})`,
            labelColor: () => "#ADADAD",
            barPercentage: 0.6,
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#EEEEEE",
              strokeWidth: 1,
            },
          }}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars={false}
          withInnerLines={true}
          withHorizontalLabels={true}
        />
      </View>

      {/* Overview Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Overview Stats</Text>

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeStats === "monthly" && styles.activeToggle]}
            onPress={() => setActiveStats("monthly")}
          >
            <Text style={[styles.toggleText, activeStats === "monthly" && styles.activeToggleText]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeStats === "yearly" && styles.activeToggle]}
            onPress={() => setActiveStats("yearly")}
          >
            <Text style={[styles.toggleText, activeStats === "yearly" && styles.activeToggleText]}>Weekly</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isDayMissed && <DocumentsUpload isVisible={isDayMissed} onClose={() => setIsDayMissed(false)}/>}
      <ScrollView>
        {/* Monthly Stats Cards */}
        <View style={styles.statsCards}>
          {monthlyStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.monthTitle}>{stat.month}</Text>
              <Text style={styles.attendanceText}>{stat.attended} of {stat.total} days</Text>
              
              {/* Using the new AttendanceProgressBar component */}
              <AttendanceProgressBar percentage={stat.percentage} />
              
              <Text style={styles.percentageText}>{stat.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Spacer for bottom tabs */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  date: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  avatarContainer: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton:{
    padding: 5,
    borderRadius: 50,
    gap: 12
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 100, 
    paddingVertical: 15,
  },
  profileImage:{
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -15,
  },
  statsSection: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 4,
    width: 200,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    flex: 1,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    color: "#888888",
  },
  activeToggleText: {
    color: "#333333",
    fontWeight: "500",
  },
  statsCards: {
    marginHorizontal: 20,
    marginTop: 15,
    gap: 15,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  attendanceText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    alignSelf: "flex-end",
  },
  bottomSpacer: {
    height: 80, 
  },
})

export default HomeScreen;