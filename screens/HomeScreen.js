"use client"

import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from "react-native"
import { BarChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"

const HomeScreen = ({ navigation }) => {
  const [activeStats, setActiveStats] = useState("monthly")
  const [isDayMissed, setIsDayMissed ] = useState(false)
  const name = AsyncStorage.getItem('name');

  // Weekly attendance data for the chart
  const weeklyData = {
    labels: ["M", "T", "W", "T", "F"],
    datasets: [
      {
        data: [40, 80, 85, 55, 60],
      },
    ],
  }

  // const navigation = useNavigate()

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
              <Text style={{fontSize: 20}}>👤</Text>
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
              <Text style={[styles.toggleText, activeStats === "monthly" && styles.activeToggleText]}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, activeStats === "yearly" && styles.activeToggle]}
              onPress={() => setActiveStats("yearly")}
            >
              <Text style={[styles.toggleText, activeStats === "yearly" && styles.activeToggleText]}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isDayMissed && <DocumentsUpload isVisible={isDayMissed} onClose={() => setIsDayMissed(false)}/>}
        <ScrollView>
        {/* Monthly Stats Cards */}
        <View style={styles.statsCards}>
          {/* July Card */}
          <View style={styles.statCard}>
            <Text style={styles.monthTitle}>July</Text>
            <Text style={styles.attendanceText}>89 of 92 days</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: "96%", backgroundColor: "#4A90E2" }]} />
            </View>
            <Text style={styles.percentageText}>96%</Text>
          </View>

          {/* August Card */}
          <View style={styles.statCard}>
            <Text style={styles.monthTitle}>August</Text>
            <Text style={styles.attendanceText}>87 of 92 days</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: "92%", backgroundColor: "#E25B4A" }]} />
            </View>
            <Text style={styles.percentageText}>92%</Text>
          </View>

          {/* September Card */}
          <View style={styles.statCard}>
            <Text style={styles.monthTitle}>September</Text>
            <Text style={styles.attendanceText}>22 of 30 days</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: "73%", backgroundColor: "#E25B4A" }]} />
            </View>
            <Text style={styles.percentageText}>73%</Text>
          </View>
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
    // paddingBottom: 10,
    position: 'fixed',
    top: 0
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
    borderRadius: '25%',
    borderRadius: 50,
    backgroundColor: 'orange',
    gap: 12
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    gap: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
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
    marginTop: 20,
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
    marginTop: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
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
    height: 80, // Space for bottom tabs
  },
})

export default HomeScreen;