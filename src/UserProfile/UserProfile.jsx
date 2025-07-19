import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const navigate = useNavigate();

  const user = {
    name: "Anurag Nayak",
    email: "anurag@example.com",
    bio: "Frontend developer passionate about building Dev Platforms 🚀",
    skills: ["React", "JavaScript", "Tailwind CSS", "MongoDB"],
    experience: [
      { role: "Frontend Intern", company: "OpenAI", duration: "3 months" },
      { role: "Web Developer", company: "Freelance", duration: "6 months" },
    ],
    github: "https://github.com/Anurag19-web",
    linkedin: "https://linkedin.com/in/anurag-nayak",
    profilePicture: "https://avatars.githubusercontent.com/u/00000000?v=4",
    followers: ["user1", "user2", "user3"], // sample follower usernames
    following: ["user4", "user5"], // sample following usernames
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white px-4 py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-[#1f2937] bg-opacity-90 p-10 rounded-2xl shadow-2xl relative"
      >
        {/* Edit Button */}
        <button
          onClick={() => navigate("/edit-profile")}
          className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm shadow-lg transition"
        >
          ✏️ Edit Profile
        </button>

        {/* Profile Picture & Name */}
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4"
          />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-300 text-sm mt-1">{user.email}</p>

          {/* Followers & Following */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold">{user.followers.length}</p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{user.following.length}</p>
              <p className="text-sm text-gray-400">Following</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">📝 Bio</h2>
          <p className="mt-2 text-gray-300">{user.bio}</p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">🛠️ Skills</h2>
          <div className="mt-2 flex flex-wrap gap-3">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-purple-600 rounded-full text-sm font-medium shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">📌 Experience</h2>
          <ul className="mt-2 space-y-2">
            {user.experience.map((exp, idx) => (
              <li key={idx} className="bg-[#2d3748] p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{exp.role}</h3>
                <p className="text-gray-400">
                  {exp.company} — {exp.duration}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-indigo-400">🔗 Connect</h2>
          <div className="flex justify-center gap-6 mt-4">
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-indigo-400 transition"
            >
              <i className="fab fa-github text-3xl"></i>
            </a>
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-indigo-400 transition"
            >
              <i className="fab fa-linkedin text-3xl"></i>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
