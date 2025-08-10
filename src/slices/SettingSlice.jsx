// slices/settingSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Utility to get userId
const getUserId = () => JSON.parse(localStorage.getItem("userId"));

// AsyncThunk to update password
export const updatePassword = createAsyncThunk(
  "settings/updatePassword",
  async (newPassword, thunkAPI) => {
    try {
      const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${getUserId()}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to update password");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const savedTheme = localStorage.getItem("bgTheme") || "#0f172a";
const savedLanguage = localStorage.getItem("language") || "en";

const settingSlice = createSlice({
  name: "settings",
  initialState: {
    loading: false,
    successMessage: null,
    errorMessage: null,
    bgTheme: savedTheme,
    language: savedLanguage,
    notifications: true,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
    setTheme: (state, action) => {
      state.bgTheme = action.payload;
      localStorage.setItem("bgTheme", action.payload);
      document.body.style.background = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Password updated successfully!";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || "Something went wrong.";
      });
  },
});

export const { clearMessages, setTheme, setLanguage, toggleNotifications } = settingSlice.actions;
export default settingSlice.reducer;
