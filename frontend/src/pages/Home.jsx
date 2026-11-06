import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8 text-center">
        {/* Profile Image */}

        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-blue-100"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mx-auto">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name */}

        <h1 className="text-2xl font-bold text-gray-800 mt-5">{user?.name}</h1>

        {/* Email */}

        <p className="text-gray-500 text-sm mt-2">{user?.email}</p>

        {/* Bio */}

        <p className="text-gray-600 mt-5 leading-7">
          {user?.bio || "No bio added yet."}
        </p>
      </div>
    </div>
  );
}

export default Home;
