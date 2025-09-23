import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, clearMessages, setTheme, setLanguage } from "../slices/SettingSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { VoiceNavigator } from "./VoiceNavigator";

export const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userId = JSON.parse(localStorage.getItem("userId"));

  const { successMessage, errorMessage, loading, bgTheme, language, notifications } = useSelector(
    (state) => state.settings
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Toggle privacy (update backend)
  const handlePrivacy = () => {
    const id = userId;
    fetch(`https://dev-platform-backend.onrender.com/api/users/${userId}/privacy`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPrivate: !isPrivate }),
    })
      .then((res) => res.json())
      .then((data) => setIsPrivate(data.isPrivate))
      .catch((err) => console.error("Error updating privacy:", err));
  };

  useEffect(() => {
    fetch(`https://dev-platform-backend.onrender.com/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setIsPrivate(data.isPrivate))
      .catch(err => console.error(err));
  }, [userId]);


  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      dispatch(clearMessages());
      return alert("Password must be at least 6 characters long.");
    }
    if (newPassword !== confirmPassword) {
      dispatch(clearMessages());
      return alert("Passwords do not match.");
    }

    dispatch(updatePassword(newPassword)).then(() => {
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(clearMessages());
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMessage, errorMessage, dispatch]);

  return (
    <motion.div
      className="min-h-screen text-gray-900 dark:text-white px-4 py-8 flex justify-center items-center"
      style={{ background: bgTheme }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-3xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-md shadow-2xl rounded-xl p-8 space-y-10 border border-white/20"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← {t("Back")}
        </motion.button>

        <motion.h1
          className="text-3xl font-bold border-b border-white/20 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t("Settings")}
        </motion.h1>

        {/* Change Password */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("Change Password")}</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder={t("New Password")}
              className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t("Confirm New Password")}
              className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <AnimatePresence>
              {loading && (
                <motion.p
                  className="text-blue-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t("Updating password...")}
                </motion.p>
              )}
              {successMessage && (
                <motion.p
                  className="text-green-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {successMessage}
                </motion.p>
              )}
              {errorMessage && (
                <motion.p
                  className="text-red-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleChangePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("Update Password")}
            </motion.button>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("Preferences")}</h2>
          
          {/* Voice Navigator with label */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">{t("Microphone")}</span>
            <div className="ml-4">
              <VoiceNavigator />
            </div>
          </div>

          {/* Account Privacy */}
          <div className="flex items-center justify-between mb-4">
            <span>{t("Account Privacy")}</span>
            <motion.button
              onClick={handlePrivacy}
              className={`px-4 py-1 rounded-full font-medium transition-all duration-300 ${isPrivate ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
              whileHover={{ scale: 1.05 }}
            >
              {isPrivate ? "🔒" : "🌐"}
            </motion.button>
          </div>

          {/* Background Theme Picker */}
          <div className="flex items-center justify-between">
            <span>{t("Background Theme")}</span>
            <motion.input
              type="color"
              value={bgTheme}
              onChange={(e) => dispatch(setTheme(e.target.value))}
              className="w-10 h-10 rounded-full border cursor-pointer"
              whileHover={{ scale: 1.1 }}
            />
          </div>

          {/* Language Picker */}
          <div className="flex items-center justify-between">
            <span>{t("Language")}</span>
            <select
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value))}
              className="p-2 rounded bg-gray-700 text-white mt-3"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </section>

        {/* Add this inside your Preferences section */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4">{t("Saved Posts")}</h2>
          <motion.button
            onClick={() => navigate("/savedposts")} // navigate to saved posts page
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("Check Saved Posts")}
          </motion.button>
        </section>

        {/* Danger Zone */}
        <section>
          <motion.button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("Log Out")}
          </motion.button>
        </section>
      </motion.div>
    </motion.div>
  );
};