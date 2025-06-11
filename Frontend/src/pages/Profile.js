import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenContext";
import Header from "../components/Header";
import { FaTimes } from "react-icons/fa";

const Profile = () => {
  const { token } = useToken();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    bio: "",
    profile_pic: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPicModal, setShowPicModal] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/get_user_details/${token}`);
      const data = await res.json();
      if (data.status) {
        setUser(data.data);
        setFormData({
          name: data.data.name || "",
          username: data.data.username || "",
          gender: data.data.gender || "",
          bio: data.data.bio || "",
          profile_pic: null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch user details", err);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchUserDetails();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "profile_pic" ? files[0] : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("token", token);
    updatedData.append("name", formData.name);
    updatedData.append("username", formData.username);
    updatedData.append("gender", formData.gender);
    updatedData.append("bio", formData.bio);
    if (formData.profile_pic) updatedData.append("profile_pic", formData.profile_pic);

    try {
      const res = await fetch("http://localhost:8000/edit_profile", {
        method: "PUT",
        body: updatedData,
      });
      const data = await res.json();
      if (data.status) {
        fetchUserDetails();
        setIsEditing(false);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error", err);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          {/* Breadcrumb / Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0f172a]">{user.name}</h1>
            <h2 className="text-xl text-gray-500">Profile</h2>
            <hr className="mt-4 border-gray-200" />
          </div>

          {/* Edit / View Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-grad px-4 py-2 text-sm"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing ? (
            /* View Mode */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-1 text-center">
                <div
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#00f7ff] cursor-pointer"
                  onClick={() => setShowPicModal(true)}
                >
                  {user.profile_pic ? (
                    <img
                      src={`../assests/profile_images/${user.profile_pic}`}
                      alt={user.name}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 rounded-full">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Username: </span>
                  <span className="text-gray-900">{user.username}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Gender: </span>
                  <span className="text-gray-900">{user.gender || "Not set"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Bio: </span>
                  <span className="text-gray-900">{user.bio || "No bio yet."}</span>
                </div>
              </div>

              {/* Profile Pic Modal */}
              {showPicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="relative bg-white rounded-lg p-4 max-w-sm">
                    <button
                      onClick={() => setShowPicModal(false)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes />
                    </button>
                    {user.profile_pic ? (
                      <img
                        src={`../assests/profile_images/${user.profile_pic}`}
                        alt={user.name}
                        className="w-full h-auto rounded-lg"
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-6xl text-gray-400 rounded-lg">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  name="profile_pic"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-grad px-6 py-2 rounded-lg">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;