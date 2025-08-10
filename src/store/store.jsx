import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/usersSlice.jsx";
import blogReducer from "../slices/blogSlice.jsx"; // ✅
import UserProfileReducer from "../slices/userProfileSlice.jsx";
import  updateProfileReducer  from "../slices/updateProfileSlice.jsx";
import followNetworkReducer from "../slices/FollowListSlice.jsx";
import settingReducer from '../slices/SettingSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    blogs: blogReducer,
    userProfile: UserProfileReducer,
    updateProfile: updateProfileReducer,
    followNetwork: followNetworkReducer,
    settings: settingReducer,
  },
});
