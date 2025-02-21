import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GetStartedScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Get Started Screen</Text>
    </View>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
