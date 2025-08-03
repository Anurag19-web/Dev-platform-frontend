// slices/updateProfileSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getUserId = () => JSON.parse(localStorage.getItem("userId"));

// PATCH request as asyncThunk
export const updateProfile = createAsyncThunk(
  "updateProfile/update",
  async (updates, thunkAPI) => {
    try {
      const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${getUserId()}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data; // return updated profile
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    updatedUser: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateProfileSlice.reducer;
