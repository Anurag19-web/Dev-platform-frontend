import { use, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

export const SignUpPage = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  function generateCustomId() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';

    const getRandom = (chars, length) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]);

    const upperChars = getRandom(upper, 3);
    const lowerChars = getRandom(lower, 7);
    const combined = [...upperChars, ...lowerChars];

    // Shuffle characters
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined.join('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const id = generateCustomId();

    try {
      const response = await fetch("https://dev-platform-backend.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Signup successful!");
        setFormData({ username: "", email: "", password: "" });
        console.log(formData);
        navigate("/home")
        localStorage.setItem("userId", JSON.stringify(id));
        console.log("Saved userId:", id);    
      } else {
        setMessage(`❌ ${data.message || "Signup failed"}`);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2e27ac] via-[#49265d]
     to-[#24355d] px-4 py-5 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-[#1f2937] bg-opacity-90 rounded-2xl shadow-2xl px-10 py-12"
      >
        <h2 className="text-4xl font-bold text-center mb-10">
          🚀 Sign Up for <span className="text-indigo-400">Dev-Platform</span>
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="username" className="block text-sm mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              required
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
              value={formData.email}
              onChange={handleChange}
              required
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
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-14 px-5 rounded-lg bg-[#2d3748] border border-indigo-600 text-white placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-4 text-xl rounded-full
             font-bold shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "🚀 Sign Up"}
          </motion.button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-yellow-300">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <NavLink to="/login">
          <span className="text-purple-300 underline cursor-pointer hover:text-white">
            Login
          </span>
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
};
