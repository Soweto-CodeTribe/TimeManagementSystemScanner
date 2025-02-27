// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // Async Thunk for login
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password, keepSignedIn }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
//         { email, password }
//       );
//       const data = response.data;

//       if (keepSignedIn) {
//         await AsyncStorage.setItem("email", email);
//         await AsyncStorage.setItem("keepSignedIn", "true");
//       } else {
//         await AsyncStorage.removeItem("email");
//         await AsyncStorage.removeItem("keepSignedIn");
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       AsyncStorage.removeItem("email");
//       AsyncStorage.removeItem("keepSignedIn");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.traineeId;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Base URL for API calls
const BASE_URL = "https://timemanagementsystemserver.onrender.com/api";

// Helper function to get stored check-in data
export const getStoredCheckInData = async () => {
  try {
    const storedData = await AsyncStorage.getItem("CheckInData");
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error fetching stored Check-In Data:", error);
    return null;
  }
};

// Helper function for check-in

export const checkInUser = async (traineeId, name, token) => {
  try {
    console.log("Attempting check-in with:", { traineeId, name });
    
    const response = await axios.post(
      `${BASE_URL}/session/check-in`,
      { traineeId:traineeId, name:name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const checkInData = response.data;
      
      // Store Check-In Data in AsyncStorage
      await AsyncStorage.setItem("CheckInData", JSON.stringify(checkInData));
      console.log("Check-in successful, data saved to storage");
      
      return checkInData;
    } else {
      console.error("Check-in failed with status:", response.status);
      throw new Error("Check-in failed");
    }
  } catch (error) {
    console.error("Check-in Error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Check-in failed");
  }
};

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, keepSignedIn }, { rejectWithValue }) => {
    try {
      // Login API Call
      const response = await axios.post(
        `${BASE_URL}/auth/loginT`,
        { email, password }
      );
      const data = response.data;

      // Save login details if 'Keep Signed In' is enabled
      if (keepSignedIn) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("keepSignedIn", "true");
        
        // Optionally store password securely (consider using a secure storage solution in production)
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("keepSignedIn");
        await AsyncStorage.removeItem("password");
      }

      // Store token for future use
      await AsyncStorage.setItem("authToken", data.token);
      
      return data;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk for retrieving check-in data
export const fetchCheckInData = createAsyncThunk(
  "auth/fetchCheckInData",
  async ({ traineeId, name, token }, { rejectWithValue }) => {
    try {
      // First try to get stored check-in data
      let checkInData = await getStoredCheckInData();
      
      // If no stored check-in data, perform check-in
      if (!checkInData) {
        checkInData = await checkInUser(traineeId, name, token);
      }
      
      return checkInData;
    } catch (error) {
      console.error("Fetch Check-In Error:", error);
      return rejectWithValue(error.message || "Failed to fetch check-in data");
    }
  }
);

// Load stored credentials
export const loadStoredCredentials = createAsyncThunk(
  "auth/loadStoredCredentials",
  async (_, { rejectWithValue }) => {
    try {
      const keepSignedIn = await AsyncStorage.getItem("keepSignedIn");
      
      if (keepSignedIn === "true") {
        const email = await AsyncStorage.getItem("email");
        const token = await AsyncStorage.getItem("authToken");
        const checkInDataString = await AsyncStorage.getItem("CheckInData");
        const checkInData = checkInDataString ? JSON.parse(checkInDataString) : null;
        
        return { 
          email, 
          token,
          checkInData,
          isKeptSignedIn: true
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error loading stored credentials:", error);
      return rejectWithValue("Failed to load stored credentials");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userName: null,
    token: null,
    checkInData: null,
    isLoading: false,
    isFetchingCheckIn: false,
    error: null,
    checkInError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userName = null;
      state.token = null;
      state.checkInData = null;
      state.error = null;
      state.checkInError = null;

      // Clear AsyncStorage asynchronously
      AsyncStorage.multiRemove([
        "email",
        "keepSignedIn",
        "authToken",
        "CheckInData",
        "password", // Also clear password
      ])
        .then(() => console.log("User logged out and storage cleared"))
        .catch((err) => console.error("Error clearing storage:", err));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.traineeId;
        state.userName = action.payload.name;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch check-in data cases
      .addCase(fetchCheckInData.pending, (state) => {
        state.isFetchingCheckIn = true;
        state.checkInError = null;
      })
      .addCase(fetchCheckInData.fulfilled, (state, action) => {
        state.isFetchingCheckIn = false;
        state.checkInData = action.payload;
        state.checkInError = null;
      })
      .addCase(fetchCheckInData.rejected, (state, action) => {
        state.isFetchingCheckIn = false;
        state.checkInError = action.payload;
      })
      
      // Load stored credentials cases
      .addCase(loadStoredCredentials.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.checkInData = action.payload.checkInData;
          
          // If check-in data exists, extract user ID from it
          if (action.payload.checkInData && action.payload.checkInData.traineeId) {
            state.user = action.payload.checkInData.traineeId;
          }
          
          // If check-in data exists, extract user name from it
          if (action.payload.checkInData && action.payload.checkInData.name) {
            state.userName = action.payload.checkInData.name;
          }
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;