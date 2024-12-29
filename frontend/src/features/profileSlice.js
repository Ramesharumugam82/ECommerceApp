import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/users/profile/', {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass JWT token in headers
                },
            });
            return response.data; // Return the profile data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || 'Failed to fetch profile. Please try again.'
            );
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profileData: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.profileData = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear previous errors
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profileData = action.payload; // Store fetched profile data
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload; // Set error message
            });
    },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
