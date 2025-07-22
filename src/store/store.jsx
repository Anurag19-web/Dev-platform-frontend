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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Store
export const store = configureStore({
  reducer: {
    blogs: blogSlice.reducer,
  },
});

// Selectors
export const selectBlogs = (state) => state.blogs.blogs;
export const selectLoading = (state) => state.blogs.loading;
export const selectError = (state) => state.blogs.error;