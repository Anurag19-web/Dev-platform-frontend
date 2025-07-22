import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export const FollowList = () => {
  const {id} = useParams();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  // const id = JSON.parse(localStorage.getItem("id"));

  useEffect(() => {
    const controller = new AbortController();

    const fetchFollowNetwork = async () => {
      try {
        const res = await fetch(
          `https://dev-platform-backend.onrender.com/api/users/${id}/network`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          const errText = await res.text();
          console.error("API Error:", res.status, errText);
          return;
        }

        const data = await res.json();
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Network error:", err);
      }
    };

    if (id) fetchFollowNetwork();

    return () => controller.abort();
  }, [id]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white p-6 md:p-12">
      <motion.h1
        className="text-4xl font-extrabold mb-12 text-center drop-shadow-xl"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Network
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Followers */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            👥 Followers
          </h2>
          <div className="space-y-6">
            {followers.length > 0 ? (
              followers.map((user, i) => (
                <motion.div
                  key={user.id || i}
                  className="bg-white/10 p-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300"
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={fadeInUp}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                    alt="Profile"
                    className="w-14 h-14 rounded-full border-2 border-indigo-400 shadow"
                  />
                  <div>
                    <p className="text-lg font-bold">{user.username}</p>
                    <p className="text-sm text-white/70 break-all">{user.id}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-white/60 italic">No followers yet.</p>
            )}
          </div>
        </motion.div>

        {/* Following */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            ➡️ Following
          </h2>
          <div className="space-y-6">
            {following.length > 0 ? (
              following.map((user, i) => (
                <motion.div
                  key={user.id || i}
                  className="bg-white/10 p-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300"
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={fadeInUp}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                    alt="Profile"
                    className="w-14 h-14 rounded-full border-2 border-indigo-400 shadow"
                  />
                  <div>
                    <p className="text-lg font-bold">{user.username}</p>
                    <p className="text-sm text-white/70 break-all">{user.id}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-white/60 italic">Not following anyone yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
