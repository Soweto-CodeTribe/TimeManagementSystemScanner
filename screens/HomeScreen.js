import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, SafeAreaView, Dimensions, Alert, StatusBar } from "react-native";
import { BarChart } from "react-native-chart-kit";
import DocumentsUpload from "../Components/DocumentsUpload";
// import axios from "axios";


const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState("Eks");
  const [activeStats, setActiveStats] = useState("monthly");
  const [isDayMissed, setIsDayMissed ] = useState(true)

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{
      data: [65, 45, 75, 55, 70]
    }]
  };

  const renderStatsCard = (percentage, title, subtitle, days) => (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.percentage}>{percentage}%</Text>
        <View style={styles.trendIndicator}>
          <Text style={styles.trendText}>↗</Text>
        </View>
      </View>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsSubtitle}>{subtitle}</Text>
      <Text style={styles.statsDays}>{days} Days</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#7C808D'}/>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hi, {name}! 👋</Text>
            <Text style={styles.welcomeBack}>Welcome Back!</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={()=> Alert.alert("Notifications Screen will show when developed")} style={styles.iconButton}>
              <Text>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> Alert.alert("Profile Screen will show when developed")} style={styles.iconButton}>
              <Text>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Attendance</Text>
          <BarChart
            data={weeklyData}
            width={Dimensions.get("window").width - 80}
            height={160}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              barPercentage: 0.5,
              style: {
                borderRadius: 16
              }
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
            withInnerLines={false}
            withHorizontalLabels={false}
          />
        </View>
      </View>

      <View style={styles.statsToggle}>
        <Text style={styles.overviewText}>Overview Stats</Text>
        <View style={styles.toggleButtons}>
          <TouchableOpacity 
            style={[styles.toggleButton, activeStats === "monthly" && styles.activeToggle]}
            onPress={() => setActiveStats("monthly")}
          >
            <Text style={[styles.toggleText, activeStats === "monthly" && styles.activeText]}>
              Monthly Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, activeStats === "yearly" && styles.activeToggle]}
            onPress={() => setActiveStats("yearly")}
          >
            <Text style={[styles.toggleText, activeStats === "yearly" && styles.activeTexrt]}>
              Yearly Stats
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isDayMissed && <DocumentsUpload isVisible={isDayMissed} onClose={() => setIsDayMissed(false)} />}

      <View style={styles.statsGrid}>
        {activeStats === "monthly" ? (
          <>
            {renderStatsCard(85, "February", "Your daily attendance rate", "15-20")}
            {renderStatsCard(92, "February", "Your daily attendance rate", "20-25")}
            {renderStatsCard(78, "February", "Your daily attendance rate", "12-15")}
            {renderStatsCard(88, "February", "Your daily attendance rate", "18-22")}
          </>
        ) : (
          <>
            {renderStatsCard(90, "2024-2025", "Yearly attendance rate", "280-300")}
            {renderStatsCard(87, "2024-2025", "Yearly attendance rate", "265-285")}
            {renderStatsCard(93, "2024-2025", "Yearly attendance rate", "290-310")}
            {renderStatsCard(89, "2024-2025", "Yearly attendance rate", "270-290")}
          </>
        )}
      </View>

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => navigation.navigate('ScannerScreen')}
      >
        <Text style={styles.scanButtonText}>Let's scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  safeArea: {
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "column",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#7c808d",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 3,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  welcomeBack: {
    fontSize: 10,
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    alignSelf: 'center',
    shadowRadius: 2,
    elevation: 2,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -15,
  },
  statsToggle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  overviewText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
  },
  toggleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderColor: '#7c808d',
    borderWidth: 1,
    backgroundColor: "#f8f9fa",
  },
  activeToggle: {
    backgroundColor: "#7c808d",
  },
  toggleText: {
    color: "#7f8c8d",
    fontWeight: "500",
    fontSize: 12
  },
  activeText: {
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
    justifyContent: "space-between",
  },
  statsCard: {
    backgroundColor: "#8ac05233",
    padding: 15,
    borderRadius: 20,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#00000015"
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  percentage: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  trendIndicator: {
    padding: 4,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  trendText: {
    color: "#4CAF50",
    fontSize: 15,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  statsDays: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  scanButton: {
    backgroundColor: "#4CAF50",
    margin: 16,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;