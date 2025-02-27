import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, keepSignedIn }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
        { email, password }
      );

      const data = response.data;

      console.log("Login Response Data:", data);
      console.log("Token:", data.token);

      if (!data.token) throw new Error("No token received");

      // Extract traineeID from user data - fixed property name
      const traineeID = data.trainee?.traineeId?.toString();
      const name = data.trainee?.name;
      console.log("Trainee ID:", traineeID);

      if (keepSignedIn) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("keepSignedIn", "true");
        if (traineeID) {
          await AsyncStorage.setItem("traineeID", traineeID);
        }
        if (name) {
          await AsyncStorage.setItem("name", name);
        }
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("keepSignedIn");
        await AsyncStorage.removeItem("traineeID");
        await AsyncStorage.removeItem("name");
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
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    traineeID: null, // Add traineeID state
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.traineeID = null; // Clear traineeID on logout
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("keepSignedIn");
      AsyncStorage.removeItem("traineeID");
      AsyncStorage.removeItem("name");
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
        state.token = action.payload.token;
        state.traineeID = action.payload.traineeID; // Store traineeID in state

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
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        const traineeID = action.payload.trainee?.traineeId?.toString();
        state.traineeID = traineeID || state.traineeID; // Update traineeID if available
        console.log("Updated Redux State - User:", state.user);
        console.log("Updated Redux State - Trainee ID:", state.traineeID);
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;