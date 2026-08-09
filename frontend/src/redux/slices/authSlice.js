import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {

        setCredentials: (state, action) => {
            const { user } = action.payload;
            
            state.user = user;
            state.isAuthenticated = true;
            state.loading = false;

            const userRole = state.user.role;
            console.log(userRole);
        }, 

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;