import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiArrowLeft, FiSettings, FiLogOut } from "react-icons/fi";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import { VoiceNavigator } from "../pages/VoiceNavigator";

export const Likes = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const userId = JSON.parse(localStorage.getItem("userId"));
  const cleanPostId = postId?.replace(/"/g, "");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    if (!cleanPostId) return;

    const fetchLikes = async () => {
      try {
        const res = await fetch(
          `https://dev-platform-backend.onrender.com/api/posts/${cleanPostId}/likes`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setLikes(data || []);
      } catch (err) {
        console.error("Error fetching likes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [cleanPostId]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-18 bg-[#1f2937] text-white p-6 z-40
                 transform transition-transform duration-300 ease-in-out ${
                   sidebarOpen ? "translate-x-0" : "-translate-x-full"
                 }`}
      >
        <div className="flex flex-col items-center py-6 space-y-6 text-white text-2xl">
          <button
            onClick={() => navigate("/")}
            className="px-4 rounded hover:text-indigo-400"
          >
            ←
          </button>
          <button
            onClick={() => {
              navigate("/setting");
              setSidebarOpen(false);
            }}
            className="hover:text-indigo-400"
            title="Settings"
          >
            <FiSettings />
          </button>
          <button
            onClick={handleLogout}
            className="hover:text-indigo-400"
            title="Logout"
          >
            <FiLogOut />
          </button>
          <VoiceNavigator />
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-red bg-opacity-50 z-30"
        ></div>
      )}

      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-20 flex flex-col md:flex-row justify-between items-center px-4 py-4 shadow-md bg-[#1f2937] gap-4"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl hover:text-indigo-400 transition"
          >
            <FiMenu />
          </button>

          <h1 className="text-2xl font-bold tracking-wide text-white">
            Dev Platform
          </h1>
        </div>

        {/* Search */}
        <div
          onClick={() => navigate("/search")}
          className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full md:w-[300px] cursor-pointer"
        >
          <FaSearch className="text-white/80 mr-2" />
          <span className="bg-transparent outline-none w-full placeholder-white/70 text-white">
            Search Users
          </span>
        </div>

        {/* Add Post Button */}
        <NavLink
          to="/postcreate"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          title="Add New Post"
        >
          <FaPlusCircle className="text-lg" />
          <span>Add Post</span>
        </NavLink>

        {/* Profile Icon */}
        <NavLink to="/userprofile">
          <img
            src={posts[0]?.user?.profilePicture || "user.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </NavLink>
      </motion.nav>

      {/* Back Button + Likes Heading */}
      <div className="flex flex-nowrap items-center gap-2 px-6 pt-4 mb-4 max-w-lg mx-auto">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
          title="Back"
        >
          <FiArrowLeft size={16} />
        </motion.button>

        <h2 className="text-white text-2xl font-bold">Likes</h2>
      </div>

      {/* Likes List */}
      <div className="p-6 max-w-lg mx-auto">
        {loading ? (
          <p className="text-white text-center mt-6 animate-pulse">
            Loading likes...
          </p>
        ) : likes.length === 0 ? (
          <p className="text-white opacity-75">No likes yet.</p>
        ) : (
          <div className="space-y-3">
            {likes.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/userprofilesdata/${userId}`)}
                className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition"
              >
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={
                    user.profileImage
                      ? `https://dev-platform-backend.onrender.com/${user.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">View Profile</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
