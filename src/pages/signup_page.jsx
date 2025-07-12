import { motion } from "framer-motion";

export const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2e27ac] via-[#49265d]
     to-[#24355d] px-4 py-10 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-[#1f2937] bg-opacity-90 rounded-2xl shadow-2xl px-10 py-12"
      >
        <h2 className="text-4xl font-bold text-center mb-10">
          🚀 Sign Up for <span className="text-indigo-400">Dev-Platform</span>
        </h2>

        <form className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full h-14 px-5 rounded-lg bg-[#2d3748] border border-indigo-600 text-white placeholder-white-400
               focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@devmail.com"
              className="w-full h-14 px-5 rounded-lg bg-[#2d3748] border border-indigo-600 text-white placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full h-14 px-5 rounded-lg bg-[#2d3748] border border-indigo-600 text-white placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-4 text-xl rounded-full
             font-bold shadow-lg hover:shadow-2xl transition-all"
          >
            🚀 Sign Up
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span className="text-purple-300 underline cursor-pointer hover:text-white">
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};
