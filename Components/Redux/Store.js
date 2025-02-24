import { configureStore } from "@reduxjs/toolkit";

import AuthenticationReducer from './Slices/AuthenticationSlice'

const store = configureStore({
    reducer: {
        auth: AuthenticationReducer
    }
})

export default store;