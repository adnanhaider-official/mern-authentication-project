import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

function Home() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Edit profile states
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  // Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("bio", bio);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await api.put("/auth/profile", formData);

      setUser(response.data.data);
      setEditing(false);
      setAvatar(null);
    } catch (error) {
      setError(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setAvatar(null);
    setError("");
    setEditing(false);
  };

  // Image Preview
  const imagePreview = avatar ? URL.createObjectURL(avatar) : user?.avatar;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        {/* Profile Image */}

        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-blue-100"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mx-auto border-4 border-blue-100">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Profile View */}

        {!editing && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mt-5">
              {user?.name}
            </h1>

            <p className="text-gray-500 text-sm mt-2">{user?.email}</p>

            <p className="text-gray-600 mt-5 leading-7">
              {user?.bio || "No bio added yet."}
            </p>

            {/* Buttons */}

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => {
                  setName(user?.name || "");
                  setBio(user?.bio || "");
                  setAvatar(null);
                  setError("");
                  setEditing(true);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </>
        )}

        {/* Edit Profile Form */}

        {editing && (
          <form onSubmit={handleUpdate} className="mt-6 space-y-4 text-left">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-5">
              Edit Profile
            </h2>

            {/* Name */}

            <div>
              <label className="block text-sm font-medium mb-2">Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Bio */}

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 resize-none"
                placeholder="Write your bio..."
              />
            </div>

            {/* Profile Image */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0] || null)}
                className="w-full text-sm border rounded-lg p-2"
              />
            </div>

            {/* Error */}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Save Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {/* Cancel Button */}

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Home;
