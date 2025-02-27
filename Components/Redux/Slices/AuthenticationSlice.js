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

      console.log("🔹 Login Response Data:", data); // Log full response data
      console.log("🔹 Token:", data.token);

      if (!data.token) throw new Error("No token received");

      if (keepSignedIn) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("keepSignedIn", "true");
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("keepSignedIn");
      }

      return data;
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

      console.log("🔹 Fetched User Data from Firebase:", userData); // Log fetched user data
      await AsyncStorage.setItem("user", JSON.stringify(userData));

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
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("keepSignedIn");
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

        console.log(" Token after Login:", action.payload.token);
        console.log(" User Response Data:", action.payload);

        if (action.payload.user) {
          state.user = action.payload.user;
          console.log(" Stored User in Redux:", state.user);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log(" Updated Redux State - User:", state.user);
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
