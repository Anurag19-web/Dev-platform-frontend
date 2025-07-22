import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UserProfilesData = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [userProfilesData, setuserProfilesData] = useState(null);
  const userId = JSON.parse(localStorage.getItem("userId"));

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
  if (userProfilesData?.followers?.includes(userId)) {
    setIsFollowing(true);
  } else {
    setIsFollowing(false);
  }
}, [userProfilesData,userId]);

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${id}`);
        const data = await res.json();
        if (data) {
          setuserProfilesData(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userId) {
      handleProfile();
    } else {
      navigate("/signup");
    }
  }, [userId, navigate]);

  if (!userProfilesData) return <div className="text-white text-center mt-20">Loading profile...</div>;

  const handleFollow = async () => {
    try {
      const res = await fetch(
        `https://dev-platform-backend.onrender.com/api/users/${id}/follow`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId:userId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setuserProfilesData((prev) => ({
          ...prev,
          followers: data.followers,
        }));
        console.log(userProfilesData.followers);
       setIsFollowing(true)
      } else {
        console.error("Follow failed:", data.message);
      }
    } catch (error) {
      console.error("Follow request error:", error);
    }
  };

  const handleUnfollow = async () => {
    const res = await fetch(
      `https://dev-platform-backend.onrender.com/api/users/${id}/unfollow`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(userId);
      setuserProfilesData((prev) => ({ ...prev, followers: data.followers }));
      console.log(userProfilesData);
      setIsFollowing(false);
    }
  };

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
        {/* Profile Picture & Name */}
        <div className="flex flex-col items-center">
          <img
            src={userProfilesData.profilePicture || "https://api.dicebear.com/7.x/thumbs/svg?seed="}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4"
          />
          <h1 className="text-3xl font-bold">{userProfilesData.username}</h1>
          <p className="text-gray-300 text-sm mt-1">{userProfilesData.email}</p>
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`h-10 w-30 mt-5 rounded-lg text-sm shadow-lg transition ${isFollowing ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>


          {/* Followers & Following */}
          <div className="flex gap-6 mt-4" onClick={()=>handleNavigation(userProfilesData.userId)}>
            <div className="text-center">
              <p className="text-xl font-bold">{userProfilesData.followers?.length || 0}</p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{userProfilesData.following?.length || 0}</p>
              <p className="text-sm text-gray-400">Following</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">📝 Bio</h2>
          <p className="mt-2 text-gray-300">{userProfilesData.bio || "No bio added yet."}</p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">🛠️ Skills</h2>
          <div className="mt-2 flex flex-wrap gap-3">
            {userProfilesData.skills?.length > 0
              ? userProfilesData.skills.map((skill, idx) => (
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
            {userProfilesData.experience?.length > 0
              ? userProfilesData.experience.map((exp, idx) => (
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
            {userProfilesData.github && (
              <div className="flex flex-col items-center text-white max-w-xs text-center">
                <i className="fab fa-github text-3xl"></i>
                <span className="mt-1 font-medium">GitHub</span>
                <span className="text-xs break-all">{userProfilesData.github}</span>
              </div>
            )}
            {userProfilesData.linkedin && (
              <div className="flex flex-col items-center text-white max-w-xs text-center">
                <i className="fab fa-linkedin text-3xl"></i>
                <span className="mt-1 font-medium">LinkedIn</span>
                <span className="text-xs break-all">{userProfilesData.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
