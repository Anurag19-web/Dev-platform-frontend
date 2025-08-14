import { createContext, useContext, useState, useEffect } from "react";

const SavedPostsContext = createContext();

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const userId = JSON.parse(localStorage.getItem("userId")); // stored as plain string

  useEffect(() => {
    if (!userId) return;

    // Remove quotes if they exist
    // const cleanUserId = userId.replace(/^"|"$/g, "");

    fetch(`https://dev-platform-backend.onrender.com/api/save/${userId}/saved`)
      .then((res) => res.json())
      .then((data) => setSavedPosts(data))
      .catch((err) => console.error("Error fetching saved posts:", err));
  }, [userId]);

  const removeSavedPost = async (postId) => {
    try {
      await fetch(`https://dev-platform-backend.onrender.com/api/save/${userId}/${postId}`, {
        method: "DELETE",
      });

      // Update state immediately
      setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error removing saved post:", err);
    }
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, setSavedPosts, removeSavedPost }}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => useContext(SavedPostsContext);
