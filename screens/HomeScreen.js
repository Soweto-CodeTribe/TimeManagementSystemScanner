import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderPopup, { Loader } from "../Components/LoaderPopup";
import axios from "axios";
import DocumentsUpload from "../Components/DocumentsUpload";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logout } from "../Components/Redux/Slices/AuthenticationSlice";

// Import the function to get all months
import { getAllProgramMonths } from "./DateUtils";

// Progress Guide component
const AttendanceProgressBar = ({ percentage, showLabel = false }) => {
  const getBarColor = (percent) => {
    if (percent > 80) return "#007BFF"; // Blue
    if (percent >= 60) return "#FF9800"; // Orange
    return "#FF0000"; // Red
  };

  const barColor = getBarColor(percentage);

  return (
    <View style={[styles.progressContainer, { position: 'relative' }]}>

      <View style={
        {
          // backgroundColor: 'red',
          position: 'absolute',
          height: 30,
          width: 30,
          top: -60,
          right: 0,
        }
      }>
        <Ionicons
          name="calendar-outline"
          size={28}
          color="rgba(76, 175, 80, 0.7)"
        />
      </View>
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
  );
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [activeStats, setActiveStats] = useState("monthly");
  const [isDayMissed, setIsDayMissed] = useState(false);
  const [name, setName] = useState("User");
  const [dailyData, setDailyData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [programMonths, setProgramMonths] = useState([]);
  const [programInfo, setProgramInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [dataInitialized, setDataInitialized] = useState(false);
  const [image, setImage] = useState(null);
  const [activity, setActivity] = useState(false);

  // Add state to track if logout is already in progress
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const tokenExpiredRef = useRef(false);

  // Function to handle expired token - now with protection against multiple calls
  const handleExpiredToken = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (tokenExpiredRef.current || isLoggingOut) {
      return;
    }

    tokenExpiredRef.current = true;

    Alert.alert(
      "Session Expired",
      "Your session has expired. Please sign in again.",
      [
        {
          text: "OK",
          onPress: async () => {
            if (isLoggingOut) return; // Double check

            setIsLoggingOut(true);
            setActivity(true);

            try {
              await logUserOut();
            } catch (error) {
              console.error("Error during logout:", error);
            }

            // Use setTimeout to ensure state update completes
            setTimeout(() => {
              dispatch(logout()); // Dispatch logout action
              setTimeout(() => {
                setActivity(false);
                navigation.navigate("PermissionsScreen");
              }, 1000); // Reduced timeout
            }, 100);
          }
        }
      ],
      { cancelable: false } // Prevent dismissing by tapping outside
    );
  }, [isLoggingOut, dispatch, navigation]);

  // Add logout function similar to ProfileScreen
  const logUserOut = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error);
    }
  };

  // Helper function to check if error is 401 and handle token expiration
  const handleApiError = useCallback((error, context = "") => {
    console.error(`Error in ${context}:`, error.response?.data || error.message);

    // Only handle token expiration if we haven't already started the process
    if (error.response && error.response.status === 401 && !tokenExpiredRef.current) {
      handleExpiredToken();
    }
  }, [handleExpiredToken]);

  // Fetch name and token from AsyncStorage
  const fetchNameAndToken = async () => {
    try {
      const storedName = await AsyncStorage.getItem("name");
      if (storedName) setName(storedName);

      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) setToken(storedToken);

      return storedToken;
    } catch (error) {
      console.error("Error fetching data from storage:", error);
      return null;
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const ProfileImage = await AsyncStorage.getItem("profileImage");
        setImage(ProfileImage);
      } catch (error) {
        console.error("Error Loading Image", error);
      }
    };

    getProfile();
  }, []);

  // Fetch program information
  const fetchProgramInfo = async (authToken) => {
    try {
      const traineeId = (await AsyncStorage.getItem("traineeID"));
      if (!authToken) {
        console.error("Token is missing.");
        if (!tokenExpiredRef.current) {
          handleExpiredToken();
        }
        return null;
      }

      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/trainee-program-info/${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        setProgramInfo(response.data);
        console.log(response.data)

        // Get all months for the program duration
        const allMonths = getAllProgramMonths(
          response.data.programStartDate,
          response.data.programEndDate
        );
        setProgramMonths(allMonths);

        return { traineeId, allMonths };
      }

      return null;
    } catch (error) {
      handleApiError(error, "fetchProgramInfo");
      return null;
    }
  };

  // Fetch daily data for the graph
  const fetchDailyData = async (authToken, traineeId) => {
    try {
      if (!authToken || !traineeId) {
        console.error("Token or traineeId is missing.");
        if (!tokenExpiredRef.current) {
          handleExpiredToken();
        }
        return;
      }

      const weeklyResponse = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${traineeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (weeklyResponse.data) {
        const dailyBreakdown = weeklyResponse.data.dailyBreakdown || [];
        setDailyData(dailyBreakdown);

        // Return the data for chart creation
        return dailyBreakdown;
      }
      return [];
    } catch (error) {
      handleApiError(error, "fetchDailyData");
      return [];
    }
  };

  // Fetch monthly stats for a specific month
  const fetchMonthlyStatsForMonth = async (
    authToken,
    traineeId,
    month,
    year
  ) => {
    try {
      if (!authToken) {
        console.error("Token is missing.");
        if (!tokenExpiredRef.current) {
          handleExpiredToken();
        }
        return;
      }

      const monthlyResponse = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/monthly-stats?traineeId=${traineeId}&month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (monthlyResponse.data) {
        const stats = monthlyResponse.data.monthlyStats;

        // Convert the percentage string to a number
        const percentageStr = stats.attendanceRate;
        const percentage = parseFloat(percentageStr.replace('%', ''));

        // Update or add the monthly stats
        setMonthlyStats((prevStats) => {
          // Find if we already have this month in our stats
          const existingIndex = prevStats.findIndex(
            (s) => s.month === stats.monthName && s.year === year
          );

          const newStat = {
            month: stats.monthName,
            year: year,
            monthYear: `${stats.monthName} ${year}`,
            attended: stats.attendedDays,
            total: stats.workingDaysInMonth,
            percentage: isNaN(percentage) ? 0 : percentage,
            sortDate: new Date(year, month - 1, 1).getTime(), // Add timestamp for sorting
          };

          if (existingIndex >= 0) {
            // Update existing entry
            const newStats = [...prevStats];
            newStats[existingIndex] = newStat;
            return newStats;
          } else {
            // Add new entry
            return [...prevStats, newStat];
          }
        });

        // Update yearly stats with correct data
        updateYearlyStats(year, stats);
      }
    } catch (error) {
      handleApiError(error, "fetchMonthlyStatsForMonth");

      // For months with no data, add an empty record (only if not a 401 error)
      if (!error.response || error.response.status !== 401) {
        const monthNames = [
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
        ];

        setMonthlyStats((prevStats) => {
          const monthName = monthNames[month - 1];
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
            ];
          }
          return prevStats;
        });
      }
    }
  };

  // First, add a function to identify the current month
  const isCurrentMonth = (monthName, year) => {
    const today = new Date();
    const currentMonthName = months[today.getMonth()];
    const currentYear = today.getFullYear();
    return monthName === currentMonthName && year === currentYear;
  };

  // Create a ref for the ScrollView
  const scrollViewRef = useRef(null);

  // Create a ref for the current month card position
  const currentMonthRef = useRef(null);

  // Function to scroll to current month
  const scrollToCurrentMonth = () => {
    if (currentMonthRef.current && scrollViewRef.current) {
      // Add a slight delay to ensure layout is complete
      setTimeout(() => {
        currentMonthRef.current.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y: y - 150, animated: true });
          },
          () => console.log("Failed to measure")
        );
      }, 100);
    }
  };


  // Scroll to current month when activeStats changes to "monthly"
  useEffect(() => {
    if (activeStats === "monthly" && sortedMonthlyStats && sortedMonthlyStats.length > 0) {
      scrollToCurrentMonth();
    }
  }, [activeStats, sortedMonthlyStats]);
  // Update yearly stats when monthly stats are fetched
  const updateYearlyStats = (year, monthStats) => {
    setYearlyStats((prevYearlyStats) => {
      // Find if we already have this year in our stats
      const existingIndex = prevYearlyStats.findIndex((s) => s.year === year);

      // Parse attendance rate properly
      const attendanceRateStr = monthStats.attendanceRate;
      const attendanceRate = parseFloat(attendanceRateStr.replace('%', ''));

      if (existingIndex >= 0) {
        // Update existing entry
        const newYearlyStats = [...prevYearlyStats];
        const existingYearStat = newYearlyStats[existingIndex];

        // Add month's attendance to yearly total
        const newAttended = existingYearStat.attended + monthStats.attendedDays;
        const newTotal = existingYearStat.total + monthStats.workingDaysInMonth;
        const newPercentage = (newAttended / newTotal) * 100;

        newYearlyStats[existingIndex] = {
          ...existingYearStat,
          attended: newAttended,
          total: newTotal,
          percentage: isNaN(newPercentage) ? 0 : newPercentage,
          months: [...(existingYearStat.months || []), monthStats.monthName],
        };

        return newYearlyStats;
      } else {
        // Add new entry for this year
        return [
          ...prevYearlyStats,
          {
            year: year,
            attended: monthStats.attendedDays,
            total: monthStats.workingDaysInMonth,
            percentage: isNaN(attendanceRate) ? 0 : attendanceRate,
            months: [monthStats.monthName],
          },
        ];
      }
    });
  };

  // Fetch all monthly stats for the program duration
  const fetchAllMonthlyStats = async (authToken, traineeId, months) => {
    if (!months || months.length === 0) return;

    try {
      // Clear previous stats
      setMonthlyStats([]);
      setYearlyStats([]);

      // For each month in the program, fetch stats
      const fetchPromises = months.map((monthInfo) =>
        fetchMonthlyStatsForMonth(
          authToken,
          traineeId,
          monthInfo.month,
          monthInfo.year
        )
      );

      await Promise.all(fetchPromises);
    } catch (error) {
      handleApiError(error, "fetchAllMonthlyStats");
    }
  };

  // Initialize all data with a single loader
  const initializeData = useCallback(async () => {
    if (dataInitialized || tokenExpiredRef.current) return;

    try {
      // Show loader only once at the beginning
      Loader.show();

      // Step 1: Get authentication token
      const authToken = await fetchNameAndToken();
      if (!authToken) {
        console.error("Failed to get authentication token");
        if (!tokenExpiredRef.current) {
          handleExpiredToken();
        }
        return;
      }

      // Step 2: Fetch program info
      const programData = await fetchProgramInfo(authToken);
      if (!programData) {
        console.error("Failed to fetch program info");
        return;
      }

      // Step 3: Fetch daily data for the graph
      await fetchDailyData(authToken, programData.traineeId);

      // Step 4: Fetch monthly stats (which will also update yearly stats)
      if (programData.allMonths.length > 0) {
        await fetchAllMonthlyStats(
          authToken,
          programData.traineeId,
          programData.allMonths
        );
      }

      // Mark data as initialized
      setDataInitialized(true);
    } catch (error) {
      handleApiError(error, "initializeData");
    } finally {
      // Hide loader when all data is loaded
      setLoading(false);
      Loader.hide();
    }
  }, [dataInitialized, handleExpiredToken]);

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Sort and organize monthly stats
  const sortedMonthlyStats = useMemo(() => {
    // First, sort by date (newest first)
    const sorted = [...monthlyStats].sort((a, b) => b.sortDate - a.sortDate);

    // Then, prioritize months with data
    return sorted.sort((a, b) => {
      if (a.noData && !b.noData) return 1;
      if (!a.noData && b.noData) return -1;
      return 0;
    });
  }, [monthlyStats]);

  // Sort yearly stats
  const sortedYearlyStats = useMemo(() => {
    return [...yearlyStats].sort((a, b) => b.year - a.year);
  }, [yearlyStats]);

  // Prepare data for the weekly attendance chart
  const weeklyChartData = useMemo(() => {
  const emptyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{ data: [0, 0, 0, 0, 0] }],
  };

  if (!dailyData?.length) return emptyData;

  const dayMap = new Map();
  dailyData.forEach((day) => {
    const dayAbbr = day?.dayOfWeek?.slice(0, 3);
    const hoursWorked = day?.attended ? Math.max(0, Number(day.hoursWorked) || 0) : 0;
    if (dayAbbr) {
      dayMap.set(dayAbbr, hoursWorked);
    }
  });

  // Ensure consistent weekday structure
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceData = weekdays.map(day => dayMap.get(day) || 0);

  return {
    labels: weekdays,
    datasets: [{ data: attendanceData }],
  };
}, [dailyData]);


  // Current date
  const today = new Date();
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
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDate = `${days[today.getDay()]}, ${months[today.getMonth()]
    } ${today.getDate()}, ${today.getFullYear()}`;

  // Show loading indicator when logging out
  if (activity) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8CC63F" />
      </View>
    );
  }

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
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
            style={styles.iconButton}
          >
            <View style={styles.notificationIcon}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#000000"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
            style={styles.iconButton}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.notificationIcon}>
                <Ionicons name="person-outline" size={22} color="#000000" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekly Attendance Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Attendance</Text>
        <BarChart
          data={weeklyChartData}
          width={Dimensions.get("window").width - 20}
          height={250}
          yAxisSuffix=" Hrs"
          chartConfig={{
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 1,
            color: () => "#8CC63F",
            fillShadowGradient: "#8CC63F",
            fillShadowGradientOpacity: .3,
            barPercentage: 0.95,
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
            style={[
              styles.toggleButton,
              activeStats === "monthly" && styles.activeToggle,
            ]}
            onPress={() => setActiveStats("monthly")}
          >
            <Text
              style={[
                styles.toggleText,
                activeStats === "monthly" && styles.activeToggleText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeStats === "yearly" && styles.activeToggle,
            ]}
            onPress={() => setActiveStats("yearly")}
          >
            <Text
              style={[
                styles.toggleText,
                activeStats === "yearly" && styles.activeToggleText,
              ]}
            >
              Yearly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isDayMissed && (
        <DocumentsUpload
          isVisible={isDayMissed}
          onClose={() => setIsDayMissed(false)}
        />
      )}
      <ScrollView ref={scrollViewRef}>
        {/* Stats Cards based on active view */}
        <View style={styles.statsCards}>
          {activeStats === "monthly" &&
            sortedMonthlyStats.slice().reverse().map((stat, index) => {
              const isCurrentMonthStat = isCurrentMonth(stat.month, stat.year);
              return (
                <View
                  key={index}
                  ref={isCurrentMonthStat ? currentMonthRef : null}
                  style={[
                    styles.statCard,
                    isCurrentMonthStat && styles.currentMonthCard
                  ]}
                >
                  <Text style={[
                    styles.monthTitle,
                    isCurrentMonthStat && styles.currentMonthTitle
                  ]}>
                    {stat.monthYear} {isCurrentMonthStat && '(Current)'}
                  </Text>
                  {stat.noData ? (
                    <Text style={styles.attendanceText}>
                      No data available yet
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.attendanceText}>
                        {stat.attended} of {stat.total} days
                      </Text>
                      <AttendanceProgressBar percentage={stat.percentage} />
                      <Text style={styles.percentageText}>
                        {stat.percentage.toFixed(1)}%
                      </Text>
                    </>
                  )}
                </View>
              );
            })}

          {activeStats === "yearly" &&
            sortedYearlyStats.slice().reverse().map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.monthTitle}>Year {stat.year}</Text>
                {stat.total === 0 ? (
                  <Text style={styles.attendanceText}>
                    No data available yet
                  </Text>
                ) : (
                  <>
                    <Text style={styles.attendanceText}>
                      {stat.attended} of {stat.total} days
                    </Text>
                    <AttendanceProgressBar percentage={stat.percentage} />
                    <Text style={styles.percentageText}>
                      {stat.percentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.monthsCountText}>
                      Data available for {stat.months ? stat.months.length : 0}{" "}
                      months
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
  );
};

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
    gap: 0,
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
    objectFit: "contain",
    height: 38,
    borderRadius: 10,
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
    borderRadius: 18,
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
  notificationIcon: {
    backgroundColor: "#8CC63F",
    opacity: 0.4,
    padding: 8,
    borderRadius: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 15,
    marginHorizontal: 20,
    borderWidth: 4,
    borderColor: "rgba(0, 0, 0, .075)",
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
    height: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    marginVertical: 8,
  },
  progressBar: {
    height: 16,
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    alignSelf: "flex-end",
  },
  currentMonthCard: {
    borderWidth: 5,
    borderColor: '#8CC63F',
    backgroundColor: '#F9FFF4',
  },
  currentMonthTitle: {
    color: '#8CC63F',
    fontWeight: '700',
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
});

export default HomeScreen;