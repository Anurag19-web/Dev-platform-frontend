// src/slices/FollowListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch follow network (followers/following)
export const fetchFollowNetwork = createAsyncThunk(
  "followNetwork/fetch",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${id}/network`);
      if (!res.ok) {
        const text = await res.text();
        return thunkAPI.rejectWithValue(text);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Follow/Unfollow PATCH request
export const toggleFollow = createAsyncThunk(
  "followNetwork/toggleFollow",
  async ({ id, userId, isFollowing }, thunkAPI) => {
    try {
      const url = `https://dev-platform-backend.onrender.com/api/users/${id}/${isFollowing ? "unfollow" : "follow"}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Follow/Unfollow failed");
      }

      return { updatedProfile: data, isFollowing };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const followNetworkSlice = createSlice({
  name: "followNetwork",
  initialState: {
    followers: [],
    following: [],
    followStatus: "idle",
    loading: false,
    error: null,
  },
  reducers: {
    resetFollowNetworkStatus: (state) => {
      state.followStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      //handle followList
      .addCase(fetchFollowNetwork.pending, (state) => {
        state.loading = true;
        state.followStatus = "loading";
        state.error = null;
      })
      .addCase(fetchFollowNetwork.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers || [];
        state.following = action.payload.following || [];
        state.followStatus = "succeeded";
      })
      .addCase(fetchFollowNetwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch network";
        state.followStatus = "failed";
      })

      //follow and unfollow
      .addCase(toggleFollow.pending, (state) => {
        state.loading = true;
        state.followStatus = "loading";
        state.error = null;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.loading = false;
        state.followStatus = "succeeded";
        const { isFollowing, updatedProfile } = action.payload;

        if (isFollowing) {
          state.followers = state.followers.filter(id => id !== updatedProfile.userId);
        } else {
          state.followers.push(updatedProfile.userId);
        }
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Follow/Unfollow failed";
        state.followStatus = "failed";
      });
  },
});

export const { resetFollowNetworkStatus } = followNetworkSlice.actions;
export default followNetworkSlice.reducer;
export const selectFollowNetworkStatus = (state) => state.followNetwork.followStatus;
