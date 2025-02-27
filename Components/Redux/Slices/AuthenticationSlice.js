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

// Helper function to get current time in format "HH:MM AM/PM"
const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

// Helper function to get current date in format "YYYY-MM-DD"
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Async Thunk for check-in
export const checkIn = createAsyncThunk(
  "auth/checkIn",
  async ({ traineeId, name, location = "Office" }, { rejectWithValue }) => {
    try {
      const checkInTime = getCurrentTime();
      const date = getCurrentDate();

      const checkInData = {
        checkInTime,
        location,
        date
      };

      console.log("Sending check-in data:", { traineeId, name, ...checkInData });

      // Fix: Correct API payload structure
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/session/check-in",
        { 
          traineeId, 
          name, 
          location:"Office", 
          checkInTime  // Changed from checkIn to checkInTime
        },
        {
          headers: { 
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
          }
        }
      );
      
      console.log("Check-in response:", response.data);

      // Store check-in data in AsyncStorage
      await AsyncStorage.setItem("checkInData", JSON.stringify(checkInData));

      return { ...response.data, checkInData };
    } catch (error) {
      console.error("Check-in error:", error);
      return rejectWithValue(error.response?.data?.message || "Check-in failed");
    }
  }
);

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, keepSignedIn }, { dispatch, rejectWithValue }) => {
    try {
      // Login API Call
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
        { email, password }
      );
      const data = response.data;

      console.log("Login Response Data:", data);
      console.log("Token:", data.token);

      if (!data.token) throw new Error("No token received");

      // Extract trainee details from user data
      const traineeID = data.trainee?.traineeId?.toString();
      const name = data.trainee?.name;
      console.log("Trainee ID:", traineeID);

      if (keepSignedIn) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("keepSignedIn", "true");
        if (traineeID) {
          await AsyncStorage.setItem("traineeID", traineeID);
        }
        if (name) {
          await AsyncStorage.setItem("name", name);
        }
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("keepSignedIn");
        await AsyncStorage.removeItem("traineeID");
        await AsyncStorage.removeItem("name");
      }

      // Automatically check-in after successful login if traineeID and name are available
      if (traineeID && name) {
        try {
          await dispatch(checkIn({ traineeId: traineeID, name }));
          console.log("Automatic check-in successful");
        } catch (checkInError) {
          console.error("Automatic check-in failed:", checkInError);
          // Continue with login even if check-in fails
        }
      }

      return { ...data, traineeID };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk to fetch user data using token
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        "https://timemanagementsystemserver.onrender.com/api/auth/getUser",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = response.data;

      console.log("Fetched User Data:", userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      // Store traineeID if available
      const traineeID = userData.trainee?.traineeId?.toString();
      if (traineeID) {
        await AsyncStorage.setItem("traineeID", traineeID);
      }

      return userData;
    } catch (error) {
      return rejectWithValue("Failed to fetch check-in data");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    traineeID: null,
    checkInData: null,
    isLoading: false,
    isCheckingIn: false,
    error: null,
    checkInError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.traineeID = null;
      state.checkInData = null;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("keepSignedIn");
      AsyncStorage.removeItem("traineeID");
      AsyncStorage.removeItem("name");
      AsyncStorage.removeItem("checkInData");
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
        state.token = action.payload.token;
        state.traineeID = action.payload.traineeID;

        console.log("Token after Login:", action.payload.token);
        console.log("Trainee ID after Login:", action.payload.traineeID);

        if (action.payload.user) {
          state.user = action.payload.user;
          console.log("Stored User in Redux:", state.user);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Check-in cases
      .addCase(checkIn.pending, (state) => {
        state.isCheckingIn = true;
        state.checkInError = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isCheckingIn = false;
        state.checkInData = action.payload.checkInData;
        console.log("Check-in data stored in Redux:", state.checkInData);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isCheckingIn = false;
        state.checkInError = action.payload;
      })
      
      // Fetch user data cases
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        const traineeID = action.payload.trainee?.traineeId?.toString();
        state.traineeID = traineeID || state.traineeID;
        console.log("Updated Redux State - User:", state.user);
        console.log("Updated Redux State - Trainee ID:", state.traineeID);
      })
      .addCase(getCheckInData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;