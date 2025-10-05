import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  fetchUserProfile,
  resetUserProfileStatus,
  selectUserProfile,
  selectUserProfileStatus,
} from "../slices/userProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import { VoiceNavigator } from "../pages/VoiceNavigator";

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const userProfileStatus = useSelector(selectUserProfileStatus);
  const { bgTheme } = useSelector((state) => state.settings);
  const { updatedUser } = useSelector((state) => state.updateProfile);

  useEffect(() => {
    if (userProfileStatus === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [userProfileStatus, dispatch]);

  useEffect(() => {
    if (updatedUser) {
      dispatch(resetUserProfileStatus());
    }
  }, [updatedUser, dispatch])

  if (!userProfile)
    return (
      <div className="text-white text-center mt-20 text-lg animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen  text-white px-4 py-10 font-sans" style={{ background: bgTheme }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700 p-8 rounded-3xl shadow-2xl relative"
      >
        {/* Header Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-700/70 px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate("/setting")}
            className="p-3 rounded-full bg-gray-700/70 hover:bg-indigo-600 transition shadow-lg"
            title="Settings"
          >
            <FiSettings size={20} />
          </button>
        </div>
        {/* Top Right Controls: Voice Navigator + See All Posts */}
        <div className="absolute right-8 flex flex-col items-end gap-2 mt-[-15px]">
          <VoiceNavigator />

        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={userProfile.profilePicture || "user.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
            />
            <button
              onClick={() => navigate("/usereditprofile")}
              className="absolute bottom-0 right-0 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow-lg transition opacity-90 group-hover:opacity-100"
            >
              ✏️ Edit
            </button>
          </div>

          <h1 className="text-3xl font-bold mt-4">{userProfile.username}</h1>
          <p className="text-gray-400 text-sm">{userProfile.email}</p>

          {/* Followers / Following */}
          <div className="flex gap-12 mt-6">
            <div
              className="text-center cursor-pointer hover:scale-105 transition"
              onClick={() => navigate(`/followlist/${userProfile.userId}`)}
            >
              <p className="text-2xl font-bold">{userProfile.followers?.length || 0}</p>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div
              className="text-center cursor-pointer hover:scale-105 transition"
              onClick={() => navigate(`/followlist/${userProfile.userId}`)}
            >
              <p className="text-2xl font-bold">{userProfile.following?.length || 0}</p>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
          </div>
          <motion.button
            onClick={() => navigate(`/allposts/${userProfile.userId}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition transform"
          >
            📄 See All Posts
          </motion.button>
        </div>

        {/* Bio */}
        <section className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">📝 Bio</h2>
          <p className="mt-3 text-gray-300 text-base leading-relaxed">
            {userProfile.bio || "No bio added yet."}
          </p>
        </section>

        {/* Skills */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-indigo-400">🛠 Skills</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {userProfile.skills?.length > 0 ? (
              userProfile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-sm font-medium shadow-md hover:scale-105 transition"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No skills added yet.</p>
            )}
          </div>
        </section>

        {/* Experience */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-indigo-400">📌 Experience</h2>
          <ul className="mt-4 space-y-3">
            {userProfile.experience?.length > 0 ? (
              userProfile.experience.map((exp, idx) => (
                <li
                  key={idx}
                  className="bg-gray-800/80 p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold">{exp.role}</h3>
                  <p className="text-gray-400">
                    {exp.company} — {exp.duration}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No experience added yet.</p>
            )}
          </ul>
        </section>

        {/* Social Links */}
        <section className="mt-10 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">🔗 Connect</h2>
          <div className="flex justify-center gap-10 mt-6 flex-wrap">
            {userProfile.github && (
              <div className="flex flex-col items-center hover:scale-105 transition">
                <a
                  href={
                    userProfile.github.startsWith("http")
                      ? userProfile.github
                      : `https://${userProfile.github}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:scale-110 transition transform"
                >
                  <FaGithub className="text-3xl" />
                  <span className="mt-1 font-medium">GitHub</span>
                  <span className="text-xs break-all text-gray-400">
                    {userProfile.github}
                  </span>
                </a>
              </div>
            )}
            {userProfile.linkedin && (
              <div className="flex flex-col items-center hover:scale-105 transition">
                <a
                  href={
                    userProfile.linkedin.startsWith("http")
                      ? userProfile.linkedin
                      : `https://${userProfile.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:scale-110 transition transform"
                >
                  <FaLinkedin className="text-3xl text-blue-500" />
                  <span className="mt-1 font-medium">LinkedIn</span>
                  <span className="text-xs break-all text-gray-400">
                    {userProfile.linkedin}
                  </span>
                </a>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};