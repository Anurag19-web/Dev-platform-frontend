import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  Globe,
  Lock,
  X,
  Mic,
  MicOff,
} from "lucide-react";
import { FiLogOut, FiMenu, FiSettings } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { VoiceNavigator } from "../pages/VoiceNavigator";
import { FaSearch } from "react-icons/fa";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-US");
  const currentProfilePicture = localStorage.getItem("profilePicture");

  const recognitionRef = useRef(null);

  const userId = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();

  // Start listening
  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang; // dynamic language

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setContent(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFile((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setFilePreview((prev) => [...prev, ...newPreviews]);
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

    imageFile.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("https://dev-platform-backend.onrender.com/api/posts",
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

      setContent("");
      setImageFile([]);
      setFilePreview([]);
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
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Dev Platform
          </h1>
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
              src={currentProfilePicture || "user.png"}
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
        {/* Language Selection */}
        <div className="flex items-center gap-3 mb-3">
          <label className="text-gray-300">🎙️ Speech Language:</label>
          <select
            value={speechLang}
            onChange={(e) => setSpeechLang(e.target.value)}
            className="p-2 rounded-xl bg-gray-800 text-white border border-gray-700"
          >
            <option value="en-US">English (US)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="gu-IN">ગુજરાતી (Gujarati)</option>
          </select>
        </div>

        {/* Textarea + Mic Button */}
        <div className="relative mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something amazing..."
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            rows={3}
            required
          />

          {!isListening ? (
            <button
              type="button"
              onClick={startListening}
              className="absolute bottom-3 right-3 text-green-400 hover:text-green-500"
              title="Start Voice Input"
            >
              <Mic size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={stopListening}
              className="absolute bottom-3 right-3 text-red-400 hover:text-red-500"
              title="Stop Voice Input"
            >
              <MicOff size={20} />
            </button>
          )}
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
            multiple
            onChange={handleImageFileChange}
            className="hidden"
          />
        </div>

        {/* Image Preview */}
        {filePreview.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-3">
            {filePreview.map((preview, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden border border-gray-700"
              >
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-28 h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFilePreview((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                    setImageFile((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Visibility */}
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-gray-300">
            {visibility === "public" ? (
              <Globe size={18} />
            ) : (
              <Lock size={18} />
            )}
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
