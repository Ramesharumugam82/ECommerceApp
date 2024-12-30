import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    'update/fetchUserProfile',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/users/profile/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || 'Failed to fetch profile. Please try again.'
            );
        }
    }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'update/updateUserProfile',
    async ({ token, userData }, { rejectWithValue }) => {
        try {
            const response = await axios.put('/api/users/profile/update/', userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || 'Failed to update profile. Please try again.'
            );
        }
    }
);

const updateSlice = createSlice({
    name: 'update',
    initialState: {
        profileData: null,
        loading: false,
        error: '',
        successMessage: '',
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = '';
            state.error = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profileData = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.successMessage = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload; // Update global state with the updated user data
                state.successMessage = "Profile updated successfully!";
                state.error = null;

                // Update user info in local storage
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(updateUserProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.successMessage = null;
            });
    },
});

export const { clearMessages } = updateSlice.actions;

export default updateSlice.reducer;
