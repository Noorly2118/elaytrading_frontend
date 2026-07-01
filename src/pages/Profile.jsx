// pages/Profile.jsx
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, loading } = useAuth(); // ✅ USE THIS
  
  if (loading) {
    return <div>Loading profile...</div>;
  }
  
  if (!user) {
    return <p>No user data found. Please login again.</p>;
  }

  return (
    <div style={{ padding: "20px", marginTop: "80px" }}>
      <h2>My Profile</h2>
      <div className="card-custom" style={{ padding: "20px", maxWidth: "400px" }}>
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;