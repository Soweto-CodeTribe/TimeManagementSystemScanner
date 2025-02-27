import { configureStore } from "@reduxjs/toolkit";
import scanReducer from './Slices/ScanSlice'
import AuthenticationReducer from './Slices/AuthenticationSlice'

const store = configureStore({
    reducer: {
        auth: AuthenticationReducer,
        scan: scanReducer
    }
})

export default store;