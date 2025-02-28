import { configureStore } from "@reduxjs/toolkit";
import scanReducer from './Slices/ScanSlice'
import AuthenticationReducer from './Slices/AuthenticationSlice'
import CheckInOutReducer from './Slices/CheckInOutSlice'

const store = configureStore({
    reducer: {
        auth: AuthenticationReducer,
        scan: scanReducer,
        checkInOut:CheckInOutReducer
    }
})

export default store;