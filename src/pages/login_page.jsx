import { motion } from "framer-motion";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { bgTheme } = useSelector((state) => state.settings);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://dev-platform-backend.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful");
        localStorage.setItem("userId", JSON.stringify(data.userId));
        console.log(data.userId);
        console.log("Logged in as:", data.username);
        navigate("/home");
      } else {
        setMessage(`${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 text-white font-sans" style={{ background: bgTheme }}>
      {/* Back Button outside the card */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 bg-gray-700/70 px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md z-50"
      >
        ← Back
      </button>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-[#1f2937] bg-opacity-90 rounded-2xl shadow-2xl px-10 py-12"
      >
        <h2 className="text-4xl font-bold text-center mb-10">
          🔐 Login to <span className="text-indigo-400">Dev-Platform</span>
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@devmail.com"
              className="w-full h-14 pl-10 pr-4 rounded-lg bg-[#2d3748] border border-indigo-600 text-white
              focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm mb-2 font-medium">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full h-14 pl-10 pr-12 rounded-lg bg-[#2d3748] border border-indigo-600 text-white
    focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />

            {/* 👁️ Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-2/3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            transition={{ duration: 0.3 }}
            className={`w-full py-4 text-xl rounded-full font-bold shadow-lg transition-all ${loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:shadow-2xl"
              }`}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </motion.button>

        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <NavLink to="/signup">
            <span className="text-purple-300 underline cursor-pointer hover:text-white">
              Sign Up
            </span>
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
};
