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

// Async Thunk for login and check-in
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, keepSignedIn }, { rejectWithValue }) => {
    try {
      // Login API Call
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
        { email, password }
      );
      const data = response.data;

      // Save login details if 'Keep Signed In' is enabled
      if (keepSignedIn) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("keepSignedIn", "true");
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("keepSignedIn");
      }

      // Perform Check-In after successful login
      const checkInData = await checkInUser(data.traineeId, data.name);

      return { ...data, checkInData };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async function for Check-In
const checkInUser = async (traineeId, name) => {
  try {
    const response = await axios.post(
      "https://timemanagementsystemserver.onrender.com/api/session/check-in",
      { traineeId, name }
    );

    if (response.status === 200) {
      const checkInData = response.data;

      // Store Check-In Data in AsyncStorage
      await AsyncStorage.setItem("CheckInData", JSON.stringify(checkInData));

      return checkInData;
    } else {
      throw new Error("Check-in failed");
    }
  } catch (error) {
    console.error("Check-in Error:", error.response?.data || error);
    return null; // Return null if check-in fails
  }
};

// Async function to get Check-In Data from AsyncStorage
export const getCheckInData = createAsyncThunk(
  "auth/getCheckInData",
  async (_, { rejectWithValue }) => {
    try {
      const storedData = await AsyncStorage.getItem("CheckInData");
      return storedData ? JSON.parse(storedData) : null;
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
    checkInData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.checkInData = null;
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("keepSignedIn");
      AsyncStorage.removeItem("CheckInData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.traineeId;
        state.token = action.payload.token;
        state.checkInData = action.payload.checkInData;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getCheckInData.fulfilled, (state, action) => {
        state.checkInData = action.payload;
      })
      .addCase(getCheckInData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
