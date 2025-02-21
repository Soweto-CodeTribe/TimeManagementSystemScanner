import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PasswordEmailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Password Email Screen</Text>
    </View>
  );
};

export default PasswordEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
