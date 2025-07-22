import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [homeData, setHomeData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleHomePage = async () => {
      try {
        const res = await fetch("https://dev-platform-backend.onrender.com/api/users");
        const data = await res.json();
        setHomeData(data);
        console.log(data);
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };
    handleHomePage();
  }, []);

  const handleUserProfiles = (userId)=>{
    navigate(`/userprofilesdata/${userId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white">
      {/* Navbar */}
      <motion.nav
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="flex flex-col md:flex-row justify-between items-center px-4 py-4 shadow-md backdrop-blur-sm bg-white/10 gap-4"
>
  {/* Logo */}
  <h1 className="text-2xl font-bold tracking-wide">Dev Platform</h1>

  {/* Search bar - full width on mobile, shrink on desktop */}
  <div className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full md:w-[300px]">
    <FaSearch className="text-white/80 mr-2" />
    <input
      type="text"
      placeholder="Search blogs or users"
      className="bg-transparent outline-none w-full placeholder-white/70 text-white"
    />
  </div>

  {/* Profile Icon */}
  <NavLink to="/userprofile">
    <img
      src={homeData.profilePicture || "user.png"}
      alt="Profile"
      className="w-10 h-10 rounded-full border-2 border-white"
    />
  </NavLink>
</motion.nav>


      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 md:p-10"
      >
        <h2 className="text-4xl font-bold mb-4 drop-shadow-xl">Welcome to the Dev Platform</h2>
        <p className="text-white/80 max-w-xl text-lg">
          Explore trending blogs, connect with developers, and grow your skills.
        </p>
      </motion.main>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-10">
        {homeData.map((user, index) => {
          const {
            username,
            _id,
            userId,
            email,
            bio,
            skills,
            github,
            linkedin,
            following,
            followers
          } = user;

          return (
            <motion.div
              key={_id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={()=>handleUserProfiles(userId)}
              className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold mb-2">{username}</h3>
              <p className="text-white/70 text-sm mb-2">📧 {email}</p>
              <p className="text-white/70 text-sm mb-2">📧 {userId}</p>
              {bio && <p className="text-white/60 italic mb-2">💬 {bio}</p>}
              {skills?.length > 0 && (
                <p className="text-white/60 mb-2">💡 Skills: {skills.join(", ")}</p>
              )}
              <div className="flex gap-3 text-sm text-white/70">
                {github && <a href={github} target="_blank" rel="noreferrer" className="underline">GitHub</a>}
                {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
              </div>
              <div className="mt-3 text-xs text-white/50">
                <span>👥 Followers: {followers?.length || 0}</span> |{" "}
                <span>Following: {following?.length || 0}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
