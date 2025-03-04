import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarModal from '../Components/CalendarModal';
import axios from "axios"
import {useSelector} from 'react-redux';

const TimelineScreen = () => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(24);
  const [weekDates, setWeekDates] = useState([]);
  const [displayDays, setDisplayDays] = useState([]);
  const TraineeID = useSelector((state) => state.auth.traineeID);
  const token = useSelector((state) => state.auth.token);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


  console.log("This is the ID.. Hello",TraineeID);
  console.log("This is the token.. HELLO", token);



const handleTimeLine = async ()=>{
  try {
    const response = await axios.get(`https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${TraineeID}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
  } catch (error) {
    console.log(error);
    
  }
}

useEffect(()=>{
  handleTimeLine();
})

  // Initialize the week days when component mounts or when selectedDate changes
  useEffect(() => {
    calculateWeekDates();
  }, [selectedDate, selectedMonth, selectedYear]);

  // Calculate the dates for the current week (Mon-Fri) based on selected date
  const calculateWeekDates = () => {
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
    
    for (let i = 0; i < 5; i++) { // Monday to Friday (5 days)
      const currentDate = new Date(mondayDate);
      currentDate.setDate(mondayDate.getDate() + i);
      
      const day = currentDate.getDate();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      
      weekDateArray.push({
        date: day,
        month: months[month],
        year: year,
        dayName: weekDayNames[i]
      });
      
      // Create display day object with appropriate styling
      displayDaysArray.push({
        date: day,
        dayName: weekDayNames[i],
        backgroundColor: getBackgroundColorForDay(i),
        textColor: getTextColorForDay(i),
        timeRanges: [
          { start: '08:00', end: '16:02' },
          { start: '13:00', end: '13:35' },

        ]
      });
    }
    
    setWeekDates(weekDateArray);
    setDisplayDays(displayDaysArray);
  };
  
  // Helper functions for styling
  const getBackgroundColorForDay = (dayIndex) => {
    const colors = [
      '#F3E5F5', // Monday
      '#FFF8E1', // Tuesday
      '#99bf71', // Wednesday
      '#f9ebc4', // Thursday
      '#E88EA6'  // Friday
    ];
    return colors[dayIndex];
  };
  
  const getTextColorForDay = (dayIndex) => {
    const colors = [
      '#9C27B0', // Monday
      '#FFA000', // Tuesday
      '#72a534', // Wednesday
      '#ad7c6e', // Thursday
      '#BF6DA1'  // Friday
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

  const applyCalendarSelection = () => {
    calculateWeekDates();
    setShowCalendar(false);
  };

  const renderTimelineItem = (icon, title, time) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDot} />
      <View style={styles.timelineIconContainer}>
        <Ionicons name={icon} size={20} color="#4CAF50" />
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
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
      {weekDates.length > 0 ? 
        `${weekDates[0].month} ${weekDates[0].date} - ${
          weekDates[0].month === weekDates[4].month ? 
            weekDates[4].date : 
            `${weekDates[4].month} ${weekDates[4].date}`
        }, ${weekDates[0].year}` : 
        selectedMonth
      }
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
        handleTimeLine={handleTimeLine}
      />

<ScrollView style={styles.scrollView}>
  {displayDays.map((day, index) => (
    <View key={index}>
      <View style={styles.dayCard}>
        <View 
          style={[
            styles.dateContainer, 
            { backgroundColor: day.backgroundColor }
          ]}
        >
          <Text 
            style={[
              styles.dateNumber, 
              { color: day.textColor }
            ]}
          >
            {day.date}
          </Text>
        </View>
        <View style={styles.dayInfoContainer}>
          <View style={styles.dayHeaderContainer}>
            <Text style={styles.dayName}>{day.dayName}</Text>
            <TouchableOpacity onPress={() => toggleExpand(day.dayName)}>
              <Ionicons 
                name={expandedDay === day.dayName ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
          {day.timeRanges.map((timeRange, timeIndex) => (
            <View key={timeIndex} style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>
                {timeRange.start} - {timeRange.end}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Expanded Timeline Under the Day */}
      {expandedDay === day.dayName && (
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />
          {renderTimelineItem('enter-outline', 'Check-in', '08:00')}
          {renderTimelineItem('restaurant-outline', 'Lunch-out', '13:00')}
          {renderTimelineItem('fast-food-outline', 'Lunch-in', '13:35')}
          {renderTimelineItem('exit-outline', 'Check-out', '16:02')}
        </View>
      )}
    </View>
  ))}
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: '500',
  },
  dateIndicator: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  dayCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 8,
  },
  dateNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  dayInfoContainer: {
    flex: 1,
    padding: 12,
  },
  dayHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeRange: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  timelineContainer: {
    marginLeft: 45,
    marginRight: 16,
    paddingLeft: 40,
    position: 'relative',
    marginBottom: 16,
  },
  timelineLine: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: '#4CAF50',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  timelineIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timelineTime: {
    fontSize: 14,
    color: '#999',
  }
});

export default TimelineScreen;