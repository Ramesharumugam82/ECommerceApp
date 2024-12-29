import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user registration
export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/users/register/', userData);
        return response.data; // Return the entire response data
    } catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Registration failed. Please try again.');
    }
});

const registerSlice = createSlice({
    name: 'register',
    initialState: {
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.successMessage = null; // Clear previous messages
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Registration successful! You can now log in."; // Set success message
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload; // Set error message from the rejected action
                state.successMessage = null; // Clear previous messages
            });
    },
});

export const { clearMessages } = registerSlice.actions;

export default registerSlice.reducer;
