import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TraineeLoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Trainee Login Screen</Text>
    </View>
  );
};

export default TraineeLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
