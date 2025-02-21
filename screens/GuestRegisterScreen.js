import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuestRegisterScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Guest Register Screen</Text>
    </View>
  );
};

export default GuestRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
