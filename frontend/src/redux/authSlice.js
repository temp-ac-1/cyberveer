import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user: null,
        isLoggedIn: false,
    },
    reducers:{
        //actions
        setAuthUser:(state, action)=>{
            state.user = action.payload;
        },
        setIsLoggedIn:(state, action)=>{
            state.isLoggedIn = action.payload;
        },
    }
});

export const {setAuthUser, setIsLoggedIn} = authSlice.actions;
export default authSlice.reducer;