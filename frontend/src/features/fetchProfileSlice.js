import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, { getState, rejectWithValue }) => {
    const { user } = getState(); // Access the user state
    const token = user.userInfo?.access; // Get the access token

    if (!token) {
        return rejectWithValue('User  is not authenticated'); // Handle missing token
    }

    try {
        const response = await axios.get('/api/users/profile/', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
        });
        return response.data; // Return the user profile data
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching user profile:", error);
        return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user profile');
    }
});

const fetchProfileSlice = createSlice({
    name: 'fetchProfile',
    initialState: {
        loading: false,
        error: null,
        userInfo: null, // This will hold the fetched user profile data
    },
    reducers: {
        clearMessages: (state) => {
            state.error = null; // Clear error messages
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true; // Set loading state
                state.error = null; // Clear previous errors
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false; // Reset loading state
                state.userInfo = action.payload; // Store fetched user info
                state.error = null; // Clear errors
            })
            .addCase(fetchUserProfile.rejected, (state, { payload }) => {
                state.loading = false; // Reset loading state
                state.error = payload; // Set error message
            });
    },
});

export const { clearMessages } = fetchProfileSlice.actions;

export default fetchProfileSlice.reducer;