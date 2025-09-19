import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfileById, selectUserProfile, selectViewedProfile } from "../slices/userProfileSlice";
import { fetchFollowNetwork, toggleFollow } from "../slices/FollowListSlice";
import { FiSettings } from "react-icons/fi";
import { VoiceNavigator } from "../pages/VoiceNavigator";

export const UserProfilesData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const userProfilesData = useSelector(selectUserProfile);
  const viewedProfile = useSelector(selectViewedProfile);
  const userId = useMemo(() => JSON.parse(localStorage.getItem("userId")), []);
  const [isFollowing, setIsFollowing] = useState(false);
  const { bgTheme } = useSelector((state) => state.settings);

  // Check if logged-in user can see full profile
  const canViewFullProfile = !viewedProfile?.isPrivate || viewedProfile?.followers?.includes(userId) || id === userId;

  useEffect(() => {
    if (viewedProfile?.followers?.includes(userId)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [viewedProfile, userProfilesData]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileById(id));
      dispatch(fetchFollowNetwork(id));
    }
  }, [id, dispatch]);

  const handleToggleFollow = async () => {
    const result = await dispatch(toggleFollow({ id, userId, isFollowing }));
    if (toggleFollow.fulfilled.match(result)) {
      dispatch(fetchProfileById(id));
      dispatch(fetchFollowNetwork(id));
      setIsFollowing((prev) => !prev);
    } else {
      console.error("Follow toggle error:", result.payload);
    }
  };

  if (!userProfilesData) {
    return <div className="text-white text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen text-white px-4 py-10 font-sans" style={{ background: bgTheme }}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-[#1f2937] bg-opacity-90 p-10 rounded-2xl shadow-2xl relative"
      >
        <button
          onClick={() => navigate("/home")}
          className="bg-gray-700/70 px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          ← Back
        </button>
        <button
          onClick={() => navigate("/setting")}
          className="p-3 rounded-full bg-gray-700/70 hover:bg-indigo-600 transition shadow-lg absolute right-10"
          title="Settings"
        >
          <FiSettings size={20} />
        </button>
        <div className="absolute right-10 w-10 mt-5">
          <VoiceNavigator />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={viewedProfile.profilePicture || "user.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
            />
            {id === userId && (
              <button
                onClick={() => navigate("/usereditprofile")}
                className="absolute bottom-0 right-0 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow-lg transition opacity-90 group-hover:opacity-100"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <h1 className="text-3xl font-bold mt-4">{viewedProfile.username}</h1>

          {/* Follow/Unfollow button (always visible for other users) */}
          {id !== userId && (
            <button
              onClick={handleToggleFollow}
              className={`h-10 w-30 mt-5 rounded-lg text-sm shadow-lg transition ${isFollowing ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          {/* Private message for non-followers */}
          {id !== userId && !canViewFullProfile && (
            <p className="mt-4 text-gray-400 italic text-center">
              This account is private. Only followers can view posts and details.
            </p>
          )}

          {/* Only show the full profile if allowed */}
          {canViewFullProfile && (
            <>
              {/* Followers / Following / Posts */}
              <div className="flex gap-6 mt-4" onClick={() => navigate(`/followlist/${id}`)}>
                <div className="text-center cursor-pointer">
                  <p className="text-xl font-bold">{viewedProfile.followers?.length || 0}</p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div className="text-center cursor-pointer">
                  <p className="text-xl font-bold">{viewedProfile.following?.length || 0}</p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
              </div>

              <motion.button
                onClick={() => navigate(`/allposts/${id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition transform"
              >
                📄 See All Posts
              </motion.button>

              {/* BIO */}
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold text-indigo-400">📝 Bio</h2>
                <p className="mt-2 text-gray-300">{viewedProfile.bio || "No bio added yet."}</p>
              </div>

              {/* SKILLS */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-indigo-400">🛠️ Skills</h2>
                <div className="mt-2 flex flex-wrap gap-3">
                  {viewedProfile.skills?.length > 0 ? (
                    viewedProfile.skills.map((skill, idx) => (
                      <span key={idx} className="px-4 py-2 bg-purple-600 rounded-full text-sm font-medium shadow-md">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* EXPERIENCE */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-indigo-400">📌 Experience</h2>
                <ul className="mt-2 space-y-2">
                  {viewedProfile.experience?.length > 0 ? (
                    viewedProfile.experience.map((exp, idx) => (
                      <li key={idx} className="bg-[#2d3748] p-4 rounded-lg shadow">
                        <h3 className="text-lg font-bold">{exp.role}</h3>
                        <p className="text-gray-400">{exp.company} — {exp.duration}</p>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400">No experience added yet.</p>
                  )}
                </ul>
              </div>

              {/* CONNECT */}
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold text-indigo-400">🔗 Connect</h2>
                <div className="flex justify-center gap-12 mt-4 flex-wrap">
                  {viewedProfile.github && (
                    <div className="flex flex-col items-center text-white max-w-xs text-center">
                      <i className="fab fa-github text-3xl"></i>
                      <span className="mt-1 font-medium">GitHub</span>
                      <span className="text-xs break-all">{viewedProfile.github}</span>
                    </div>
                  )}
                  {viewedProfile.linkedin && (
                    <div className="flex flex-col items-center text-white max-w-xs text-center">
                      <i className="fab fa-linkedin text-3xl"></i>
                      <span className="mt-1 font-medium">LinkedIn</span>
                      <span className="text-xs break-all">{viewedProfile.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};