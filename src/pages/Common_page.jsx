import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiSettings, FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import {
  fetchBlogs,
  selectBlogs,
  selectBlogsLoading,
  selectBlogsError,
  selectBlogsStatus,
} from "../slices/blogSlice";

export const CommonPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector(selectBlogs);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);
  const blogsStatus = useSelector(selectBlogsStatus);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (blogsStatus === "idle") {
      dispatch(fetchBlogs());
    }
  }, [blogsStatus, dispatch]);

  useEffect(() => {
    if (blogs.length > 0) {
      console.log("Fetched blogs:", blogs);
    }
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl font-bold">
        🚀 Loading Dev Platform...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
        ❌ Error: {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white font-sans transition-all duration-300 overflow-x-hidden">

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-18 bg-[#1f2937] shadow-xl z-[100] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col items-center py-6 space-y-6 text-white text-2xl">
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
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-red bg-opacity-40 z-[90]"
          onClick={toggleSidebar}
        />
      )}

      {/* Header */}
      <header className="bg-[#1f2937] shadow-md sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between px-4 py-4">

          {/* Sidebar Icon aligned to far left */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-white text-3xl hover:text-indigo-400 transition"
              aria-label="Toggle Sidebar"
            >
              <FiMenu />
            </button>
          </div>

          {/* Centered content like title and signup button */}
          <div className="flex-1 max-w-7xl mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white whitespace-nowrap">
              🚀 Dev-Platform
            </h1>
            <NavLink to="/signup">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition duration-300">
                Sign Up
              </button>
            </NavLink>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="min-h-70 flex flex-col justify-center items-center text-center px-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1e2f] via-[#2c3e50] to-[#000c1f]">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-4xl font-extrabold text-white mb-4 mt-10"
          >
            Unlock <span className="text-indigo-400">Developer Wisdom</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-6 pt-5"
          >
            Explore blogs, tips, and journeys from passionate developers across the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 text-center py-2 rounded-full"
          >
            <NavLink to="/home">
              <button className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-14 py-5 text-white text-3xl md:text-2xl rounded-full font-bold shadow-xl tracking-wide hover:shadow-2xl transition-all duration-300">
                🚀 Explore Website
              </button>
            </NavLink>
          </motion.div>
        </section>

        {/* Blog Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-4xl font-bold text-center text-white mb-12">🔥 Trending Blogs</h3>

          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
            {blogs.map((blog, index) => {
              const {
                id,
                username,
                title,
                description,
                userProfilePicture,
                comments,
                likes,
              } = blog;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-[#1f2937] border border-indigo-700 rounded-xl p-5 hover:scale-[1.03] transition duration-300 shadow-lg"
                >
                  <img
                    src={userProfilePicture}
                    alt={username}
                    className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-purple-400 shadow"
                  />
                  <h4 className="text-xl font-semibold text-purple-300 text-center mb-2">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-400 text-center mb-1">by {username}</p>
                  <p className="text-sm text-gray-200 text-center line-clamp-3">{description}</p>
                  <div className="flex justify-center gap-4 mt-4 text-sm text-purple-200">
                    <span>💬 {comments.length}</span>
                    <span>❤️ {likes}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-6 text-center w-full text-sm">
        &copy; {new Date().getFullYear()} Dev-Platform. All rights reserved.
      </footer>
    </div>
  );
};
