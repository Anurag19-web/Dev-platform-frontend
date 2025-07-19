import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/store";
import { title } from "framer-motion/client";
import { NavLink } from "react-router-dom";

export const CommonPage = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);

  // Fetch blogs only if not already fetched
  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs());
      setTimeout(() => setLoading(false), 1200);
    } else {
      setLoading(false);
    }
  }, [dispatch, blogs.length]);

  useEffect(() => {
    if (blogs.length > 0) {
      console.log("Fetched blogs:", blogs);
    }
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
        🚀 Loading Dev Platform...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white font-sans">

      {/* Header */}
      <header className="bg-[#1f2937] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">🚀 Dev-Platform</h1>
          <NavLink to="/signup">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition duration-300">
            Sign Up
          </button>
          </NavLink>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">

        {/* Hero Section */}
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
            <button
              className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-14 py-5 text-white text-3xl md:text-2xl
               rounded-full font-bold shadow-xl tracking-wide hover:shadow-2xl transition-all duration-300"
            >
              🚀 Explore Website
            </button>
            </NavLink>
          </motion.div>
        </section>

        {/* Blog Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-4xl font-bold text-center text-white mb-12">🔥 Trending Blogs</h3>

          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
            {blogs.map((blog) =>{ 
              const {id, username, title, description, userProfilePicture, comments, likes} = blog;
              return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: id * 0.1, duration: 0.6 }}
                className="bg-[#1f2937] border border-indigo-700 rounded-xl p-5 hover:scale-[1.03] transition duration-300 shadow-lg"
              >
                <img
                  src={userProfilePicture}
                  alt={username}
                  className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-purple-400 shadow"
                />
                <h4 className="text-xl font-semibold text-purple-300 text-center mb-2">{title}</h4>
                <p className="text-sm text-gray-400 text-center mb-1">by {username}</p>
                <p className="text-sm text-gray-200 text-center line-clamp-3">{description}</p>
                <div className="flex justify-center gap-4 mt-4 text-sm text-purple-200">
                  <span>💬 {comments.length}</span>
                  <span>❤️ {likes}</span>
                </div>
              </motion.div>
            )})}
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