import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Send,
  Image as ImageIcon,
  FileUp,
  Globe,
  Lock,
  X,
} from "lucide-react";
import { FiLogOut, FiMenu, FiSettings } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { VoiceNavigator } from "../pages/VoiceNavigator";
import { FaSearch } from "react-icons/fa";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibility, setVisibility] = useState("public");

  const userId = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDocFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    if (!userId) {
      alert("You must be logged in to create a post");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", content);
    formData.append("visibility", visibility);
    if (imageFile) formData.append("image", imageFile);
    if (docFile) formData.append("document", docFile);

    try {
      const res = await fetch(
        "https://dev-platform-backend.onrender.com/api/posts",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create post");
      }

      const data = await res.json();
      console.log("Post created:", data);

      // Reset form
      setContent("");
      setImageFile(null);
      setFilePreview("");
      setDocFile(null);
      setVisibility("public");

      navigate("/home");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Error creating post: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-18 bg-[#1f2937] text-white p-6 z-40
                 transform transition-transform duration-300 ease-in-out ${
                   sidebarOpen ? "translate-x-0" : "-translate-x-full"
                 }`}
      >
        <div className="flex flex-col items-center py-2 space-y-6 text-white text-2xl">
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
        />
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
          <h1 className="text-2xl font-bold tracking-wide text-white">Dev Platform</h1>
        </div>

        <div
          onClick={() => navigate("/search")}
          className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full md:w-[300px] cursor-pointer"
        >
          <FaSearch className="text-white/80 mr-2" />
          <span className="bg-transparent outline-none w-full placeholder-white/70 text-white">
            Search Users
          </span>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/userprofile">
            <img
              src={"user.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </NavLink>
        </div>
      </motion.nav>

      {/* Back Button */}
      <div className="max-w-xl mx-auto mt-6">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
        >
          <span>←</span> Back
        </motion.button>
      </div>

      {/* Create Post Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-900 rounded-2xl shadow-lg max-w-xl mx-auto border border-gray-700 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something amazing..."
          className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all mb-3 resize-none"
          rows={3}
          required
        />

        {/* Image URL input (optional) */}
        <div className="flex items-center mb-3">
          <Camera className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            value={filePreview ? "" : ""}
            disabled
            placeholder={filePreview ? "" : "Use file upload below for images"}
            className="flex-1 p-2 rounded-xl bg-gray-800 text-white border border-gray-700 cursor-not-allowed"
          />
        </div>

        {/* File Uploads */}
        <div className="flex items-center gap-3 mb-3">
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer"
          >
            <ImageIcon size={18} />
            Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          <label
            htmlFor="doc-upload"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer"
          >
            <FileUp size={18} />
            Upload Document
          </label>
          <input
            id="doc-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleDocFileChange}
            className="hidden"
          />
        </div>

        {/* Image Preview */}
        {filePreview && (
          <div className="mb-3 rounded-xl overflow-hidden border border-gray-700 relative inline-block">
            <img
              src={filePreview}
              alt="Preview"
              className="w-28 h-28 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setFilePreview("");
                setImageFile(null);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Document Preview */}
        {docFile && (
          <div className="flex items-center justify-between p-3 mb-3 bg-gray-800 rounded-xl border border-gray-700 text-gray-300">
            <div className="flex items-center gap-2">
              <FileUp size={18} />
              <span className="truncate max-w-[200px]">{docFile.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setDocFile(null)}
              className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Visibility */}
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-gray-300">
            {visibility === "public" ? <Globe size={18} /> : <Lock size={18} />}
            Visibility:
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="p-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-xl font-medium shadow-md transition-all"
        >
          <Send size={18} className="mr-2" /> Post
        </button>
      </motion.form>
    </div>
  );
};
