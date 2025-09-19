import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaComment, FaTrash, FaArrowLeft, FaPlusCircle, FaSearch } from "react-icons/fa";
import { FiMenu, FiSettings, FiLogOut } from "react-icons/fi";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { VoiceNavigator } from "../pages/VoiceNavigator";

const BASE_URL = "https://dev-platform-backend.onrender.com";

export const AllPosts = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { bgTheme } = useSelector((state) => state.settings);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentBoxOpenFor, setCommentBoxOpenFor] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [readingPostId, setReadingPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]); // Images currently shown in edit mode
  const [imagesToRemove, setImagesToRemove] = useState([]); // IDs or URLs of images marked for removal
  const [newImages, setNewImages] = useState([]); // Newly selected image files

  const currentUserId = JSON.parse(localStorage.getItem("userId"));
  const currentUsername = JSON.parse(localStorage.getItem("username")) || "You";
  const currentProfilePicture = localStorage.getItem("profilePicture");

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      console.log(data);

      const postsWithUser = (data.posts || []).map((post) => ({
        ...post,
        user: {
          userId: post.userId,
          username: post.username || "Unknown",
          profilePicture: post.profilePicture || "user.png",
        },
        comments: (post.comments || []).map((comment) => ({
          ...comment,
          user: comment.user || { username: "Unknown" },
        })),
      }));

      setPosts(postsWithUser);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
    // Initialize editImages with current post images (assuming post.images)
    setEditImages(post.images || []);
    setImagesToRemove([]);
  };

  const saveEdit = async (postId) => {
    try {
      let body;
      let headers;
      if (newImages.length > 0) {
        body = new FormData();
        body.append("userId", currentUserId);
        body.append("content", editContent);
        body.append("removeImages", JSON.stringify(imagesToRemove));
        newImages.forEach(file => body.append("files", file));
        headers = {}; // Let browser set Content-Type (multipart)
      } else {
        body = JSON.stringify({
          userId: currentUserId,
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

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}?userId=${currentUserId}`, {
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

  const toggleLike = async (post) => {
    if (!currentUserId) return alert("Please log in to like posts.");
    const liked = post.likes.includes(currentUserId);
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post._id}/${liked ? "unlike" : "like"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const result = await res.json();
      setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, likes: result.likes } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const submitComment = async (postId) => {
    if (!currentUserId) return;
    const text = commentInputs[postId];
    if (!text || text.trim() === "") return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, text, username: currentUsername }),
      });
      if (!res.ok) return;
      const result = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              comments: (result.comments || []).map((comment) => ({
                ...comment,
                user:
                  comment.user ||
                  (comment.userId === currentUserId
                    ? { userId: currentUserId, username: currentUsername, profilePicture: currentProfilePicture }
                    : { username: "Unknown" }),
              })),
            }
            : p
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comment/${commentId}?userId=${currentUserId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              comments: (result.comments || []).map((comment) => ({
                ...comment,
                user:
                  comment.user ||
                  (comment.userId === currentUserId
                    ? { userId: currentUserId, username: currentUsername, profilePicture: currentProfilePicture }
                    : { username: "Unknown" }),
              })),
            }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const readPost = (postId, text) => {
    if (!("speechSynthesis" in window)) return alert("Text-to-speech not supported.");

    if (readingPostId === postId) {
      speechSynthesis.cancel();
      setReadingPostId(null);
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const isHindi = /[\u0900-\u097F]/.test(text);
    const isGujarati = /[\u0A80-\u0AFF]/.test(text);

    if (isHindi) {
      utterance.lang = "hi-IN";
    } else if (isGujarati) {
      utterance.lang = "gu-IN"
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setReadingPostId(null);

    setReadingPostId(postId);
    speechSynthesis.speak(utterance);
  };

  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post URL copied!");
  };

  return (
    <div className="relative min-h-screen flex text-white overflow-hidden" style={{ background: bgTheme }}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-18 bg-[#1f2937] text-white p-6 z-40
        transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col items-center py-6 space-y-6 text-white text-2xl">
          <button onClick={() => navigate(-1)} className="px-4 rounded hover:text-indigo-400">←</button>
          <button onClick={() => { navigate("/setting"); setSidebarOpen(false); }} className="hover:text-indigo-400" title="Settings"><FiSettings /></button>
          <button onClick={handleLogout} className="hover:text-indigo-400" title="Logout"><FiLogOut /></button>
          <VoiceNavigator />
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-red bg-opacity-50 z-30"></div>}

      <div className="flex-1 ml-0 md:ml-0 transition-all duration-300 ease-in-out w-full">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed w-full top-0 z-20 flex flex-col md:flex-row justify-between items-center px-4 py-4 shadow-md bg-[#1f2937] gap-4"
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
              src={posts[0]?.profilePicture || currentProfilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </NavLink>
        </motion.nav>

        {/* Posts List */}
        <div className="p-4 space-y-6 max-w-3xl mx-auto mt-55 lg:mt-20">
          {/* Back Button */}
          <button
            onClick={() => navigate("/userprofile")}
            className="flex items-center gap-2 text-white bg-gray-800/70 hover:bg-gray-700 px-4 py-2 rounded-full mb-4 shadow-md transition"
          >
            <FaArrowLeft /> Back
          </button>
          {loadingPosts ? (
            <p className="text-white text-center py-4 animate-pulse">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-center">No posts yet.</p>
          ) : (
            posts.map((post, idx) => (
              <motion.div
                key={post._id || idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 relative"
              >
                {post.userId === currentUserId && (
                  <div className="absolute top-7 right-4 flex gap-3">
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
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img src={post.user?.profilePicture || currentProfilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                  <div>
                    <p className="text-white font-semibold">{post.user?.username || "Unknown"}</p>
                    <p className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {editingPostId === post._id ? (
                  <div className="mb-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-white bg-gray-800"
                    />

                    {editImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {editImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <motion.img
                              src={img.url}
                              alt={`Editing image ${i}`}
                              className="rounded-xl w-full object-cover max-h-64"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                // Remove from editImages and add to imagesToRemove for backend
                                setEditImages((prev) => prev.filter((_, idx) => idx !== i));
                                setImagesToRemove((prev) => [...prev, img._id || img.url]);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {newImages.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {newImages.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {newImages.map((file, idx) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`New image preview ${idx}`}
                                      className="rounded-xl w-full object-cover max-h-64"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setNewImages(prev => prev.filter((_, j) => j !== idx))}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* IMAGE UPLOAD INPUT */}
                        <div className="mb-3 flex flex-col gap-2 text-white">
                          <label htmlFor="file-upload-edit" className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow transition">
                            <FaPlusCircle className="text-lg" />
                            <span>Add Images</span>
                          </label>
                          <input
                            id="file-upload-edit"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={e => setNewImages(Array.from(e.target.files))}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(post._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
                      >
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
                      <div className="grid grid-cols-2 gap-2">
                        {post.images.map((img, i) => (
                          <motion.img
                            key={i}
                            src={img.url}
                            alt={`Post image ${i}`}
                            className="rounded-xl w-full object-cover max-h-96"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {post.image && <motion.img src={post.image} alt="Post" className="w-full max-h-96 object-cover rounded-2xl mb-4 border border-gray-600" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} />}
                {/* Likes count */}
                <div
                  onClick={() => navigate(`/likes/${post._id}`)}
                  className="text-sm text-gray-400 hover:text-blue-400 cursor-pointer mb-2 mt-2"
                >
                  {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-6 mb-2 text-gray-300">
                  <button onClick={() => toggleLike(post)} className={`flex items-center gap-1 ${post.likes.includes(currentUserId) ? "text-blue-400" : "text-gray-400 hover:text-blue-400"}`}>
                    <FaThumbsUp /> <span>{post.likes.length}</span>
                  </button>

                  <button onClick={() => setCommentBoxOpenFor(commentBoxOpenFor === post._id ? null : post._id)} className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition">
                    <FaComment /> <span>{post.comments.length}</span>
                  </button>

                  <button onClick={() => readPost(post._id, `${post.user?.username || "Someone"} says: ${post.content}`)} className={`flex items-center gap-1 ${readingPostId === post._id ? "text-red-400" : "text-gray-400 hover:text-yellow-400"}`}>
                    {readingPostId === post._id ? "⏹ Stop" : "🔊 Read"}
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition"
                  >
                    🔄 <span>Share</span>
                  </button>
                </div>

                {/* Comment input */}
                {commentBoxOpenFor === post._id && (
                  <div className="mt-2">
                    <div className="flex gap-2 mb-2">
                      <input type="text" placeholder="Write a comment..." value={commentInputs[post._id] || ""} onChange={(e) => handleCommentChange(post._id, e.target.value)} className="flex-1 rounded-md px-3 py-1 text-white bg-gray-800" />
                      <button onClick={() => submitComment(post._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-md">Send</button>
                    </div>

                    {post.comments.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img src={comment.user?.profilePicture || "user.png"} alt="Comment user" className="w-6 h-6 rounded-full" />
                            <div>
                              <span className="font-semibold text-white">{comment.user?.username || "Unknown"}</span>{" "}
                              <span className="text-gray-300">{comment.text}</span>
                              {comment.user?.userId === currentUserId && (
                                <button onClick={() => deleteComment(post._id, comment._id)} className="text-red-400 hover:text-red-600 text-xs ml-2">❌</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
