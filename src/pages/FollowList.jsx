import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFollowNetwork,
  resetFollowNetworkStatus,
  selectFollowNetworkStatus,
} from "../slices/FollowListSlice";
import { FiSettings } from "react-icons/fi";
import { IoArrowBackOutline } from "react-icons/io5";

export const FollowList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const followNetworkStatus = useSelector(selectFollowNetworkStatus);
  const { bgTheme } = useSelector((state) => state.settings);

  const { followers, following } = useSelector(
    (state) => state.followNetwork
  );

  // Fetch data
  useEffect(() => {
    if (id && followNetworkStatus === "idle") {
      dispatch(fetchFollowNetwork(id));
    }
  }, [id, dispatch, followNetworkStatus]);

  // Reset status after fetch
  useEffect(() => {
    if (
      followNetworkStatus === "succeeded" ||
      followNetworkStatus === "failed"
    ) {
      dispatch(resetFollowNetworkStatus());
    }
  }, [followNetworkStatus, dispatch]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div
      className="min-h-screen text-white px-4 sm:px-8 pb-12"
      style={{ background: bgTheme }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between py-6 border-b border-white/10 mb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition shadow-md text-sm sm:text-base"
        >
          <IoArrowBackOutline size={18} />
          Back
        </button>

        {/* Page Title */}
        <motion.h1
          className="text-xl sm:text-2xl font-bold tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Network
        </motion.h1>

        {/* Settings Button */}
        <button
          onClick={() => navigate("/setting")}
          className="flex items-center gap-2 bg-gray-800 hover:bg-indigo-500 px-4 py-2 rounded-lg transition shadow-md text-sm sm:text-base"
        >
          <FiSettings size={18} />
        </button>
      </div>

      {/* Followers & Following */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Followers */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
            👥 Followers
          </h2>
          <div className="space-y-4">
            {followers.length > 0 ? (
              followers.map((user, i) => (
                <motion.div
                  key={user.id || i}
                  className="bg-white/10 p-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-4 hover:bg-white/15 transition cursor-pointer"
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={fadeInUp}
                  onClick={() =>
                    navigate(`/userprofilesdata/${user.userId}`)
                  }
                >
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-indigo-400"
                  />
                  <div>
                    <p className="text-sm font-bold">{user.username}</p>
                    <p className="text-xs text-gray-300">{user.id}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 italic">No followers yet.</p>
            )}
          </div>
        </motion.div>

        {/* Following */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
            ➡️ Following
          </h2>
          <div className="space-y-4">
            {following.length > 0 ? (
              following.map((user, i) => (
                <motion.div
                  key={user.id || i}
                  className="bg-white/10 p-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-4 hover:bg-white/15 transition cursor-pointer"
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={fadeInUp}
                  onClick={() =>
                    navigate(`/userprofilesdata/${user.userId}`)
                  }
                >
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-indigo-400"
                  />
                  <div>
                    <p className="text-sm font-bold">{user.username}</p>
                    <p className="text-xs text-gray-300">{user.id}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 italic">
                Not following anyone yet.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
