import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, resetUserProfileStatus, selectUserProfile, selectUserProfileError, selectUserProfileLoading, selectUserProfileStatus } from "../slices/userProfileSlice";
import { useDispatch, useSelector } from "react-redux";

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserProfileLoading);
  const error = useSelector(selectUserProfileError);
  const userProfileStatus = useSelector(selectUserProfileStatus);

  useEffect(()=>{
  if(userProfileStatus === "idle"){
  dispatch(fetchUserProfile())
  dispatch(resetUserProfileStatus());
  }
  },[userProfileStatus, dispatch]);

  useEffect(() => {
  if (userProfileStatus === "succeeded" || userProfileStatus === "failed") {
    dispatch(resetUserProfileStatus());
  }
}, [userProfileStatus, dispatch]);

  if (!userProfile) return <div className="text-white text-center mt-20">Loading profile...</div>;

  const handleNavigation = (id)=>{
    navigate(`/followlist/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white px-4 py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-[#1f2937] bg-opacity-90 p-10 rounded-2xl shadow-2xl relative"
      >
        <button onClick={() => navigate("/home")} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
            ← Back
          </button>
        {/* Edit Button */}
        <button
          onClick={() => navigate("/usereditprofile")}
          className="absolute top-10 right-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm shadow-lg transition"
        >
          ✏️ Edit Profile
        </button>

        {/* Profile Picture & Name */}
        <div className="flex flex-col items-center">
          <img
            src={ userProfile.profilePicture || "user.png" }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4"
          />
          <h1 className="text-3xl font-bold">{userProfile.username}</h1>
          <p className="text-gray-300 text-sm mt-1">{userProfile.email}</p>

          {/* Followers & Following */}
          <div className="flex gap-6 mt-4">
            <div className="text-center" onClick={()=>handleNavigation(userProfile.userId)}>
              <p className="text-xl font-bold">{userProfile.followers?.length || 0}</p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="text-center" onClick={()=>handleNavigation(userProfile.userId)}>
              <p className="text-xl font-bold">{userProfile.following?.length || 0}</p>
              <p className="text-sm text-gray-400">Following</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">📝 Bio</h2>
          <p className="mt-2 text-gray-300">{userProfile.bio || "No bio added yet."}</p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">🛠️ Skills</h2>
          <div className="mt-2 flex flex-wrap gap-3">
            {userProfile.skills?.length > 0
              ? userProfile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-purple-600 rounded-full text-sm font-medium shadow-md"
                >
                  {skill}
                </span>
              ))
              : <p className="text-gray-400">No skills added yet.</p>}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">📌 Experience</h2>
          <ul className="mt-2 space-y-2">
            {userProfile.experience?.length > 0
              ? userProfile.experience.map((exp, idx) => (
                <li key={idx} className="bg-[#2d3748] p-4 rounded-lg shadow">
                  <h3 className="text-lg font-bold">{exp.role}</h3>
                  <p className="text-gray-400">
                    {exp.company} — {exp.duration}
                  </p>
                </li>
              ))
              : <p className="text-gray-400">No experience added yet.</p>}
          </ul>
        </div>

        {/* Social Links */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">🔗 Connect</h2>
          <div className="flex justify-center gap-12 mt-4 flex-wrap">
            {userProfile.github && (
              <div className="flex flex-col items-center text-white max-w-xs text-center">
                <i className="fab fa-github text-3xl"></i>
                <span className="mt-1 font-medium">GitHub</span>
                <span className="text-xs break-all">{userProfile.github}</span>
              </div>
            )}
            {userProfile.linkedin && (
              <div className="flex flex-col items-center text-white max-w-xs text-center">
                <i className="fab fa-linkedin text-3xl"></i>
                <span className="mt-1 font-medium">LinkedIn</span>
                <span className="text-xs break-all">{userProfile.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
