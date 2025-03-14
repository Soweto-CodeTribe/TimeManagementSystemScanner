import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalendarModal from "../Components/CalendarModal";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimelineScreen = () => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.toLocaleString("en-US", { month: "long" }));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [weekDates, setWeekDates] = useState([]);
  const [displayDays, setDisplayDays] = useState([]);
  // const TraineeID = useSelector((state) => state.auth.traineeID);
  // const token = useSelector((state) => state.auth.token);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken]= useState(null);
  const [TraineeID, setTraineeID]= useState(null);


 
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
  
  const weekDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const fetchWeeklyData = async () => {
    setIsLoading(true);
    try {
      // Format the date parameter for the API
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      const formattedDay = selectedDate.toString().padStart(2, "0");
      const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
      
      console.log("Fetching data for date:", formattedDate);

      
      
      // Pass the selected date to the API
      const response = await axios.get(
        `https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${TraineeID}&date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      const weeklyDataResponse = data.dailyBreakdown;
      
      console.log("Weekly data fetched:", JSON.stringify(weeklyDataResponse, null, 2));
      setWeeklyData(weeklyDataResponse);
      return weeklyDataResponse;
    } catch (error) {
      console.log("Error fetching timeline:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(()=>{
    const fetchUserData = async ()=>{
     try {
       const ID = await AsyncStorage.getItem('traineeID');
       const Token = await AsyncStorage.getItem('token');

       setToken(Token);
       setTraineeID(ID)
       console.log("This is the Token Nigger", Token);
     } catch (error) {
       console.error("Message error", error)
     }
    }
    fetchUserData();
 },[])


  // Initialize the week days when component mounts or when selectedDate changes
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWeeklyData();
      calculateWeekDates(data);
    };
    
    loadData();
  }, [selectedDate, selectedMonth, selectedYear]);

  // Calculate the dates for the current week (Mon-Fri) based on selected date
  const calculateWeekDates = (weeklyDataArray = []) => {
    const monthIndex = months.indexOf(selectedMonth);
    const selectedDateObj = new Date(selectedYear, monthIndex, selectedDate);
    const dayOfWeek = selectedDateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate the Monday date of this week
    const mondayOffset = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
    const mondayDate = new Date(selectedDateObj);
    mondayDate.setDate(selectedDateObj.getDate() + mondayOffset);

    // Generate dates for Monday through Friday
    const weekDateArray = [];
    const displayDaysArray = [];

    for (let i = 0; i < 5; i++) {
      // Monday to Friday (5 days)
      const currentDate = new Date(mondayDate);
      currentDate.setDate(mondayDate.getDate() + i);

      const day = currentDate.getDate();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      
      // Format the date string to match API response format (YYYY-MM-DD)
      const monthNum = month + 1;
      const formattedMonth = monthNum.toString().padStart(2, "0");
      const formattedDay = day.toString().padStart(2, "0");
      const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
      
      // Find data for this day in the weekly data
      const dayData = weeklyDataArray.find(data => data.date === formattedDate);

      weekDateArray.push({
        date: day,
        month: months[month],
        year: year,
        dayName: weekDayNames[i],
      });

      // Create time ranges based on actual data or default
      let timeRanges = [];
      if (dayData) {
        if (dayData.checkInTime && dayData.checkOutTime) {
          timeRanges.push({ 
            start: formatTime(dayData.checkInTime), 
            end: formatTime(dayData.checkOutTime)
          });
        }
        if (dayData.lunchStartTime && dayData.lunchEndTime) {
          timeRanges.push({ 
            start: formatTime(dayData.lunchStartTime), 
            end: formatTime(dayData.lunchEndTime)
          });
        }
      }
      
      // If no time ranges were added, add default
      if (timeRanges.length === 0) {
        timeRanges = [{ start: "N/A", end: "N/A" }];
      }

      // Create display day object with appropriate styling
      displayDaysArray.push({
        date: day,
        month: months[month],
        year: year,
        dayName: weekDayNames[i],
        backgroundColor: getBackgroundColorForDay(i),
        textColor: getTextColorForDay(i),
        timeRanges: timeRanges,
        dayData: dayData || null, // Store the full day data
        formattedDate: formattedDate
      });
    }

    setWeekDates(weekDateArray);
    setDisplayDays(displayDaysArray);
  };
  
  // Helper function to format time from API
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    // If timeString is already in a good format, return it
    if (timeString.includes(":")) return timeString;
    
    // Otherwise, try to format it
    try {
      const timeDate = new Date(timeString);
      return timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  // Helper functions for styling
  const getBackgroundColorForDay = (dayIndex) => {
    const colors = [
      "#F3E5F5", // Monday
      "#FFF8E1", // Tuesday
      "#99bf71", // Wednesday
      "#f9ebc4", // Thursday
      "#E88EA6", // Friday
    ];
    return colors[dayIndex];
  };

  const getTextColorForDay = (dayIndex) => {
    const colors = [
      "#9C27B0", // Monday
      "#FFA000", // Tuesday
      "#72a534", // Wednesday
      "#ad7c6e", // Thursday
      "#BF6DA1", // Friday
    ];
    return colors[dayIndex];
  };

  const toggleExpand = (day) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleCalendarSelect = (date, month, year) => {
    setSelectedDate(date);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const applyCalendarSelection = async () => {
    const data = await fetchWeeklyData();
    calculateWeekDates(data);
    setShowCalendar(false);
  };

  const renderTimelineItem = (icon, title, time, dayData) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDot} />
      <View style={styles.timelineIconContainer}>
        <Ionicons name={icon} size={20} color="#4CAF50" />
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineTime}>{time || "Data not available"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <TouchableOpacity style={styles.filterButton} onPress={toggleCalendar}>
          <Ionicons name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Month and Week Label */}
      <View style={styles.dateIndicator}>
        <Text style={styles.monthLabel}>
          {weekDates.length > 0
            ? `${weekDates[0].month} ${weekDates[0].date} - ${
                weekDates[0].month === weekDates[4].month
                  ? weekDates[4].date
                  : `${weekDates[4].month} ${weekDates[4].date}`
              }, ${weekDates[0].year}`
            : selectedMonth}
        </Text>
      </View>

      {/* Calendar Modal Component */}
      <CalendarModal
        visible={showCalendar}
        onClose={toggleCalendar}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        weekDates={weekDates}
        onSelectDate={handleCalendarSelect}
        onApply={applyCalendarSelection}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading timeline data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {displayDays.map((day, index) => (
            <View key={index}>
              <View style={styles.dayCard}>
                <View
                  style={[
                    styles.dateContainer,
                    { backgroundColor: day.backgroundColor },
                  ]}
                >
                  <Text style={[styles.dateNumber, { color: day.textColor }]}>
                    {day.date}
                  </Text>
                </View>
                <View style={styles.dayInfoContainer}>
                  <View style={styles.dayHeaderContainer}>
                    <Text style={styles.dayName}>{day.dayName}</Text>
                    <TouchableOpacity onPress={() => toggleExpand(day.dayName)}>
                      <Ionicons
                        name={
                          expandedDay === day.dayName
                            ? "chevron-down"
                            : "chevron-forward"
                        }
                        size={24}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                  {day.timeRanges.map((timeRange, timeIndex) => (
                    <View key={timeIndex} style={styles.timeRangeContainer}>
                      <Ionicons name="time-outline" size={16} color="#999" />
                      <Text style={styles.timeRange}>
                        {timeRange.start === "N/A" ? 
                          "No data available" : 
                          `${timeRange.start} - ${timeRange.end}`}
                      </Text>
                    </View>
                  ))}
                  {day.dayData?.status && (
                    <View style={styles.statusContainer}>
                      <Text style={[
                        styles.statusText, 
                        { color: day.dayData.status === "Present" ? "#4CAF50" : "#F44336" }
                      ]}>
                        {day.dayData.status}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Expanded Timeline Under the Day */}
              {expandedDay === day.dayName && (
                <View style={styles.timelineContainer}>
                  <View style={styles.timelineLine} />
                  {renderTimelineItem(
                    "enter-outline",
                    "Check-in",
                    day.dayData?.checkInTime ? formatTime(day.dayData.checkInTime) : "Data not available"
                  )}
                  {renderTimelineItem(
                    "restaurant-outline",
                    "Lunch-in",
                    day.dayData?.lunchStartTime ? formatTime(day.dayData.lunchStartTime) : "Data not available"
                  )}
                  {renderTimelineItem(
                    "fast-food-outline",
                    "Lunch-out",
                    day.dayData?.lunchEndTime ? formatTime(day.dayData.lunchEndTime) : "Data not available"
                  )}
                  {renderTimelineItem(
                    "exit-outline",
                    "Check-out",
                    day.dayData?.checkOutTime ? formatTime(day.dayData.checkOutTime) : "Data not available"
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Styling

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    marginLeft: 4,
    color: "#4CAF50",
    fontWeight: "500",
  },
  dateIndicator: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthLabel: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  dayCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 8,
  },
  dateNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  dayInfoContainer: {
    flex: 1,
    padding: 12,
  },
  dayHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  timeRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timeRange: {
    marginLeft: 6,
    color: "#666",
    fontSize: 14,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusText: {
    fontWeight: "500",
    fontSize: 14,
  },
  timelineContainer: {
    marginLeft: 45,
    marginRight: 16,
    paddingLeft: 40,
    position: "relative",
    marginBottom: 16,
  },
  timelineLine: {
    position: "absolute",
    left: 10,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: "#4CAF50",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  timelineDot: {
    position: "absolute",
    left: -8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  timelineIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  timelineTime: {
    fontSize: 14,
    color: "#999",
  },
});

export default TimelineScreen;