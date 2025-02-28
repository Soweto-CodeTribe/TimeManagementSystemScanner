import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Alert } from 'react-native';
import Toast from "react-native-toast-message";

const API_URL = 'https://timemanagementsystemserver.onrender.com/api/session';

// Async thunks for API calls
export const startLunch = createAsyncThunk(
  'checkInOut/startLunch',
  async ({ traineeId, token }, { rejectWithValue }) => {
    try {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const time = `${hours}:${minutes} ${ampm}`;

      const response = await axios.post(
        `${API_URL}/lunch-start`,
        { 
          traineeId, 
          lunchStartTime: time 
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      Toast.show({
        type: "success",
        text1: "Scanned Successfully",
        text2: "Checked in Successfully for Lunch",
        position: "top",
      });

      return { ...response.data, lunchStartTime: time };
    } catch (error) {
      console.error("Lunch check-in error", error);
      Alert.alert("Error", "Failed to check in for lunch");
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

export const endLunch = createAsyncThunk(
  'checkInOut/endLunch',
  async ({ traineeId, token }, { rejectWithValue }) => {
    try {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const time = `${hours}:${minutes} ${ampm}`;

      const response = await axios.post(
        `${API_URL}/lunch-end`,
        { 
          traineeId, 
          lunchEndTime: time 
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      Toast.show({
        type: "success",
        text1: "Scanned Successfully",
        text2: "Checked out Successfully from Lunch",
        position: "top",
      });

      return { ...response.data, lunchEndTime: time };
    } catch (error) {
      console.error("Lunch check-out error", error);
      Alert.alert("Error", "Failed to check out from lunch");
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

export const checkOut = createAsyncThunk(
  'checkInOut/checkOut',
  async ({ traineeId, token }, { rejectWithValue }) => {
    try {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const time = `${hours}:${minutes} ${ampm}`;

      const response = await axios.post(
        `${API_URL}/check-out`,
        { 
          traineeId, 
          checkOutTime: time 
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      Toast.show({
        type: "success",
        text1: "Scanned Successfully",
        text2: "Checked Out Successfully",
        position: "top",
      });

      return { ...response.data, checkOutTime: time };
    } catch (error) {
      console.error("Check-out error", error);
      Alert.alert("Error", "Failed to check out");
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

const checkInOutSlice = createSlice({
  name: 'checkInOut',
  initialState: {
    lunchStatus: 'notStarted', // 'notStarted', 'checkedIn', 'checkedOut'
    dayStatus: 'checkedIn', // 'notCheckedIn', 'checkedIn', 'checkedOut'
    lunchStartTime: null,
    lunchEndTime: null,
    checkOutTime: null,
    loading: false,
    error: null,
    lastAction: null
  },
  reducers: {
    resetLunchStatus: (state) => {
      state.lunchStatus = 'notStarted';
      state.lunchStartTime = null;
      state.lunchEndTime = null;
    },
    resetDayStatus: (state) => {
      state.dayStatus = 'notCheckedIn';
      state.checkOutTime = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Lunch
      .addCase(startLunch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'startLunch';
      })
      .addCase(startLunch.fulfilled, (state, action) => {
        state.loading = false;
        state.lunchStatus = 'checkedIn';
        state.lunchStartTime = action.payload.lunchStartTime;
      })
      .addCase(startLunch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to check in for lunch';
      })
      
      // End Lunch
      .addCase(endLunch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'endLunch';
      })
      .addCase(endLunch.fulfilled, (state, action) => {
        state.loading = false;
        state.lunchStatus = 'checkedOut';
        state.lunchEndTime = action.payload.lunchEndTime;
      })
      .addCase(endLunch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to check out from lunch';
      })
      
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'checkOut';
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.dayStatus = 'checkedOut';
        state.checkOutTime = action.payload.checkOutTime;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to check out';
      });
  }
});

export const { resetLunchStatus, resetDayStatus, clearError } = checkInOutSlice.actions;
export default checkInOutSlice.reducer;