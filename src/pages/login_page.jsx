import { motion } from "framer-motion";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        localStorage.setItem("userId", JSON.stringify(data.id));
        console.log("Logged in as:", data.username);
        navigate("/home");
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] px-4 py-10 text-white font-sans">
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
              className="w-full h-14 pl-10 pr-4 rounded-lg bg-[#2d3748] border border-indigo-600 text-white placeholder-gray-400
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
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full h-14 pl-10 pr-4 rounded-lg bg-[#2d3748] border border-indigo-600 text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-4 text-xl rounded-full font-bold shadow-lg hover:shadow-2xl transition-all"
          >
            🔐 Login
          </motion.button>
        </form>

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
