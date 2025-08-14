import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, selectUsers } from "../slices/usersSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

export const SearchPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allUsers = useSelector(selectUsers);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (allUsers.length === 0) {
            dispatch(fetchUsers());
        }
    }, [allUsers.length, dispatch]);

    const filteredUsers = query
        ? allUsers.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white max-w-4xl mx-auto flex flex-col">
            {/* Container for back button + search bar */}
            <div className="flex items-center mb-8 gap-3">
                {/* Back button with round border */}
                <button
                    onClick={() => navigate(-1)}
                    className="
            p-2
            rounded-full
            bg-gray-800/70
            hover:bg-gray-700
            active:bg-gray-600
            transition
            focus:outline-none
            flex
            items-center
            justify-center
            text-white
            shadow-md
          "
                    aria-label="Go Back"
                    type="button"
                >
                    <FiArrowLeft size={24} />
                </button>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search for a user..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="
            flex-grow
            py-3
            px-4
            rounded-full
            bg-gray-800
            text-white
            placeholder-gray-400
            outline-none
            shadow-lg
            transition
            focus:ring-4
            focus:ring-indigo-500
            focus:ring-opacity-70
            sm:text-lg
          "
                />
            </div>

            {/* Search Results */}
            <AnimatePresence>
                {filteredUsers.length > 0 ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user.userId}
                                onClick={() => navigate(`/userprofilesdata/${user.userId}`)}
                                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  bg-gray-800
                  rounded-xl
                  cursor-pointer
                  hover:bg-indigo-600
                  hover:shadow-lg
                  transition
                  transform
                  hover:scale-105
                  select-none
                  border
                  border-gray-700
                "
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(99,102,241,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img
                                    src={user.profilePicture || "/user.png"}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                    loading="lazy"
                                />
                                <span className="font-semibold text-lg">{user.username}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    query && (
                        <motion.p
                            key="no-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-400 text-center mt-12 select-none"
                        >
                            No users found for &quot;{query}&quot;.
                        </motion.p>
                    )
                )}
            </AnimatePresence>
        </div>
    );
};