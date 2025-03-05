import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

const FeedbackBottomSheet = ({setOpenFeedbackSheet, openFeedbacksheet}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openFeedbacksheet}
      onRequestClose={() => setOpenFeedbackSheet(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpenFeedbackSheet(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <View style={styles.indicator} />
              
              <Text style={styles.title}>Send Feedback</Text>
              
              <Text style={styles.subtitle}>
                Provide feedback about the app so we can improve on user experience
              </Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Message"
                  placeholderTextColor="#BBBBBB"
                  multiline={true}
                  numberOfLines={6}
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F3B4C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7A8A97',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    padding: 15,
    height: 180,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8BC34A',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeedbackBottomSheet;