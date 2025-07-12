// store/store.jsx
import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunk to fetch blogs
export const fetchBlogs = createAsyncThunk("blogs/fetch", async () => {
  const res = await fetch("https://dev-platform-backend.onrender.com/blogs/users");
  const data = await res.json();
  return data;
});

// Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
  },
});

// Store
export const store = configureStore({
  reducer: {
    blogs: blogSlice.reducer,
  },
});