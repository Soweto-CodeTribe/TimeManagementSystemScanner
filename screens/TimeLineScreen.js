import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

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

  console.log("This is the ID.. Hello",TraineeID);
  console.log("This is the token.. HELLO", token);



const handleTimeLine = async ()=>{
  try {
    const response = await axios.get(`https://timemanagementsystemserver.onrender.com/api/session/weekly-stats?traineeId=${TraineeID}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    
    const Data = response.data;
    const MonthlyData = JSON.stringify(Data, null, 2);

    console.log("This is the data", MonthlyData);

  } catch (error) {
    console.log(error);
    
  }
}

useEffect(()=>{
  handleTimeLine();
})

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];




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
          { start: '13:00', end: '13:35' }
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

  const selectDate = (date) => {
    setSelectedDate(date);
  };

  const changeMonth = (direction) => {
    const currentIndex = months.indexOf(selectedMonth);
    let newIndex;
    let newYear = selectedYear;
    
    if (direction === 'prev') {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = 11;
        newYear = selectedYear - 1;
      }
    } else {
      newIndex = currentIndex + 1;
      if (newIndex > 11) {
        newIndex = 0;
        newYear = selectedYear + 1;
      }
    }
    
    setSelectedMonth(months[newIndex]);
    setSelectedYear(newYear);
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const monthIndex = months.indexOf(selectedMonth);
    const firstDayOfMonth = new Date(selectedYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    
    // Adjust Sunday as 0 to be the last day (6)
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    const weeks = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Create weeks array by splitting days into chunks of 7
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    // If the last week is not complete, add null for remaining days
    const lastWeek = weeks[weeks.length - 1];
    if (lastWeek.length < 7) {
      for (let i = lastWeek.length; i < 7; i++) {
        lastWeek.push(null);
      }
    }
    
    return weeks;
  };

  const calendarWeeks = generateCalendarDays();

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

  const applyCalendarSelection = () => {
    calculateWeekDates();
    setShowCalendar(false);
  };

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

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleCalendar}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleCalendar}
        >
          <View style={styles.calendarContainer} onStartShouldSetResponder={() => true}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth('prev')}>
                <Ionicons name="chevron-back" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>{selectedMonth} {selectedYear}</Text>
              <TouchableOpacity onPress={() => changeMonth('next')}>
                <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            
            {/* Weekday Headers */}
            <View style={styles.weekDaysContainer}>
              {weekDayLabels.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            {/* Calendar Days */}
            <View style={styles.calendarDaysContainer}>
              {calendarWeeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {week.map((day, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        day === selectedDate ? styles.selectedDay : null,
                        day === null ? styles.emptyDay : null
                      ]}
                      onPress={() => day && selectDate(day)}
                      disabled={day === null}
                    >
                      {day !== null && <Text style={[
                        styles.dayText,
                        day === selectedDate ? styles.selectedDayText : null
                      ]}>{day}</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
            
            {/* Week View Section */}
            <View style={styles.weekViewSection}>
              <Text style={styles.weekViewTitle}>Week View</Text>
              <View style={styles.weekViewDaysContainer}>
                {weekDayLabels.slice(0, 7).map((day, index) => {
                  const dateToDisplay = weekDates[index] ? weekDates[index].date : '';
                  const isInCurrentMonth = weekDates[index] ? 
                    weekDates[index].month === selectedMonth && 
                    weekDates[index].year === selectedYear : false;
                  
                  return (
                    <View key={index} style={styles.weekViewDay}>
                      <Text style={styles.weekViewDayName}>{day}</Text>
                      <TouchableOpacity 
                        style={[
                          styles.weekViewDate,
                          index < 5 ? styles.weekdayDate : styles.weekendDate,
                          day === weekDayLabels[selectedDate % 7] ? styles.selectedWeekViewDate : null
                        ]}
                        disabled={index >= 5} // Disable weekend days
                      >
                        <Text style={[
                          styles.weekViewDateText,
                          !isInCurrentMonth ? styles.otherMonthDateText : null,
                          day === weekDayLabels[selectedDate % 7] ? styles.selectedWeekViewDateText : null
                        ]}>
                          {dateToDisplay}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.calendarActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleCalendar}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyCalendarSelection}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.scrollView}>
        {/* Dynamic Day Cards based on week selection */}
        {displayDays.map((day, index) => (
          <View key={index} style={styles.dayCard}>
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
        ))}

        {/* Timeline Items (shown when a day is expanded) */}
        {expandedDay && (
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />
            {renderTimelineItem('enter-outline', 'Check-in', '08:00')}
            {renderTimelineItem('restaurant-outline', 'Lunch-out', '13:00')}
            {renderTimelineItem('fast-food-outline', 'Lunch-in', '13:35')}
            {renderTimelineItem('exit-outline', 'Check-out', '16:02')}
          </View>
        )}
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
  },
  
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  calendarDaysContainer: {
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Week View Styles
  weekViewSection: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  weekViewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  weekViewDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekViewDay: {
    alignItems: 'center',
  },
  weekViewDayName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  weekViewDate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdayDate: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  weekendDate: {
    opacity: 0.5,
  },
  selectedWeekViewDate: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  weekViewDateText: {
    fontSize: 14,
    color: '#333',
  },
  otherMonthDateText: {
    color: '#999',
  },
  selectedWeekViewDateText: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Calendar Action Buttons
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default TimelineScreen;