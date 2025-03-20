import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

const TermsAndConditions = ({ openTermsSheet, setTermsSheet, onClose}) => {
  const [accepted, setAccepted] = useState(false);
  const [token, setToken] = useState(null);
  const [traineeID, setTraineeID] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const ID = await AsyncStorage.getItem('traineeID');
//         const Token = await AsyncStorage.getItem('token');

//         setToken(Token);
//         setTraineeID(ID);
//       } catch (error) {
//         console.error("Error fetching user data", error);
//       }
//     };
//     fetchUserData();
//   }, []);



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openTermsSheet}
      onRequestClose={() => onClose()}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <View style={styles.indicator} />

              {/* Fixed Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Terms and Conditions</Text>
                <Text style={styles.subtitle}>
                  Please read and accept the terms and conditions to continue.
                </Text>
              </View>

              {/* Scrollable Content */}
              <ScrollView style={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                  By accessing or using the Time Management System application, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you may not access or use the application.
                </Text>

                <Text style={styles.sectionTitle}>2. User Registration</Text>
                <Text style={styles.paragraph}>
                  Users are required to register and maintain accurate, complete, and up-to-date information. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
                </Text>

                <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
                <Text style={styles.paragraph}>
                  Our Privacy Policy, which explains how we collect, use, and share information about you, is incorporated into these Terms and Conditions. By using our application, you consent to the processing of data as explained in our Privacy Policy.
                </Text>

                <Text style={styles.sectionTitle}>4. User Content</Text>
                <Text style={styles.paragraph}>
                  You retain ownership of any content you submit to the application. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display your content in connection with the services we provide.
                </Text>

                <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
                <Text style={styles.paragraph}>
                  Users are prohibited from engaging in any activity that interferes with or disrupts the application, servers, or networks connected to the application. Unauthorized access to any part of the application is strictly prohibited.
                </Text>

                <Text style={styles.sectionTitle}>6. Termination</Text>
                <Text style={styles.paragraph}>
                  We reserve the right to terminate or suspend your account and access to the application at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason.
                </Text>

                <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
                <Text style={styles.paragraph}>
                  We may modify these Terms and Conditions at any time. Your continued use of the application after any changes indicates your acceptance of the modified terms.
                </Text>

                <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </Text>

                <Text style={styles.sectionTitle}>9. Governing Law</Text>
                <Text style={styles.paragraph}>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which the company operates, without regard to its conflict of law provisions.
                </Text>

                <Text style={styles.sectionTitle}>10. Contact Information</Text>
                <Text style={styles.paragraph}>
                  If you have any questions about these Terms and Conditions, please contact us at support@timemanagementsystem.com.
                </Text>
                
                {/* Add some padding at the bottom for better scrolling */}
                <View style={styles.bottomPadding} />
              </ScrollView>

              {/* Fixed Footer with Accept Button */}
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => onClose()}
                >
                  <Text style={styles.acceptButtonText}>
                    I Accept the Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View>
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
    height: '80%',
    padding: 20,
    paddingTop: 10,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 15,
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
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F3B4C',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  bottomPadding: {
    height: 20,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#8BC34A',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TermsAndConditions;