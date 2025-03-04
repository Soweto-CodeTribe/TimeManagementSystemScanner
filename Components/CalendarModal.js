import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import {useSelector} from 'react-redux'; 

const CalendarModal = ({ 
  visible, 
  onClose, 
  selectedDate, 
  selectedMonth, 
  selectedYear, 
  weekDates,
  onSelectDate, 
  onApply ,
}) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
  const [localSelectedMonth, setLocalSelectedMonth] = useState(selectedMonth);
  const [localSelectedYear, setLocalSelectedYear] = useState(selectedYear);
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
      console.log(response.data);
    } catch (error) {
      console.log(error);
      
    }
  }
  
  useEffect(()=>{
    handleTimeLine();
  })
  
  useEffect(() => {
    // Update local state when props change
    setLocalSelectedDate(selectedDate);
    setLocalSelectedMonth(selectedMonth);
    setLocalSelectedYear(selectedYear);
  }, [selectedDate, selectedMonth, selectedYear, visible]);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

 
  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const changeMonth = (direction) => {
    const currentIndex = months.indexOf(localSelectedMonth);
    let newIndex;
    let newYear = localSelectedYear;
    
    if (direction === 'prev') {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = 11;
        newYear = localSelectedYear - 1;
      }
    } else {
      newIndex = currentIndex + 1;
      if (newIndex > 11) {
        newIndex = 0;
        newYear = localSelectedYear + 1;
      }
    }
    
    setLocalSelectedMonth(months[newIndex]);
    setLocalSelectedYear(newYear);
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const monthIndex = months.indexOf(localSelectedMonth);
    const firstDayOfMonth = new Date(localSelectedYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(localSelectedYear, monthIndex + 1, 0).getDate();
    
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

  const handleSelectDate = (date) => {
    setLocalSelectedDate(date);
  };

  const handleApply = () => {
    onSelectDate(localSelectedDate, localSelectedMonth, localSelectedYear);
    onApply();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.calendarContainer} onStartShouldSetResponder={() => true}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth('prev')}>
              <Ionicons name="chevron-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>{localSelectedMonth} {localSelectedYear}</Text>
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
                      day === localSelectedDate ? styles.selectedDay : null,
                      day === null ? styles.emptyDay : null
                    ]}
                    onPress={() => day && handleSelectDate(day)}
                    disabled={day === null}
                  >
                    {day !== null && <Text style={[
                      styles.dayText,
                      day === localSelectedDate ? styles.selectedDayText : null
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
                  weekDates[index].month === localSelectedMonth && 
                  weekDates[index].year === localSelectedYear : false;
                
                return (
                  <View key={index} style={styles.weekViewDay}>
                    <Text style={styles.weekViewDayName}>{day}</Text>
                    <TouchableOpacity 
                      style={[
                        styles.weekViewDate,
                        index < 5 ? styles.weekdayDate : styles.weekendDate,
                        day === weekDayLabels[localSelectedDate % 7] ? styles.selectedWeekViewDate : null
                      ]}
                      disabled={index >= 5} // Disable weekend days
                    >
                      <Text style={[
                        styles.weekViewDateText,
                        !isInCurrentMonth ? styles.otherMonthDateText : null,
                        day === weekDayLabels[localSelectedDate % 7] ? styles.selectedWeekViewDateText : null
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
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default CalendarModal;