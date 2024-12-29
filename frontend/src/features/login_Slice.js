import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user login
export const loginUser = createAsyncThunk('user/loginUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/users/login/', userData);
        return response.data; // Return the entire response data
    } catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
});

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || null, // Load userInfo from localStorage
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.successMessage = null;
            state.error = null;
            localStorage.removeItem('userInfo'); // Clear user info from local storage
        },
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.successMessage = null; // Clear previous messages
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload; // Store the entire user info
                state.successMessage = "Login successful!";
                state.error = null;

                // Store user info in local storage
                localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Ensure payload is stringified
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload; // Set error message from the rejected action
                state.successMessage = null; // Clear previous messages
            });
    },
});

export const { logout, clearMessages } = loginSlice.actions;

export default loginSlice.reducer;
