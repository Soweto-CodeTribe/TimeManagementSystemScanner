import { createSlice } from '@reduxjs/toolkit'

const initialState = {

}

export const AuthenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        signIn : ()=>{
            console.log('user signed in');
        },
        signOut : ()=>{
            console.log('user signed in');
        },
        signOut : ()=>{
            console.log('user signed in');
        },
    }
})

export const { signIn } = AuthenticationSlice.actions
export default AuthenticationSlice.reducer;