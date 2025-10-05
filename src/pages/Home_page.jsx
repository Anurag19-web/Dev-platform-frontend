import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSave, FaSearch, FaThumbsUp, FaTrash, FaComment, FaTimes, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FiMenu, FiSettings, FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { VoiceNavigator } from "./VoiceNavigator";
import { useSavedPosts } from "../context/SavedPostsContext";

export const HomePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Posts state and loading
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Comment box and inputs
  const [commentBoxOpenFor, setCommentBoxOpenFor] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // Read aloud state
  const [readingPostId, setReadingPostId] = useState(null);

  // Edit mode states
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Redux selector for theme
  const { bgTheme } = useSelector((state) => state.settings);

  // Saved posts context
  const { savedPosts, setSavedPosts } = useSavedPosts();
  // User ID and defaults
  const userId = JSON.parse(localStorage.getItem("userId"));
  const currentProfilePicture = localStorage.getItem("profilePicture");

  const BASE_URL = "https://dev-platform-backend.onrender.com";

  const [userMap, setUserMap] = useState({});

  // After fetching posts, extract unique userIds
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [
        ...new Set(
          posts.flatMap(p => [
            p.userId,
            ...p.likes.map(l => l.userId),
            ...p.comments.map(c => c.userId)
          ])
        )
      ];
      try {
        const res = await fetch(`${BASE_URL}/api/users?ids=${userIds.join(",")}`);
        const users = await res.json(); // array of { userId, username, profilePicture }
        const map = Object.fromEntries(users.map(u => [u.userId, u]));
        setUserMap(map);
      } catch (err) {
        console.error("Error fetching users for comments:", err);
      }
    };

    if (posts.length) fetchUsers();
  }, [posts]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/posts/feed/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.posts || []);
        console.log(data.posts);

      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  // Toggle like
  const toggleLike = async (post) => {
    if (!userId) {
      alert("Please log in to like posts.");
      return;
    }

    const liked = Array.isArray(post.likes) && post.likes.includes(userId);

    try {
      const url = `https://dev-platform-backend.onrender.com/api/posts/${post._id}/${liked ? "unlike" : "like"}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to update like");

      const result = await res.json();
      console.log(result);
      console.log(post._id, userId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id ? { ...p, likes: result.likes } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle save post
  const toggleSavePost = async (postId) => {
    if (!userId) {
      alert("Please log in to save posts.");
      return;
    }
    const alreadySaved = savedPosts.some(sp => sp._id === postId);
    const post = posts.find(p => p._id === postId);

    // Optimistic UI update
    setSavedPosts(prev =>
      alreadySaved
        ? prev.filter(sp => sp._id !== postId)
        : [...prev, post]
    );

    try {
      const res = await fetch(`${BASE_URL}/api/save/${userId}/save/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to toggle save");

      const data = await res.json();
      const syncedPosts = data.savedPosts.map(id => posts.find(p => p._id === id)).filter(Boolean);
      setSavedPosts(syncedPosts);
    } catch (err) {
      console.error(err);
      // Rollback on error
      setSavedPosts(prev =>
        alreadySaved ? [...prev, post] : prev.filter(sp => sp._id !== postId)
      );
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
    // Initialize editImages with current post images (assuming post.images)
    setEditImages(post.images || []);
    setImagesToRemove([]);
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.message === "Post deleted successfully") {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async (postId) => {
    try {
      let body;
      let headers;
      if (newImages.length > 0) {
        body = new FormData();
        body.append("userId", userId);
        body.append("content", editContent);
        body.append("removeImages", JSON.stringify(imagesToRemove));
        newImages.forEach(file => body.append("files", file));
        headers = {}; // Let browser set Content-Type (multipart)
      } else {
        body = JSON.stringify({
          userId,
          content: editContent,
          removeImages: imagesToRemove
        });
        headers = { "Content-Type": "application/json" };
      }

      const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers,
        body
      });

      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, ...data.post } : p))
        );
        setEditingPostId(null);
        setEditContent("");
        setEditImages([]);
        setImagesToRemove([]);
        setNewImages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const submitComment = async (postId) => {
    if (!userId) return;

    const text = commentInputs[postId];
    if (!text || text.trim() === "") return;

    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text }), // remove username
      });

      if (!res.ok) return;
      const result = await res.json(); // backend should return updated comments

      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, comments: result.comments || [] } // just use backend comments
            : p
        )
      );

      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!userId) return;

    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comment/${commentId}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      const result = await res.json(); // backend returns updated comments array

      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, comments: result.comments || [] } // just use backend comments
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const readPost = (postId, text) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported.");
      return;
    }

    if (readingPostId === postId) {
      speechSynthesis.cancel();
      setReadingPostId(null);
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Detect script
    const isHindi = /[\u0900-\u097F]/.test(text);
    const isGujarati = /[\u0A80-\u0AFF]/.test(text);

    // Pick a voice dynamically
    const voices = speechSynthesis.getVoices();

    if (isGujarati) {
      utterance.lang = "gu-IN";
      // Try to find a Gujarati voice
      const guVoice = voices.find(v => v.lang.toLowerCase().includes("gu"));
      if (guVoice) utterance.voice = guVoice;
      else {
        // fallback to Hindi if Gujarati voice unavailable
        utterance.lang = "hi-IN";
      }
    } else if (isHindi) {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setReadingPostId(null);

    setReadingPostId(postId);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative min-h-screen flex text-white overflow-hidden" style={{ background: bgTheme }}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-18 bg-[#1f2937] text-white p-6 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col items-center py-6 space-y-6 text-white text-2xl">
          <button onClick={() => navigate("/")} className="px-5 rounded hover:text-indigo-400">←</button>
          <button onClick={() => { navigate("/setting"); setSidebarOpen(false); }} className="hover:text-indigo-400" title="Settings"><FiSettings /></button>
          <button onClick={handleLogout} className="hover:text-indigo-400" title="Logout"><FiLogOut /></button>
          <VoiceNavigator />
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-red bg-opacity-50 z-30"></div>}

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-0 transition-all duration-300 ease-in-out w-full">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed w-full top-0 z-20 flex flex-col md:flex-row justify-between items-center px-4 py-4 shadow-md bg-[#1f2937] gap-4"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl hover:text-indigo-400 transition">
              <FiMenu />
            </button>
            <h1 className="text-2xl font-bold tracking-wide">Dev Platform</h1>
          </div>

          {/* Search */}
          <div onClick={() => navigate("/search")} className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full md:w-[300px] cursor-pointer">
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
              src={currentProfilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </NavLink>
        </motion.nav>

        {/* Main Intro */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 mt-55 md:p-10 lg:mt-17"
        >
          <h2 className="text-4xl font-bold mb-4 drop-shadow-xl">Welcome to the Dev Platform</h2>
          <p className="text-white/80 max-w-xl text-lg">
            Explore trending blogs, connect with developers, and grow your skills.
          </p>
        </motion.main>

        {/* Posts List */}
        <div className="p-4 space-y-6 max-w-xl mx-auto">
          {loadingPosts ? (
            <p className="text-white text-center py-4 animate-pulse">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-center">No posts yet.</p>
          ) : (
            posts.map((post, idx) => {
              const likedByUser = Array.isArray(post.likes) && post.likes.some(like => like.userId === userId);
              const isSaved = Array.isArray(savedPosts) && savedPosts.some(sp => sp._id === post._id);

              return (
                <motion.div
                  key={post._id || idx}
                  className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <div className="absolute top-7 right-4 flex gap-3">
                    {/* Edit/Delete only for your posts */}
                    {post.userId === userId && (
                      <>
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-yellow-400 hover:text-yellow-300 transition"
                          title="Edit Post"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-500 hover:text-red-400 transition"
                          title="Delete Post"
                        >
                          <FaTrash size={20} />
                        </button>
                      </>
                    )}

                    {/* Save is for everyone */}
                    <button
                      onClick={() => toggleSavePost(post._id)}
                      className="flex items-center gap-1 text-blue-400 transition-all duration-300 px-3 py-1 rounded-full border border-blue-400 hover:bg-blue-400 hover:text-white"
                      title="Save Post"
                    >
                      <FaSave size={16} />
                      <span className="text-sm">{isSaved ? "Saved" : "Save"}</span>
                    </button>
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4 cursor-pointer" onClick={() => navigate(`/userprofilesdata/${post.userId}`)}>
                    <img src={post.profilePicture || "user.png"} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                    <div>
                      <p className="text-white font-semibold">{post.username || "Unknown"}</p>
                      <p className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Edit mode */}
                  {editingPostId === post._id ? (
                    <div className="mb-4">
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full rounded-md px-3 py-2 text-white bg-gray-800"
                      />
                      {/* Existing images preview & remove */}
                      {editImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 my-3">
                          {editImages.map((img, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={img.url}
                                alt={`Edit image ${i}`}
                                className="rounded-xl w-full object-cover max-h-64"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditImages(prev => prev.filter((_, idx) => idx !== i));
                                  setImagesToRemove(prev => [...prev, img._id || img.url]);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* New images preview & remove */}
                      {newImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 my-3">
                          {newImages.map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New image ${idx}`}
                                className="rounded-xl w-full object-cover max-h-64"
                              />
                              <button
                                type="button"
                                onClick={() => setNewImages(prev => prev.filter((_, j) => j !== idx))}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 opacity-90 hover:opacity-100 transition-opacity duration-150"
                                title="Remove new image"
                                aria-label="Remove new image"
                              >
                                <FaTimes size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Image upload input */}
                      <div className="mb-3 flex flex-col gap-2 text-white">
                        <label
                          htmlFor={`file-upload-edit-${post._id}`}
                          className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow transition"
                        >
                          <FaPlusCircle className="text-lg" />
                          <span>Add Images</span>
                        </label>
                        <input
                          id={`file-upload-edit-${post._id}`}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={e => setNewImages(Array.from(e.target.files))}
                          className="hidden"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(post._id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
                          Save
                        </button>
                        <button onClick={() => setEditingPostId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-200 text-base leading-relaxed mb-4">
                        {post.content}
                      </p>
                      {Array.isArray(post.images) && post.images.length > 0 && (
                        <div className="relative w-full h-85 overflow-hidden rounded-xl">
                          <motion.img
                            key={post.images[currentImageIndex[post._id] || 0].url}
                            src={post.images[currentImageIndex[post._id] || 0].url}
                            alt={`Post image`}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />

                          {/* Left arrow */}
                          {post.images.length > 1 && (
                            <button
                              onClick={() =>
                                setCurrentImageIndex((prev) => ({
                                  ...prev,
                                  [post._id]:
                                    (prev[post._id] || 0) === 0
                                      ? post.images.length - 1
                                      : (prev[post._id] || 0) - 1,
                                }))
                              }
                              className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                            >
                              <FaArrowLeft size={20} />
                            </button>
                          )}

                          {/* Right arrow */}
                          {post.images.length > 1 && (
                            <button
                              onClick={() =>
                                setCurrentImageIndex((prev) => ({
                                  ...prev,
                                  [post._id]:
                                    (prev[post._id] || 0) === post.images.length - 1
                                      ? 0
                                      : (prev[post._id] || 0) + 1,
                                }))
                              }
                              className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                            >
                              <FaArrowRight size={20} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Likes count */}
                  <div
                    onClick={() => navigate(`/likes/${post._id}`)}
                    className="text-sm text-gray-400 hover:text-blue-400 cursor-pointer mb-2 mt-2"
                  >
                    {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-6 mb-2 text-gray-300">
                    <button onClick={() => toggleLike(post)} className={`flex items-center gap-1 ${post.likes.includes(userId) || likedByUser ? "text-blue-400" : "text-gray-400 hover:text-blue-400"}`}>
                      <FaThumbsUp /> <span>{post.likes.length}</span>
                    </button>
                    <button onClick={() => setCommentBoxOpenFor(commentBoxOpenFor === post._id ? null : post._id)} className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition">
                      <FaComment /> <span>{post.comments.length}</span>
                    </button>
                    <button onClick={() => readPost(post._id, `${post.username || "Someone"} says: ${post.content}`)} className={`flex items-center gap-1 ${readingPostId === post._id ? "text-red-400" : "text-gray-400 hover:text-yellow-400"}`}>
                      {readingPostId === post._id ? "⏹ Stop" : "🔊 Read"}
                    </button>

                    {/* Action buttons */}
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() =>
                          setShowShareMenu(showShareMenu === post._id ? null : post._id)
                        }
                        className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition"
                      >
                        🔄 <span>Share</span>
                      </button>
                    </div>

                    {/* ✅ Share menu */}
                    {showShareMenu === post._id && (
                      <div className="absolute right-10 top-10 bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col gap-2 z-50">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `${window.location.origin}/allposts/${post.userId}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:underline"
                        >
                          📲 WhatsApp
                        </a>

                        {/* Gmail */}
                        <button
                          onClick={() => {
                            const link = `${window.location.origin}/allposts/${post.userId}`;

                            const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

                            if (isMobile) {
                              // 📱 Mobile → opens default Gmail app (via mailto)
                              window.location.href = `mailto:?subject=Check this post&body=${encodeURIComponent(link)}`;
                            } else {
                              // 💻 Desktop → opens Gmail in browser
                              window.open(
                                `https://mail.google.com/mail/?view=cm&fs=1&to=&su=Check this post&body=${encodeURIComponent(link)}`,
                                "_blank"
                              );
                            }
                          }}
                          className="text-blue-400 hover:underline"
                        >
                          📧 Gmail
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${window.location.origin}/allposts/${post.userId}`
                            )
                          }
                          className="text-gray-300 hover:text-white"
                        >
                          📋 Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Comment input and comments UI */}
                  {commentBoxOpenFor === post._id && (
                    <div className="mt-2">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post._id] || ""}
                          onChange={e => handleCommentChange(post._id, e.target.value)}
                          className="flex-1 rounded-md px-3 py-1 text-white bg-gray-800"
                        />
                        <button onClick={() => submitComment(post._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-md">
                          Send
                        </button>
                      </div>
                      {post.comments.length > 0 && (
                        <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                          {post.comments.map((comment, idx) => {
                            const commentUser = comment.user || userMap[comment.userId] || { username: "Unknown", profilePicture: "user.png" };
                            return (
                              <div key={idx} className="flex items-center gap-2">
                                <img src={commentUser.profilePicture} alt="Comment user" className="w-6 h-6 rounded-full cursor-pointer" onClick={() => navigate(`/userprofilesdata/${comment.userId}`)}/>
                                <div>
                                  <span className="font-semibold text-white cursor-pointer" onClick={() => navigate(`/userprofilesdata/${comment.userId}`)}>{commentUser.username}</span>{" "}
                                  <span className="text-gray-300">{comment.text}</span>
                                  {comment.userId === userId && (
                                    <button onClick={() => deleteComment(post._id, comment._id)} className="text-red-400 hover:text-red-600 text-xs ml-2">
                                      ❌
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
