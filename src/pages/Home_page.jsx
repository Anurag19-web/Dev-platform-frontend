import { motion } from "framer-motion";
import { FaSearch, FaUserCircle } from "react-icons/fa";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center px-4 py-4 shadow-md backdrop-blur-sm bg-white/10"
      >
        {/* Logo/Title */}
        <h1 className="text-2xl font-bold tracking-wide">Dev Platform</h1>

        {/* Search Box */}
        <div className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full max-w-xs md:max-w-sm">
          <FaSearch className="text-white/80 mr-2" />
          <input
            type="text"
            placeholder="Search blogs or users"
            className="bg-transparent outline-none w-full placeholder-white/70 text-white"
          />
        </div>

        {/* User Profile Icon */}
        <FaUserCircle className="text-3xl text-white ml-4 cursor-pointer" />
      </motion.nav>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 md:p-10"
      >
        <h2 className="text-3xl font-semibold mb-4">Welcome to the Dev Platform</h2>
        <p className="text-white/80 max-w-xl">
          Explore trending blogs, connect with other developers, and grow your skills.
        </p>
      </motion.main>
    </div>
  );
};