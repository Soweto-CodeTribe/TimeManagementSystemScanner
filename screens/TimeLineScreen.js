import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TimelineScreen = () => {
  const [expandedDay, setExpandedDay] = useState('Monday');

  const toggleExpand = (day) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
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
        {/* <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#666" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Timeline</Text>
      </View>

      {/* Month Label */}
      <Text style={styles.monthLabel}>February</Text>

      <ScrollView style={styles.scrollView}>
        {/* Tuesday Card */}
        <View style={styles.dayCard}>
          <View style={[styles.dateContainer, { backgroundColor: '#F3E5F5' }]}>
            <Text style={[styles.dateNumber, { color: '#9C27B0' }]}>23</Text>
          </View>
          <View style={styles.dayInfoContainer}>
            <View style={styles.dayHeaderContainer}>
              <Text style={styles.dayName}>Monday</Text>
              <TouchableOpacity onPress={() => toggleExpand('Tuesday')}>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>08:00 - 16:02</Text>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>08:00 - 16:02</Text>
            </View>
          </View>
        </View>

        {/* Monday Card (Expanded) */}
        <View style={styles.dayCard}>
          <View style={[styles.dateContainer, { backgroundColor: '#FFF8E1' }]}>
            <Text style={[styles.dateNumber, { color: '#FFA000' }]}>24</Text>
          </View>
          <View style={styles.dayInfoContainer}>
            <View style={styles.dayHeaderContainer}>
              <Text style={styles.dayName}>Tuesday</Text>
              <TouchableOpacity onPress={() => toggleExpand('Monday')}>
                <Ionicons name="chevron-down" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>08:00 - 16:02</Text>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>13:00 - 13:30</Text>
            </View>
          </View>
        </View>

        {/* Timeline for Monday */}
        {expandedDay === 'Monday' && (
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />
            {renderTimelineItem('enter-outline', 'Check-in', '08:00')}
            {renderTimelineItem('restaurant-outline', 'Lunch-out', '08:00')}
            {renderTimelineItem('fast-food-outline', 'Lunch-in', '08:00')}
            {renderTimelineItem('exit-outline', 'Check-out', '08:00')}
          </View>
        )}

        {/* Friday Card */}
        <View style={styles.dayCard}>
          <View style={[styles.dateContainer, { backgroundColor: '#99bf71' }]}>
            <Text style={[styles.dateNumber, { color: '#72a534' }]}>25</Text>
          </View>
          <View style={styles.dayInfoContainer}>
            <View style={styles.dayHeaderContainer}>
              <Text style={styles.dayName}>Wednesday</Text>
              <TouchableOpacity onPress={() => toggleExpand('Friday')}>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>08:00 - 16:02</Text>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>13:00 - 13:35</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayCard}>
          <View style={[styles.dateContainer, { backgroundColor: '#f9ebc4' }]}>
            <Text style={[styles.dateNumber, { color: '#ad7c6e' }]}>26</Text>
          </View>
          <View style={styles.dayInfoContainer}>
            <View style={styles.dayHeaderContainer}>
              <Text style={styles.dayName}>Thursday</Text>
              <TouchableOpacity onPress={() => toggleExpand('Friday')}>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>08:00 - 16:02</Text>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>13:00 - 13:35</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayCard}>
          <View style={[styles.dateContainer, { backgroundColor: '#E88EA6' }]}>
            <Text style={[styles.dateNumber, { color: '#BF6DA1' }]}>27</Text>
          </View>
          <View style={styles.dayInfoContainer}>
            <View style={styles.dayHeaderContainer}>
              <Text style={styles.dayName}>Friday</Text>
              <TouchableOpacity onPress={() => toggleExpand('Friday')}>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>08:00 - 16:02</Text>
            </View>
            <View style={styles.timeRangeContainer}>
              <Ionicons name="time-outline" size={16} color="#999" />
              <Text style={styles.timeRange}>13:00 - 13:35</Text>
            </View>
          </View>
        </View>
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
    justifyContent:"cenrter",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginRight: 40, // To offset the back button and center the title
  },
  monthLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
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
});

export default TimelineScreen;