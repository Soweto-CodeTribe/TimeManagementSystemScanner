import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import { Platform } from 'react-native';

// Async thunk for verifying QR code
export const verifyQRCode = createAsyncThunk(
  'scan/verifyQRCode',
  async (qrId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/QR/verify-QRcode",
        { qrId }
      );
      
      if (response.data.success) {
        await AsyncStorage.setItem("inLocationAndVerified", "true");
        return qrId;
      } else {
        return rejectWithValue('Invalid QR code');
      }
    } catch (error) {
      console.error("QR Code Verification Error:", error.response?.data || error);
      return rejectWithValue(error.response?.data?.message || 'Failed to verify QR code');
    }
  }
);

// Async thunk for capturing location after successful scan
export const captureLocation = createAsyncThunk(
  'scan/captureLocation',
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        return rejectWithValue('Location permission denied');
      }
      
      if (Platform.OS === "android") {
        const isAvailable = await Location.hasServicesEnabledAsync();
        if (!isAvailable) {
          return rejectWithValue('Location services are not available on this device');
        }
      }
      
      const loc = await Location.getCurrentPositionAsync({
        enableHighAccuracy: false,
      });
      
      const checkIn = Date.now();
      const location = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      
      // Save to local storage
      const checkInData = {
        checkInTime: checkIn,
        location,
      };
      
      await AsyncStorage.setItem("checkInData", JSON.stringify(checkInData));
      
      return checkInData;
    } catch (error) {
      console.error("Location Error:", error);
      return rejectWithValue(error.message || 'Could not get location');
    }
  }
);

const initialState = {
  scanned: false,
  loading: false,
  error: null,
  isBottomSheetVisible: false,
  checkInData: null,
  verifiedQRCode: null
};

const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    resetScan: (state) => {
      state.scanned = false;
      state.error = null;
    },
    setBottomSheetVisible: (state, action) => {
      state.isBottomSheetVisible = action.payload;
    },
    clearCheckInData: (state) => {
      state.checkInData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle QR verification
      .addCase(verifyQRCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyQRCode.fulfilled, (state, action) => {
        state.loading = false;
        state.scanned = true;
        state.verifiedQRCode = action.payload;
      })
      .addCase(verifyQRCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.scanned = false;
      })
      
      // Handle location capture
      .addCase(captureLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(captureLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.checkInData = action.payload;
        state.isBottomSheetVisible = true;
      })
      .addCase(captureLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetScan, setBottomSheetVisible, clearCheckInData } = scanSlice.actions;

export default scanSlice.reducer;