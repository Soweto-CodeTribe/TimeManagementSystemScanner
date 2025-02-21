import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ForgetPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Forget Password Screen</Text>
    </View>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
