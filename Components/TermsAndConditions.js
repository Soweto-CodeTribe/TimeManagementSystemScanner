import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback,
  Platform,
  StatusBar 
} from 'react-native';

const TermsAndConditions = ({ openTermsSheet, onClose }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openTermsSheet}
      onRequestClose={() => onClose()}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => onClose()}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
        
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
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
            bounces={true}
            overScrollMode="auto"
            nestedScrollEnabled={true}
          >
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
          </ScrollView>

          {/* Fixed Footer with Accept Button */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => onClose()}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptButtonText}>
                I Accept the Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    marginBottom: 10,
  },
  scrollContentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F3B4C',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  acceptButton: {
    backgroundColor: '#8BC34A',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TermsAndConditions;