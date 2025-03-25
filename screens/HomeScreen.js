"use client"

import { StatusBar } from "expo-status-bar"
import { useState, useEffect, useCallback, useMemo } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native"
import { BarChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoaderPopup, { Loader } from "../Components/LoaderPopup"
import axios from "axios"
import DocumentsUpload from "../Components/DocumentsUpload"
import { Ionicons } from "@expo/vector-icons" // Import Ionicons for the bell icon

// Import the function to get all months
import { getAllProgramMonths } from "./DateUtils"

// Progress Guide component
const AttendanceProgressBar = ({ percentage, showLabel = false }) => {
  const getBarColor = (percent) => {
    if (percent > 80) return "#007BFF" // Blue
    if (percent >= 60) return "#FF9800" // Orange
    return "#FF0000" // Red
  }

  const barColor = getBarColor(percentage)

  return (
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBar,
          {
            width: `${percentage}%`,
            backgroundColor: barColor,
          },
        ]}
      />
      {showLabel && (
        <View style={styles.progressGuideContainer}>
          <Text style={styles.progressGuideText}>
            {percentage > 80
              ? "If A Monthly/Yearly Attendance is Over 80%, The Progress Bar Must Be Blue"
              : percentage >= 60
                ? "If A Monthly/Yearly Attendance is Between 60% And 80%, The Progress Bar Must Be Orange"
                : "If A Monthly/Yearly Attendance is Under 60%, The Progress Bar Must Be Red"}
          </Text>
        </View>
      )}
    </View>
  )
}

const HomeScreen = ({ navigation }) => {
  const [activeStats, setActiveStats] = useState("monthly")
  const [isDayMissed, setIsDayMissed] = useState(false)
  const [name, setName] = useState("User")
  const [dailyData, setDailyData] = useState([])
  const [monthlyStats, setMonthlyStats] = useState([])
  const [yearlyStats, setYearlyStats] = useState([])
  const [programMonths, setProgramMonths] = useState([])
  const [programInfo, setProgramInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")
  const [dataInitialized, setDataInitialized] = useState(false)
  const [image, setImage] = useState(null)

  // Fetch name and token from AsyncStorage
  const fetchNameAndToken = async () => {
    try {
      const storedName = await AsyncStorage.getItem("name")
      if (storedName) setName(storedName)

      const storedToken = await AsyncStorage.getItem("token")
      if (storedToken) setToken(storedToken)

      return storedToken
    } catch (error) {
      console.log("Error fetching data from storage:", error)
      return null
    }
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        const ProfileImage = await AsyncStorage.getItem('profileImage')
        setImage(ProfileImage)
      } catch (error) {
        console.error("Error Loading Image", error)
      }
    }
    
    getProfile()
  }, [])

  // Fetch program information
  const fetchProgramInfo = async (authToken) => {
    try {
      const traineeId = (await AsyncStorage.getItem("traineeId")) || "18"
      if (!authToken) {
        console.error("Token is missing.")
        return null
      }

      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/trainee-program-info/${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (response.data) {
        setProgramInfo(response.data)

        // Get all months for the program duration
        const allMonths = getAllProgramMonths(response.data.programStartDate, response.data.programEndDate)
        setProgramMonths(allMonths)

        return { traineeId, allMonths }
      }

      return null
    } catch (error) {
      console.error("Error fetching program info:", error.response?.data || error.message)
      return null
    }
  }

  // Fetch daily data for the graph
  const fetchDailyData = async (authToken, traineeId) => {
    try {
      if (!authToken || !traineeId) {
        console.error("Token or traineeId is missing.")
        return
      }

      const weeklyResponse = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (weeklyResponse.data) {
        const dailyBreakdown = weeklyResponse.data.dailyBreakdown || []
        setDailyData(dailyBreakdown)
        
        // Return the data for chart creation
        return dailyBreakdown
      }
      return []
    } catch (error) {
      console.error("Error fetching daily data:", error.response?.data || error.message)
      return []
    }
  }

  // Fetch monthly stats for a specific month
  const fetchMonthlyStatsForMonth = async (authToken, traineeId, month, year) => {
    try {
      if (!authToken) {
        console.error("Token is missing.")
        return
      }

      const monthlyResponse = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/monthly-stats?traineeId=${traineeId}&month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (monthlyResponse.data) {
        const stats = monthlyResponse.data.monthlyStats
        const percentage = Number.parseFloat(stats.attendanceRate)

        // Update or add the monthly stats
        setMonthlyStats((prevStats) => {
          // Find if we already have this month in our stats
          const existingIndex = prevStats.findIndex((s) => s.month === stats.monthName && s.year === year)

          const newStat = {
            month: stats.monthName,
            year: year,
            monthYear: `${stats.monthName} ${year}`,
            attended: stats.attendedDays,
            total: stats.workingDaysInMonth,
            percentage: isNaN(percentage) ? 0 : percentage,
            sortDate: new Date(year, month - 1, 1).getTime(), // Add timestamp for sorting
          }

          if (existingIndex >= 0) {
            // Update existing entry
            const newStats = [...prevStats]
            newStats[existingIndex] = newStat
            return newStats
          } else {
            // Add new entry
            return [...prevStats, newStat]
          }
        })

        // Update yearly stats
        updateYearlyStats(year, stats)
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error.response?.data || error.message)
      // For months with no data, add an empty record
      const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ]

      setMonthlyStats((prevStats) => {
        const monthName = monthNames[month - 1]
        // Check if we already have this month
        if (!prevStats.some((s) => s.month === monthName && s.year === year)) {
          return [
            ...prevStats,
            {
              month: monthName,
              year: year,
              monthYear: `${monthName} ${year}`,
              attended: 0,
              total: 0,
              percentage: 0,
              noData: true, 
              sortDate: new Date(year, month - 1, 1).getTime(), 
            },
          ]
        }
        return prevStats
      })
    }
  }

  // Update yearly stats when monthly stats are fetched
  const updateYearlyStats = (year, monthStats) => {
    setYearlyStats((prevYearlyStats) => {
      // Find if we already have this year in our stats
      const existingIndex = prevYearlyStats.findIndex((s) => s.year === year)
      
      if (existingIndex >= 0) {
        // Update existing entry
        const newYearlyStats = [...prevYearlyStats]
        const existingYearStat = newYearlyStats[existingIndex]
        
        // Add month's attendance to yearly total
        const newAttended = existingYearStat.attended + monthStats.attendedDays
        const newTotal = existingYearStat.total + monthStats.workingDaysInMonth
        const newPercentage = (newAttended / newTotal) * 100
        
        newYearlyStats[existingIndex] = {
          ...existingYearStat,
          attended: newAttended,
          total: newTotal,
          percentage: isNaN(newPercentage) ? 0 : newPercentage,
          months: [...(existingYearStat.months || []), monthStats.monthName]
        }
        
        return newYearlyStats
      } else {
        // Add new entry for this year
        return [
          ...prevYearlyStats,
          {
            year: year,
            attended: monthStats.attendedDays,
            total: monthStats.workingDaysInMonth,
            percentage: Number.parseFloat(monthStats.attendanceRate),
            months: [monthStats.monthName]
          }
        ]
      }
    })
  }

  // Fetch all monthly stats for the program duration
  const fetchAllMonthlyStats = async (authToken, traineeId, months) => {
    if (!months || months.length === 0) return

    try {
      // Clear previous stats
      setMonthlyStats([])
      setYearlyStats([])

      // For each month in the program, fetch stats
      const fetchPromises = months.map((monthInfo) =>
        fetchMonthlyStatsForMonth(authToken, traineeId, monthInfo.month, monthInfo.year)
      )

      await Promise.all(fetchPromises)
    } catch (error) {
      console.error("Error fetching all monthly stats:", error)
    }
  }

  // Initialize all data with a single loader
  const initializeData = useCallback(async () => {
    if (dataInitialized) return

    try {
      // Show loader only once at the beginning
      Loader.show()

      // Step 1: Get authentication token
      const authToken = await fetchNameAndToken()
      if (!authToken) {
        console.error("Failed to get authentication token")
        return
      }

      // Step 2: Fetch program info
      const programData = await fetchProgramInfo(authToken)
      if (!programData) {
        console.error("Failed to fetch program info")
        return
      }

      // Step 3: Fetch daily data for the graph
      await fetchDailyData(authToken, programData.traineeId)

      // Step 4: Fetch monthly stats (which will also update yearly stats)
      if (programData.allMonths.length > 0) {
        await fetchAllMonthlyStats(authToken, programData.traineeId, programData.allMonths)
      }

      // Mark data as initialized
      setDataInitialized(true)
    } catch (error) {
      console.error("Error initializing data:", error)
    } finally {
      // Hide loader when all data is loaded
      setLoading(false)
      Loader.hide()
    }
  }, [dataInitialized])

  // Initialize data on component mount
  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Sort and organize monthly stats
  const sortedMonthlyStats = useMemo(() => {
    // First, sort by date (newest first)
    const sorted = [...monthlyStats].sort((a, b) => b.sortDate - a.sortDate)

    // Then, prioritize months with data
    return sorted.sort((a, b) => {
      if (a.noData && !b.noData) return 1 
      if (!a.noData && b.noData) return -1 
      return 0;
    })
  }, [monthlyStats])

  // Sort yearly stats
  const sortedYearlyStats = useMemo(() => {
    return [...yearlyStats].sort((a, b) => b.year - a.year)
  }, [yearlyStats])

  // Prepare data for the weekly attendance chart
  const weeklyChartData = useMemo(() => {
    // Default empty data
    const emptyData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{ 
        data: [0, 0, 0, 0, 0],
        color: () => '#8CC63F', // Solid green color
        strokeWidth: 0 // No stroke
      }]
    }
    
    if (!dailyData || dailyData.length === 0) return emptyData
    
    // Map days to their attendance data
    const dayLabels = []
    const attendanceData = []
    
    dailyData.forEach(day => {
      // Extract day abbreviation
      const dayAbbr = day.dayOfWeek ? day.dayOfWeek.substring(0, 3) : ""
      dayLabels.push(dayAbbr)
      
      // Calculate hours worked or use 0 if absent
      const hoursWorked = day.attended ? parseFloat(day.hoursWorked || "0") : 0
      attendanceData.push(hoursWorked)
    })
    
    return {
      labels: dayLabels,
      datasets: [{ 
        data: attendanceData,
        color: () => '#8CC63F', 
        strokeWidth: 0 
      }]
    }
  }, [dailyData])

  // Current date
  const today = new Date()
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const currentDate = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#fff"} style={"dark"} />

      {/* Include the loader component */}
      <LoaderPopup />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {name}</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")} style={styles.iconButton}>
            <View style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={26} color="#000000" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")} style={styles.iconButton}>
            <Image
              source={{
                uri: image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Z6HPIGZArOlwZgZRYD64JxoekuRd7t.png",
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
          data={{
            labels: weeklyChartData.labels,
            datasets: [
              {
                data: weeklyChartData.datasets[0].data,
              }
            ]
          }}
          width={Dimensions.get("window").width - 40}
          height={250}
          yAxisSuffix=" Hrs"
          chartConfig={{
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 1,
            color: () => "#8CC63F",
            fillShadowGradient: "#8CC63F",
            fillShadowGradientOpacity: 3,
            barPercentage: .75,
            labelColor: () => "#808285",
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#EEEEEE",
              strokeWidth: 1,
            },
          }}
          style={styles.chart}
          fromZero={true}
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
            <Text style={[styles.toggleText, activeStats === "yearly" && styles.activeToggleText]}>Yearly</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isDayMissed && <DocumentsUpload isVisible={isDayMissed} onClose={() => setIsDayMissed(false)} />}
      <ScrollView>
        {/* Stats Cards based on active view */}
        <View style={styles.statsCards}>
          {activeStats === "monthly" &&
            sortedMonthlyStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.monthTitle}>{stat.monthYear}</Text>
                {stat.noData ? (
                  <Text style={styles.attendanceText}>No data available yet</Text>
                ) : (
                  <>
                    <Text style={styles.attendanceText}>
                      {stat.attended} of {stat.total} days
                    </Text>
                    <AttendanceProgressBar percentage={stat.percentage} />
                    <Text style={styles.percentageText}>{stat.percentage.toFixed(1)}%</Text>
                  </>
                )}
              </View>
            ))}

          {activeStats === "yearly" &&
            sortedYearlyStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.monthTitle}>Year {stat.year}</Text>
                {stat.total === 0 ? (
                  <Text style={styles.attendanceText}>No data available yet</Text>
                ) : (
                  <>
                    <Text style={styles.attendanceText}>
                      {stat.attended} of {stat.total} days
                    </Text>
                    <AttendanceProgressBar percentage={stat.percentage} />
                    <Text style={styles.percentageText}>{stat.percentage.toFixed(1)}%</Text>
                    <Text style={styles.monthsCountText}>
                      Data available for {stat.months ? stat.months.length : 0} months
                    </Text>
                  </>
                )}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
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
  iconButton: {
    padding: 5,
    borderRadius: 50,
    gap: 12,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 100,
    paddingVertical: 15,
  },
  profileImage: {
    width: 38,
    objectFit: 'contain',
    height: 38,
    borderRadius: 50,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333333",
    marginTop: 10,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -10,
  },
  statsSection: {
    marginHorizontal: 20,
    // marginTop: 10,
  },
  dailyAttendanceSection: {
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
    marginHorizontal: 0,
    marginTop: 15,
    gap: 15,
  },
  notificationIcon:{
  backgroundColor: '#8CC63F',
  opacity: 0.4,
  padding: 5,
  borderRadius: 50,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 20
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
  monthsCountText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },
  bottomSpacer: {
    height: 80,
  },
  progressGuideContainer: {
    marginTop: 8,
    backgroundColor: "#F8F8F8",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  progressGuideText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  statusContainer: {
    marginVertical: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  hoursText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
})

export default HomeScreen