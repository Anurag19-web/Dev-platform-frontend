import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSave, FaSearch, FaThumbsUp } from "react-icons/fa";
import { FiMenu, FiSettings, FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { VoiceNavigator } from "./VoiceNavigator";
import { useSavedPosts } from "../context/SavedPosts";

export const HomePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Posts state and loading
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Track which post's comment box is open
  const [commentBoxOpenFor, setCommentBoxOpenFor] = useState(null);
  // Track comment input values per post
  const [commentInputs, setCommentInputs] = useState({});

  const { bgTheme } = useSelector((state) => state.settings);
  const [readingPostId, setReadingPostId] = useState(null);
  const { savedPosts, setSavedPosts } = useSavedPosts();

  const userId = JSON.parse(localStorage.getItem("userId"));

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Fetch posts with user info on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://dev-platform-backend.onrender.com/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");

        let data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  // Like / Unlike handlers
  const toggleLike = async (post) => {
    if (!userId) {
      alert("Please log in to like posts.");
      return;
    }

    const liked = post.likes.some((likeUser) => likeUser.userId === userId);

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
      console.log(post._id);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id ? { ...p, likes: result.likes } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Comment handlers
  const handleCommentChange = (postId, text) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const deleteComment = async (postId, commentId) => {
    if (!userId) {
      alert("Please log in to delete comments.");
      return;
    }

    try {
      const res =
        await fetch(
          `https://dev-platform-backend.onrender.com/api/posts/${postId}/comment/${commentId}?userId=${userId}`,
          {
            method: "DELETE",
          }
        );

      if (!res.ok) throw new Error("Failed to delete comment");

      const result = await res.json();
      // Update state with updated comments
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: result.comments } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Updated readPost to toggle reading and stop
  const readPost = (postId, text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    // If the same post is currently being read, stop it
    if (readingPostId === postId) {
      speechSynthesis.cancel();
      setReadingPostId(null);
      return;
    }

    // Stop any ongoing speech before starting a new one
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setReadingPostId(null);
    setReadingPostId(postId);
    speechSynthesis.speak(utterance);
  };

  const submitComment = async (postId) => {
    if (!userId) {
      alert("Please log in to comment.");
      return;
    }
    const text = commentInputs[postId];
    if (!text || text.trim() === "") return;

    const user = posts.find(p => p.user?.userId === userId)?.user;
    const username = user?.username || "Unknown";

    try {
      const res = await fetch(
        `https://dev-platform-backend.onrender.com/api/posts/${postId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text, username }),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      const result = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: result.comments } : p
        )
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post URL copied to clipboard!");
  };

  const toggleSavePost = async (postId) => {
    if (!userId) return alert("Please log in to save posts.");

    const alreadySaved = savedPosts.some(sp => sp._id === postId);
    const post = posts.find(p => p._id === postId);

    // Optimistic toggle: immediately update UI
    setSavedPosts(prev =>
      alreadySaved
        ? prev.filter(sp => sp._id !== postId)
        : [...prev, post]
    );

    try {
      const res = await fetch(
        `https://dev-platform-backend.onrender.com/api/save/${userId}/save/${postId}`,
        { method: "PATCH", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Failed to toggle save");

      // backend returns only IDs, so we map them to post objects for UI
      const data = await res.json();
      const syncedPosts = data.savedPosts.map(id => posts.find(p => p._id === id)).filter(Boolean);
      setSavedPosts(syncedPosts);
    } catch (err) {
      console.error(err);
      // revert toggle if error
      setSavedPosts(prev =>
        alreadySaved
          ? [...prev, post]
          : prev.filter(sp => sp._id !== postId)
      );
    }
  };


  return (
    <div
      className="relative min-h-screen flex text-white overflow-hidden"
      style={{ background: bgTheme }}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-18 bg-[#1f2937] text-white p-6 z-40
           transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col items-center py-6 space-y-6 text-white text-2xl">
          <button onClick={() => navigate("/")} className="px-5 rounded hover:text-indigo-400">
            ←
          </button>
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
          <button onClick={handleLogout} className="hover:text-indigo-400" title="Logout">
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
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-0 transition-all duration-300 ease-in-out w-full">
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
            <h1 className="text-2xl font-bold tracking-wide">Dev Platform</h1>
          </div>

          {/* Search */}
          <div
            onClick={() => navigate("/search")}
            className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full md:w-[300px] cursor-pointer"
          >
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
              src={posts[0]?.user?.profilePicture || "user.png"}
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
          className="p-6 md:p-10"
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
            posts.map((post, index) => {
              const likedByUser = Array.isArray(post.likes) && post.likes.some(
                (likeUser) => likeUser.userId === userId
              );

              const isSaved = Array.isArray(savedPosts) && savedPosts.some(
                (saved) => saved._id === post._id
              );

              return (
                <motion.div
                  key={post._id || index}
                  className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >

                  {/* Header */}
                  <div className="flex items-center justify-between p-4">
                    {/* Left: Avatar + Username */}
                    <div className="flex items-center gap-3">
                      <img
                        src={post.user?.profilePicture || `https://i.pravatar.cc/40?u=${post.userId}`}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full border border-gray-600"
                      />
                      <p className="text-white font-medium">{post.user?.username || "Unknown User"}</p>
                    </div>

                    {/* Right: Read + Save buttons */}
                    <div className="flex items-center gap-2">
                      {/* Read aloud button */}
                      <button
                        onClick={() =>
                          readPost(
                            post._id,
                            `${post.user?.username || "Someone"} says: ${post.content}`
                          )
                        }
                        className={`flex items-center gap-1 transition px-3 py-1 rounded-full border ${readingPostId === post._id
                          ? "text-red-400 border-red-400 hover:text-red-600 hover:border-red-600"
                          : "text-gray-400 border-gray-400 hover:text-yellow-400 hover:border-yellow-400"
                          }`}
                      >
                        {readingPostId === post._id ? "⏹ Stop" : "🔊 Read"}
                      </button>

                      {/* Save button */}
                      <button
                        onClick={() => toggleSavePost(post._id)}
                        className="flex items-center gap-1 text-blue-400  transition-all duration-300 px-3 py-1 rounded-full border border-blue-400 hover:bg-blue-400 hover:text-white"
                        title="Save Post"
                      >
                        <FaSave size={16} />
                        <span className="text-sm">
                          {Array.isArray(savedPosts) && savedPosts.some(sp => sp._id === post._id)
                            ? "Saved"
                            : "Save"}
                        </span>

                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-4">
                    <p className="text-gray-200 mb-3">{post.content}</p>
                    {post.image && (
                      <motion.img
                        src={post.image}
                        alt="Post"
                        className="rounded-xl w-full object-cover max-h-96"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col px-4 py-3 border-t border-gray-700">
                    {/* Likes count */}
                    <div
                      onClick={() => navigate(`/likes/${post._id}`)}
                      className="text-sm text-gray-400 hover:text-blue-400 cursor-pointer mb-2"
                    >
                      {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      {/* Like button */}
                      <button
                        onClick={() => toggleLike(post)}
                        className={`flex items-center gap-1 transition ${post.likes.includes(userId) || likedByUser ? "text-blue-400" : "text-gray-400 hover:text-blue-400"
                          }`}
                      >
                        <FaThumbsUp
                          className={`text-lg transition ${likedByUser ? "fill-current" : ""}`}
                        />
                        <span>{likedByUser ? "Liked" : "Like"}</span>
                      </button>

                      {/* Comment button */}
                      <button
                        onClick={() =>
                          setCommentBoxOpenFor(commentBoxOpenFor === post._id ? null : post._id)
                        }
                        className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition"
                      >
                        💬 <span>Comment ({post.comments.length})</span>
                      </button>

                      {/* Share button */}
                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition"
                      >
                        🔄 <span>Share</span>
                      </button>
                    </div>

                    {/* Comment input */}
                    {commentBoxOpenFor === post._id && (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInputs[post._id] || ""}
                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            className="flex-1 rounded-md px-3 py-1 text-white bg-gray-800"
                          />
                          <button
                            onClick={() => submitComment(post._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-md"
                          >
                            Send
                          </button>
                        </div>

                        {/* Show comments */}
                        {post.comments.length > 0 && (
                          <div className="mb-2 max-h-40 overflow-y-auto text-sm space-y-2 mt-2">
                            {post.comments.map((comment, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <img
                                  src={comment.user?.profilePicture || "user.png"}
                                  alt="Comment user"
                                  className="w-6 h-6 rounded-full"
                                />
                                <div>
                                  <span className="font-semibold text-white">
                                    {comment.user?.username || "Unknown"}
                                  </span>{" "}
                                  <span className="text-gray-300">{comment.text}</span>
                                  {/* Show delete button if logged-in user owns the comment */}
                                  {comment.user?.userId === userId && (
                                    <button
                                      onClick={() => deleteComment(post._id, comment._id)}
                                      className="text-red-400 hover:text-red-600 text-xs ml-2"
                                    >
                                      ❌
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
