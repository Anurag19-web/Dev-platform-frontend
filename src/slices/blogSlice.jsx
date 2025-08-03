// store/store.jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
    blogsStatus : "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.blogsStatus = "loading"
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false; 
        state.blogs = action.payload;
        state.blogsStatus = "successed";
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.blogsStatus = "failed"
      });
  },
});

// 👇 ADD THIS
export default blogSlice.reducer;

// If you also want to export selectors or thunks:
export const selectBlogs = (state) => state.blogs.blogs;
export const selectBlogsLoading = (state) => state.blogs.loading;
export const selectBlogsError = (state) => state.blogs.error;
export const selectBlogsStatus = (state) => state.blogs.blogsStatus 