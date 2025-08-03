// slices/usersSlice.jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("https://dev-platform-backend.onrender.com/api/users");
  const data = await res.json();
  return data;
});

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    usersStatus: "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.usersStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.usersStatus = "successed";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.usersStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;

// Selectors (optional exports)
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersStatus = (state) => state.users.usersStatus