import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
        const { user } = getState();
        const token = user.userInfo?.access; // Assuming userInfo contains the access token

        if (!token) {
            return rejectWithValue('User  is not authenticated');
        }

        try {
            const response = await axios.put('/api/users/profile/update/', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data; // Return the updated user info
        } catch (error) {
            console.error("Error updating profile:", error); // Debugging line
            return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
        }
    }
);

const updateProfileSlice = createSlice({
    name: 'updateProfile',
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
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.successMessage = null; // Clear previous messages
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Profile updated successfully!";
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload; // Set error message from the rejected action
                state.successMessage = null; // Clear previous messages
            });
    },
});

export const { clearMessages } = updateProfileSlice.actions;

export default updateProfileSlice.reducer;