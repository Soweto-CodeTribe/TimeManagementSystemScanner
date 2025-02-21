import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuestEmailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Guest Email Screen</Text>
    </View>
  );
};

export default GuestEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
