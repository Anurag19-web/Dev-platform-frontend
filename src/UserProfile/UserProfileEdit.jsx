import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserProfileEdit = () => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const [userEditProfile, setuserEditProfile] = useState(null);
  const [newExperience, setNewExperience] = useState({ company: "", role: "", duration: "" });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${userId}`);
        const data = await res.json();
        if (data) setuserEditProfile(data);
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleExperienceChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch(`https://dev-platform-backend.onrender.com/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) setuserEditProfile((prev) => ({ ...prev, ...updates }));
      else console.error("Update failed:", data.message);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.role || !newExperience.duration) return;
    const updated = [...(userEditProfile.experience || []), newExperience];
    updateProfile({ experience: updated });
    setNewExperience({ company: "", role: "", duration: "" });
  };

  const handleDeleteExperience = (index) => {
    const updated = userEditProfile.experience.filter((_, i) => i !== index);
    updateProfile({ experience: updated });
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const updated = [...userEditProfile.skills, newSkill.trim()];
    updateProfile({ skills: updated });
    setNewSkill("");
  };

  const handleRemoveSkill = (index) => {
    const updated = userEditProfile.skills.filter((_, i) => i !== index);
    updateProfile({ skills: updated });
  };

  const handleSaveProfile = async () => {
  let updatedSkills = userEditProfile.skills || [];
  if (typeof newSkill === "string" && newSkill.trim() && !updatedSkills.includes(newSkill.trim())) {
    updatedSkills = [...updatedSkills, newSkill.trim()];
  }

  let updatedExperience = userEditProfile.experience || [];
  if (
    newExperience.company?.trim() &&
    newExperience.role?.trim() &&
    newExperience.duration?.trim()
  ) {
    updatedExperience = [...updatedExperience, {
      company: newExperience.company.trim(),
      role: newExperience.role.trim(),
      duration: newExperience.duration.trim()
    }];
  }

  const updates = {
    username: userEditProfile.username?.trim(),
    email: userEditProfile.email?.trim(),
    profilePicture: userEditProfile.profilePicture?.trim(),
    bio: userEditProfile.bio?.trim(),
    skills: updatedSkills,
    experience: updatedExperience,
    github: userEditProfile.github?.trim(),
    linkedin: userEditProfile.linkedin?.trim(),
  };

  await updateProfile(updates);
  navigate("/userprofile");
};


  if (!userEditProfile) return <div className="text-white text-center mt-20">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e27ac] via-[#49265d] to-[#24355d] text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-[#1f2937] p-10 rounded-2xl shadow-2xl"
      >
        {/* Navigation Buttons */}
        <div className="flex justify-between mb-6">
          <button onClick={() => navigate("/userprofile")} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
            ← Back
          </button>
          <button onClick={handleSaveProfile} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
            💾 Save & Go to Profile
          </button>
        </div>

        {/* Profile Picture, Name & Email */}
        <div className="flex flex-col items-center">
          <img
            src={userEditProfile.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${userEditProfile.username}`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4 object-cover"
          />
          <label className="cursor-pointer h-10 mt-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 text-sm flex items-center">
            Select Picture
            <input type="file" accept="image/*" hidden onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setuserEditProfile({ ...userEditProfile, profilePicture: url });
              }
            }} />
          </label>
          <input
            className="mt-4 text-xl font-semibold bg-transparent border-b border-gray-500 text-center"
            placeholder="Full Name"
            value={userEditProfile.username}
            onChange={(e) => setuserEditProfile({ ...userEditProfile, username: e.target.value })}
          />
          <input
            className="mt-2 text-sm bg-transparent border-b border-gray-500 text-center"
            placeholder="Email"
            value={userEditProfile.email}
            onChange={(e) => setuserEditProfile({ ...userEditProfile, email: e.target.value })}
          />
        </div>

        {/* Bio */}
        <div className="mt-6 text-center">
          <label className="text-sm text-gray-400">📝 Bio</label>
          <textarea
            className="w-full mt-2 bg-transparent border border-gray-600 rounded-lg p-3"
            rows="4"
            placeholder="Tell us about yourself..."
            value={userEditProfile.bio}
            onChange={(e) => setuserEditProfile({ ...userEditProfile, bio: e.target.value })}
          ></textarea>
          <div className="flex gap-4 justify-center mt-4">
            <button onClick={() => updateProfile({ bio: userEditProfile.bio })} className="bg-indigo-600 px-6 py-2 rounded-lg">💾 Save</button>
            {userEditProfile.bio && (
              <button onClick={() => setuserEditProfile({ ...userEditProfile, bio: "" })} className="bg-red-600 px-4 py-2 rounded-lg">❌ Clear</button>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">🛠️ Skills</h2>
          <div className="flex gap-4 mt-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="p-2 rounded bg-[#2d3748] border border-gray-600 w-full"
            />
            <button onClick={handleAddSkill} className="bg-indigo-600 px-4 py-2 rounded-lg">➕</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {userEditProfile.skills?.map((skill, idx) => (
              <span key={idx} className="bg-purple-600 px-4 py-2 rounded-full">
                {skill}
                <button onClick={() => handleRemoveSkill(idx)} className="ml-2 text-red-300">✖</button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-400">📌 Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {["company", "role", "duration"].map((field) => (
              <input
                key={field}
                name={field}
                value={newExperience[field]}
                onChange={handleExperienceChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-2 rounded bg-[#2d3748] border border-gray-600"
              />
            ))}
          </div>
          <button onClick={handleAddExperience} className="mt-4 bg-indigo-600 px-4 py-2 rounded-lg">➕ Add</button>
          <ul className="mt-4 space-y-2">
            {userEditProfile.experience?.map((exp, idx) => (
              <li key={idx} className="p-2 border rounded-md">
                <p>Company: {exp.company}</p>
                <p>Role: {exp.role}</p>
                <p>Duration: {exp.duration}</p>
                <button onClick={() => handleDeleteExperience(idx)} className="text-red-500">Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-indigo-500 text-center">🔗 Social Links</h2>
          {["github", "linkedin"].map((platform) => (
            <div key={platform} className="mt-4">
              <label className="text-sm text-gray-400 capitalize">{platform} URL</label>
              <input
                type="url"
                placeholder={`https://${platform}.com/your-profile`}
                className="w-full p-2 mt-1 rounded-md bg-gray-800 border border-gray-600"
                value={userEditProfile[platform] || ''}
                onChange={(e) => setuserEditProfile({ ...userEditProfile, [platform]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
