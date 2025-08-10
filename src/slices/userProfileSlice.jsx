// slices/userProfileSlice.jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk("userProfile/fetch", async () => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${userId}`);
  const data = await res.json();
  return data;
});

// Thunk to fetch any other user's profile by ID
export const fetchProfileById = createAsyncThunk("userProfile/fetchById", async (id) => {
  const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${id}`);
  const data = await res.json();
  return data;
});

// Slice
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    userProfile: {},
    userProfileStatus: "idle",
    viewedProfile: {},
    viewedProfileStatus: "idle",
    loading: false,
    error: null,
  },
  reducers: {
    resetUserProfileStatus: (state)=>{
      state.userProfileStatus = "idle"; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.userProfileStatus = "loading",
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfileStatus = "succeeded";
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.userProfileStatus = "failed"
        state.error = action.error.message;
      })

      // Viewed user profile
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.viewedProfileStatus = "loading",
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedProfileStatus = "succeeded",
        state.viewedProfile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.viewedProfileStatus = "failed",
        state.error = action.error.message;
      });
  },
});

export default userProfileSlice.reducer;
export const { resetUserProfileStatus } = userProfileSlice.actions;

// Optional selectors
export const selectUserProfile = (state) => state.userProfile.userProfile;
export const selectUserProfileLoading = (state) => state.userProfile.loading;
export const selectUserProfileError = (state) => state.userProfile.error;
export const selectUserProfileStatus = (state) => state.userProfile.userProfileStatus;
export const selectViewedProfile = (state) => state.userProfile.viewedProfile;
export const selectViewedProfileStatus = (state) => state.userProfile.viewedProfileStatus;