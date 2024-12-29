import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: null, // This will hold user data after login
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.userInfo = action.payload; // Set user info on successful login
        },
        logout: (state) => {
            state.userInfo = null; // Clear user info on logout
        },
        setLoading: (state, action) => {
            state.loading = action.payload; // Set loading state
        },
        setError: (state, action) => {
            state.error = action.payload; // Set error state
        },
    },
});

export const { loginSuccess, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;