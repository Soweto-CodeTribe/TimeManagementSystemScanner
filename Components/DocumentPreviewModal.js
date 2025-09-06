import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  Pressable,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator 
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const DocumentPreviewModal = ({ 
  document, 
  onClose, 
  accessToken // Pass the access token as a prop
}) => {
  const [documentData, setDocumentData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://codetribe-admin.mlab.co.za/assets/${document.documentUrl}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }

        // For images, we'll get the raw data
        // For other documents, we might need to handle differently based on content type
        const contentType = response.headers.get('content-type');
        
        if (contentType.startsWith('image/')) {
          // If it's an image, we'll use the direct URL
          setDocumentData({
            type: 'image',
            uri: `https://codetribe-admin.mlab.co.za/assets/${document.documentUrl}`
          });
        } else {
          // For other document types
          setDocumentData({
            type: 'document',
            uri: `https://docs.google.com/gview?embedded=true&url=https://codetribe-admin.mlab.co.za/assets/${document.documentUrl}`
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [document.documentUrl, accessToken]);

  const renderDocumentPreview = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator 
            size="large" 
            color="#053742" 
            style={styles.loader}
          />
          <Text style={styles.loadingText}>
            Loading Document...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedText}>
            Error Loading Document
          </Text>
          <Text style={styles.fileDetailsText}>
            {error}
          </Text>
        </View>
      );
    }

    if (!documentData) {
      return (
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedText}>
            No Document Available
          </Text>
        </View>
      );
    }

    if (documentData.type === 'image') {
      return (
        <Image
          source={{ uri: documentData.uri }}
          style={styles.imagePreview}
          resizeMode="contain"
        />
      );
    }

    return (
      <WebView
        source={{ uri: documentData.uri }}
        style={styles.webview}
        scalesPageToFit={true}
        resizeMode="contain"
      />
    );
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText} numberOfLines={1}>
            {document.reason} - {document.date}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
        
        <View style={styles.documentPreviewContainer}>
          {renderDocumentPreview()}
        </View>
        
        {/* Status Information */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Status: {document.status?.toUpperCase() || 'PENDING'}
          </Text>
          {document.reviewNotes && (
            <Text style={styles.reviewNotesText}>
              Review Notes: {document.reviewNotes}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#053742',
    marginRight: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#E8F5FF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#053742',
    fontWeight: '600',
  },
  documentPreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  webview: {
    width: width - 30,
    height: height * 0.7,
  },
  imagePreview: {
    width: width - 30,
    height: height * 0.7,
  },
  unsupportedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unsupportedText: {
    fontSize: 18,
    color: '#053742',
    marginBottom: 10,
  },
  fileDetailsText: {
    fontSize: 14,
    color: '#7C808D',
    textAlign: 'center',
  },
  statusContainer: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#053742',
    marginBottom: 5,
  },
  reviewNotesText: {
    fontSize: 12,
    color: '#7C808D',
    fontStyle: 'italic',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 30,
    height: height * 0.7,
  },
  loader: {
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#053742',
    fontWeight: '500',
  },
});

export default DocumentPreviewModal;