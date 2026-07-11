// ChangePassword.jsx
import { useState } from "react";

export default function ChangePassword({ onSave }) {

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    if (!formData.currentPassword) {
      return alert("Current password is required.");
    }

    if (formData.newPassword.length < 6) {
      return alert("New password must be at least 6 characters.");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {

      setLoading(true);

      await onSave({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      alert("Password changed successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to change password."
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <>
      <style>{`
        .password-card{
          background:#fff;
          border:1px solid #E1E8ED;
          border-radius:18px;
          padding:32px;
          margin-bottom:30px;
          box-shadow:0 4px 20px rgba(1,68,111,.06);
        }

        .password-card h2{
          margin:0 0 24px;
          font-size:1.4rem;
          font-weight:700;
          color:#0B2A40;
          display:flex;
          align-items:center;
        }

        .password-card h2::before{
          content:'';
          display:inline-block;
          width:26px;
          height:3px;
          border-radius:2px;
          background:#01446F;
          margin-right:12px;
        }

        .password-grid{
          display:grid;
          gap:20px;
          max-width:460px;
        }

        .password-field{
          display:flex;
          flex-direction:column;
        }

        .password-field label{
          margin-bottom:8px;
          font-size:.85rem;
          color:#5C6B76;
          font-weight:600;
          letter-spacing:.01em;
        }

        .password-field input{
          height:48px;
          border:1.5px solid #E1E8ED;
          border-radius:12px;
          padding:0 15px;
          font-size:15px;
          background:#F8FAFB;
          color:#0B2A40;
          transition:.2s ease;
        }

        .password-field input:hover{
          border-color:#C9D6DD;
        }

        .password-field input:focus{
          outline:none;
          background:#fff;
          border-color:#01446F;
          box-shadow:0 0 0 4px rgba(1,68,111,.10);
        }

        .password-btn{
          margin-top:28px;
          width:max-content;
          padding:14px 30px;
          border:none;
          border-radius:12px;
          background:#01446F;
          color:#fff;
          cursor:pointer;
          font-weight:600;
          font-size:.95rem;
          letter-spacing:.01em;
          transition:.2s ease;
        }

        .password-btn:hover:not(:disabled){
          background:#012F4E;
          transform:translateY(-1px);
          box-shadow:0 8px 18px rgba(1,68,111,.25);
        }

        .password-btn:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        @media(max-width:768px){

          .password-card{
            padding:22px;
          }

          .password-grid{
            max-width:100%;
          }

          .password-btn{
            width:100%;
          }

        }
      `}</style>

      <section className="password-card">

        <h2>Change Password</h2>

        <form onSubmit={handleSubmit}>

          <div className="password-grid">

            <div className="password-field">

              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />

            </div>

            <div className="password-field">

              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />

            </div>

            <div className="password-field">

              <label>Confirm New Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

            </div>

          </div>

          <button
            className="password-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </section>
    </>
  );

}