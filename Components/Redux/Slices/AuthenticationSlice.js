// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // Helper function to get current time in format "HH:MM AM/PM"
// const getCurrentTime = () => {
//   const now = new Date();
//   let hours = now.getHours();
//   const minutes = now.getMinutes().toString().padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   return `${hours}:${minutes} ${ampm}`;
//   // ${ampm}
// };

// // Helper function to get current date in format "YYYY-MM-DD"
// const getCurrentDate = () => {
//   return new Date().toISOString().split('T')[0];
// };

// // Async Thunk for check-in
// export const checkIn = createAsyncThunk(
//   "auth/checkIn",
//   async ({ traineeId, name, location = "Office" }, { rejectWithValue }) => {
//     try {
//       const checkInTime = getCurrentTime();
//       const date = getCurrentDate();

//       const checkInData = {
//         checkInTime,
//         location,
//         date
//       };

//       console.log("Sending check-in data:", { traineeId, name, ...checkInData });

//       // Fix: Correct API payload structure
//       const response = await axios.post(
//         "https://timemanagementsystemserver.onrender.com/api/session/check-in",
//         { 
//           traineeId, 
//           name, 
//           location:"Office", 
//           checkInTime  // Changed from checkIn to checkInTime
//         },
//         {
//           headers: { 
//             Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
//           }
//         }
//       );
      
//       console.log("Check-in response:", response.data);

//       // Store check-in data in AsyncStorage
//       await AsyncStorage.setItem("checkInData", JSON.stringify(checkInData));

//       return { ...response.data, checkInData };
//     } catch (error) {
//       console.error("Check-in error:", error);
//       return rejectWithValue(error.response?.data?.message || "Check-in failed");
//     }
//   }
// );

// // Async Thunk for login
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password, keepSignedIn }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
//         { email, password }
//       );

//       const data = response.data;

//       console.log("Login Response Data:", data);
//       console.log("Token:", data.token);
//       console.log("Location",data.location);
//       if (!data.token) throw new Error("No token received");

//       // Extract trainee details from user data
//       const traineeID = data.trainee?.traineeId?.toString();
//       const name = data.trainee?.name || data.trainee?.fullName;
//       const cellphone = data.trainee?.phoneNumber;
//       const idNumber = data.trainee?.idNumber;
//       const location = data.trainee?.location;
//       const surname =data.trainee?.surname;
      

//       console.log("Name:", name);
//       console.log("Surname:",surname);
//       console.log("Trainee ID:", traineeID);
//       console.log("Cell Phone: ",cellphone);
//       console.log("ID Number: ",idNumber);
//       console.log("Location: ", location);
      

//       if (keepSignedIn) {
//         await AsyncStorage.setItem("token", data.token);
//         await AsyncStorage.setItem("email", email);
//         await AsyncStorage.setItem("keepSignedIn", "true");
//         if (traineeID) {
//           await AsyncStorage.setItem("traineeID", traineeID);
//         }
//         if (name) {
//           await AsyncStorage.setItem("name", name);
//         }
//         if(surname){
//           await AsyncStorage.setItem("Surname",surname)
//         }
//         if(cellphone){
//           await AsyncStorage.setItem("cellphone", cellphone);
//         }
//         if(idNumber){
//           await AsyncStorage.setItem("ID Number",idNumber);
//         }
//         if(location){
//           await AsyncStorage.setItem("Location",location)
//         }
        

//       } else {
//         await AsyncStorage.removeItem("token");
//         await AsyncStorage.removeItem("email");
//         await AsyncStorage.removeItem("keepSignedIn");
//         await AsyncStorage.removeItem("traineeID");
//         await AsyncStorage.removeItem("name");
//       }

//       // Automatically check-in after successful login if traineeID and name are available
//       if (traineeID && name) {
//         try {
//           await dispatch(checkIn({ traineeId: traineeID, name }));
//           console.log("Automatic check-in successful");
//         } catch (checkInError) {
//           console.error("Automatic check-in failed:", checkInError);
//           // Continue with login even if check-in fails
//         }
//       }

//       return { ...data, traineeID };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// // Async Thunk to fetch user data using token
// export const fetchUserData = createAsyncThunk(
//   "auth/fetchUserData",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { token } = getState().auth;
//       if (!token) throw new Error("No token found");

//       const response = await axios.get(
//         "https://timemanagementsystemserver.onrender.com/api/auth/getUser",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const userData = response.data;

//       console.log("Fetched User Data:", userData);
//       await AsyncStorage.setItem("user", JSON.stringify(userData));

//       await AsyncStorage.setItem("cell Number", data.trainee.phoneNumber);
//       await AsyncStorage.setItem("email", data.trainee.email);
//       await AsyncStorage.setItem("id Number", data.trainee.idNumber);
//       await AsyncStorage.setItem("Location", data.trainee.location);

//       console.log("cell Number", data.trainee.phoneNumber);
//       console.log("email", data.trainee.email);
//       console.log("id Number", data.trainee.idNumber);
//       console.log("Location", data.trainee.location);

//       // Store traineeID if available
//       const traineeID = userData.trainee?.traineeId?.toString();
//       if (traineeID) {
//         await AsyncStorage.setItem("traineeID", traineeID);
//       }

//       return userData;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     traineeID: null,
//     email:null,
//     checkInData: null,
//     isLoading: false,
//     isCheckingIn: false,
//     error: null,
//     checkInError: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.traineeID = null;
//       state.email=null;
//       state.checkInData = null;
//       AsyncStorage.removeItem("token");
//       AsyncStorage.removeItem("user");
//       AsyncStorage.removeItem("email");
//       AsyncStorage.removeItem("keepSignedIn");
//       AsyncStorage.removeItem("traineeID");
//       AsyncStorage.removeItem("name");
//       AsyncStorage.removeItem("checkInData");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login cases
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.token = action.payload.token;
//         state.traineeID = action.payload.traineeID;
       
//         console.log("Token after Login:", action.payload.token);
//         console.log("Trainee ID after Login:", action.payload.traineeID);
    

//         if (action.payload.user) {
//           state.user = action.payload.user;
//           console.log("Stored User in Redux:", state.user);
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
      
//       // Check-in cases
//       .addCase(checkIn.pending, (state) => {
//         state.isCheckingIn = true;
//         state.checkInError = null;
//       })
//       .addCase(checkIn.fulfilled, (state, action) => {
//         state.isCheckingIn = false;
//         state.checkInData = action.payload.checkInData;
//         console.log("Check-in data stored in Redux:", state.checkInData);
//       })
//       .addCase(checkIn.rejected, (state, action) => {
//         state.isCheckingIn = false;
//         state.checkInError = action.payload;
//       })
      
//       // Fetch user data cases
//       .addCase(fetchUserData.fulfilled, (state, action) => {
//         state.user = action.payload;
//         const traineeID = action.payload.trainee?.traineeId?.toString();
//         const email=action.payload?.email;
//         state.traineeID = traineeID || state.traineeID;
     

//         console.log("Updated Redux State - User:", state.user);
//         console.log("Updated Redux State - Trainee ID:", state.traineeID);
   

//       })
//       .addCase(fetchUserData.rejected, (state, action) => {
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
      // Get token and verify it exists
      const token = await AsyncStorage.getItem("token");
      const location = await AsyncStorage.getItem("Location");
      console.log(location);
      console.log("Token in check-in:", token);
      if (!token) throw new Error("No authentication token available");
      
      const checkInTime = getCurrentTime();
      const date = getCurrentDate();

      const checkInData = {
        checkInTime,
        location,
        date
      };

      console.log("Sending check-in data:", { traineeId, name, ...checkInData });

      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/session/check-in",
        { 
          traineeId, 
          name, 
          location, 
          checkInTime
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Check-in response:", response.data);

      // Store check-in data in AsyncStorage
      await AsyncStorage.setItem("checkInData", JSON.stringify(checkInData));

      return { ...response.data, checkInData };
    } catch (error) {
      console.error("Check-in error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "Check-in failed");
    }
  }
);

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, keepSignedIn }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://timemanagementsystemserver.onrender.com/api/auth/loginT",
        { email, password }
      );

      const data = response.data;

      console.log("Login Response Data:", data);
      console.log("Token:", data.token);
      console.log("Location:", data.location);
      
      if (!data.token) throw new Error("No token received");

      // Extract trainee details from user data
      const token = data.token;
      const traineeID = data.trainee?.traineeId?.toString();
      const name = data.trainee?.name || data.trainee?.fullName;
      const cellphone = data.trainee?.phoneNumber;
      const idNumber = data.trainee?.idNumber;
      const location = data.trainee?.location;
      const surname = data.trainee?.surname;
      
      // Always store essential authentication data regardless of keepSignedIn
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("traineeID", traineeID || "");
      await AsyncStorage.setItem("name", name || "");
      await AsyncStorage.setItem("email", email);
      
      // Store additional user info
      if (surname) await AsyncStorage.setItem("Surname", surname);
      if (cellphone) await AsyncStorage.setItem("cellphone", cellphone);
      if (idNumber) await AsyncStorage.setItem("idNumber", idNumber);
      if (location) await AsyncStorage.setItem("Location", location);

      console.log("Name:", name);
      console.log("Surname:", surname);
      console.log("Trainee ID:", traineeID);
      console.log("Cell Phone: ", cellphone);
      console.log("ID Number: ", idNumber);
      console.log("Location: ", location);
      
      // Handle keepSignedIn flag
      if (keepSignedIn) {
        await AsyncStorage.setItem("keepSignedIn", "true");
      } else {
        // If not keeping signed in, we'll still be authenticated for this session,
        // but will clear the flag so app startup won't auto-login next time
        await AsyncStorage.removeItem("keepSignedIn");
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

      return { ...data, traineeID, name };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// Async Thunk to fetch user data using token
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Try to get token from state first
      const { token } = getState().auth;
      
      // If not in state, try AsyncStorage as fallback
      const authToken = token || await AsyncStorage.getItem("token");
      
      console.log("Fetching user data with token:", authToken ? "Token exists" : "Token is missing");
      
      if (!authToken) throw new Error("No authentication token found");

      const response = await axios.get(
        "https://timemanagementsystemserver.onrender.com/api/auth/getUser",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const userData = response.data;

      console.log("Fetched User Data:", userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      // Use userData instead of undefined data variable
      if (userData.trainee) {
        await AsyncStorage.setItem("token", authToken);
        await AsyncStorage.setItem("cell Number", userData.trainee.phoneNumber || "");
        await AsyncStorage.setItem("email", userData.trainee.email || "");
        await AsyncStorage.setItem("id Number", userData.trainee.idNumber || "");
        await AsyncStorage.setItem("Location", userData.trainee.location || "");

        console.log("Stored Token in AsyncStorage:", authToken);
        console.log("cell Number", userData.trainee.phoneNumber);
        console.log("email", userData.trainee.email);
        console.log("id Number", userData.trainee.idNumber);
        console.log("Location", userData.trainee.location);
      }

      // Store traineeID if available
      const traineeID = userData.trainee?.traineeId?.toString();
      if (traineeID) {
        await AsyncStorage.setItem("traineeID", traineeID);
      }

      return userData;
    } catch (error) {
      console.error("Fetch user data error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch user data");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    traineeID: null,
    email: null,
    name: null,
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
      state.email = null;
      state.name = null;
      state.checkInData = null;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("keepSignedIn");
      AsyncStorage.removeItem("traineeID");
      AsyncStorage.removeItem("name");
      AsyncStorage.removeItem("checkInData");
    },
    // Reducer to set token from AsyncStorage on app startup
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // New reducer to set user data from AsyncStorage on app startup
    setUserData: (state, action) => {
      state.traineeID = action.payload.traineeID;
      state.email = action.payload.email;
      state.name = action.payload.name;
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
        state.token = action.payload.token;
        state.traineeID = action.payload.traineeID;
        state.name = action.payload.name;
        state.email = action.payload.email || action.meta.arg.email;
       
        console.log("Stored Token in Redux:", state.token);
        console.log("Token after Login:", action.payload.token);
        console.log("Trainee ID after Login:", action.payload.traineeID);
        console.log("Name after Login:", action.payload.name);
    
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
        const email = action.payload?.email || action.payload.trainee?.email;
        const name = action.payload.trainee?.name || action.payload.trainee?.fullName;
        state.traineeID = traineeID || state.traineeID;
        state.email = email || state.email;
        state.name = name || state.name;
     
        console.log("Updated Redux State - User:", state.user);
        console.log("Updated Redux State - Trainee ID:", state.traineeID);
        console.log("Updated Redux State - Email:", state.email);
        console.log("Updated Redux State - Name:", state.name);
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, setToken, setUserData } = authSlice.actions;
export default authSlice.reducer;