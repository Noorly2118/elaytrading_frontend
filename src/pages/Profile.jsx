// Profile.jsx (page)
import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/api";

import PersonalInformation from "../components/profile/PersonalInformation";
import ShippingInformation from "../components/profile/ShippingInformation";
import OrderHistory from "../components/profile/OrderHistory";
import ChangePassword from "../components/profile/ChangePassword";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading Profile...</h3>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .profile-page{
          background:#F8FAFB;
          min-height:100vh;
          padding:60px 20px 80px;
                      margin-top:80px;

        }

        .profile-page-inner{
          max-width:1100px;
          margin:0 auto;
        }

        .profile-header{
          margin-bottom:36px;
        }

        .profile-header span{
          display:inline-block;
          font-size:.78rem;
          font-weight:700;
          letter-spacing:.08em;
          text-transform:uppercase;
          color:#01446F;
          margin-bottom:10px;
        }

        .profile-header h1{
          font-size:2.25rem;
          font-weight:700;
          color:#0B2A40;
          margin:0 0 8px;
          letter-spacing:-0.01em;
        }

        .profile-header p{
          color:#5C6B76;
          font-size:1rem;
          margin:0;
        }

        .profile-sections{
          display:flex;
          flex-direction:column;
          gap:24px;
        }

        @media(max-width:768px){

          .profile-page{
            padding:36px 16px 60px;
            margin-top:80px;
          }

          .profile-header h1{
            font-size:1.7rem;
          }

        }
      `}</style>

      <main className="profile-page">
        <div className="profile-page-inner">

          <div className="profile-header">

            

            <h1>My Profile</h1>

            <p>
              Manage your personal information, shipping address,
              orders and account security.
            </p>

          </div>

          <div className="profile-sections">

            <PersonalInformation
              user={profile.user}
              onSave={updateProfile}
              refresh={fetchProfile}
            />

            <ShippingInformation
              user={profile.user}
              onSave={updateProfile}
              refresh={fetchProfile}
            />

            <OrderHistory
              orders={profile.orders}
            />

            <ChangePassword
              onSave={changePassword}
            />

          </div>

        </div>
      </main>
    </>
  );
}