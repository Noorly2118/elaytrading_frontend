// PersonalInformation.jsx
import { useState } from "react";

export default function PersonalInformation({
  user,
  onSave,
  refresh,
}) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onSave(formData);

      await refresh();

      alert("Profile updated successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .personal-card{
          background:#fff;
          border:1px solid #E1E8ED;
          border-radius:18px;
          padding:32px;
          margin-bottom:28px;
          box-shadow:0 4px 20px rgba(1,68,111,.06);
        }

        .personal-card h2{
          margin:0 0 24px;
          font-size:1.4rem;
          font-weight:700;
          color:#0B2A40;
          display:flex;
          align-items:center;
        }

        .personal-card h2::before{
          content:'';
          display:inline-block;
          width:26px;
          height:3px;
          border-radius:2px;
          background:#01446F;
          margin-right:12px;
        }

        .profile-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:20px;
        }

        .profile-field{
          display:flex;
          flex-direction:column;
        }

        .profile-field label{
          font-size:.85rem;
          color:#5C6B76;
          margin-bottom:8px;
          font-weight:600;
          letter-spacing:.01em;
        }

        .profile-field input{
          height:48px;
          border:1.5px solid #E1E8ED;
          border-radius:12px;
          padding:0 15px;
          font-size:15px;
          background:#F8FAFB;
          color:#0B2A40;
          transition:.2s ease;
        }

        .profile-field input:hover{
          border-color:#C9D6DD;
        }

        .profile-field input:focus{
          outline:none;
          background:#fff;
          border-color:#01446F;
          box-shadow:0 0 0 4px rgba(1,68,111,.10);
        }

        .email-box{
          margin-top:20px;
          display:flex;
          flex-direction:column;
        }

        .email-box label{
          font-size:.85rem;
          color:#5C6B76;
          margin-bottom:8px;
          font-weight:600;
          letter-spacing:.01em;
        }

        .email-box input{
          height:48px;
          border:1.5px dashed #D7E0E6;
          border-radius:12px;
          padding:0 15px;
          font-size:15px;
          background:#F8FAFB;
          color:#5C6B76;
          cursor:not-allowed;
        }

        .save-btn{
          margin-top:30px;
          background:#01446F;
          color:#fff;
          border:none;
          padding:14px 30px;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
          font-size:.95rem;
          letter-spacing:.01em;
          transition:.2s ease;
        }

        .save-btn:hover:not(:disabled){
          background:#012F4E;
          transform:translateY(-1px);
          box-shadow:0 8px 18px rgba(1,68,111,.25);
        }

        .save-btn:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        @media(max-width:768px){

          .personal-card{
            padding:22px;
          }

        }
      `}</style>

      <section className="personal-card">

        <h2>Personal Information</h2>

        <form onSubmit={handleSubmit}>

          <div className="profile-grid">

            <div className="profile-field">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="email-box">

            <label>Email</label>

            <input
              type="email"
              value={user.email}
              disabled
            />

          </div>

          <button
            className="save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </section>
    </>
  );
}