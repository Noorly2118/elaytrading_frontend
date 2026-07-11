// ShippingInformation.jsx
import { useState } from "react";

export default function ShippingInformation({
  user,
  onSave,
  refresh,
}) {

  const [formData, setFormData] = useState({
    country: user.shippingAddress?.country || "Ethiopia",
    city: user.shippingAddress?.city || "",
    region: user.shippingAddress?.region || "",
    address: user.shippingAddress?.address || "",
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

      await onSave({
        shippingAddress: formData,
      });

      await refresh();

      alert("Shipping information updated successfully.");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to update shipping information."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <style>{`
        .shipping-card{
          background:#fff;
          border:1px solid #E1E8ED;
          border-radius:18px;
          padding:32px;
          margin-bottom:28px;
          box-shadow:0 4px 20px rgba(1,68,111,.06);
        }

        .shipping-card h2{
          margin:0 0 24px;
          font-size:1.4rem;
          font-weight:700;
          color:#0B2A40;
          display:flex;
          align-items:center;
        }

        .shipping-card h2::before{
          content:'';
          display:inline-block;
          width:26px;
          height:3px;
          border-radius:2px;
          background:#01446F;
          margin-right:12px;
        }

        .shipping-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:20px;
        }

        .shipping-field{
          display:flex;
          flex-direction:column;
        }

        .shipping-field label{
          margin-bottom:8px;
          color:#5C6B76;
          font-size:.85rem;
          font-weight:600;
          letter-spacing:.01em;
        }

        .shipping-field input{
          height:48px;
          border:1.5px solid #E1E8ED;
          border-radius:12px;
          padding:0 15px;
          font-size:15px;
          background:#F8FAFB;
          color:#0B2A40;
          transition:.2s ease;
        }

        .shipping-field input:hover{
          border-color:#C9D6DD;
        }

        .shipping-field input:focus{
          outline:none;
          background:#fff;
          border-color:#01446F;
          box-shadow:0 0 0 4px rgba(1,68,111,.10);
        }

        .address-field{
          margin-top:20px;
          display:flex;
          flex-direction:column;
        }

        .address-field label{
          margin-bottom:8px;
          color:#5C6B76;
          font-size:.85rem;
          font-weight:600;
          letter-spacing:.01em;
        }

        .address-field textarea{
          min-height:120px;
          resize:vertical;
          padding:15px;
          border:1.5px solid #E1E8ED;
          border-radius:12px;
          font-size:15px;
          background:#F8FAFB;
          color:#0B2A40;
          transition:.2s ease;
          font-family:inherit;
        }

        .address-field textarea:hover{
          border-color:#C9D6DD;
        }

        .address-field textarea:focus{
          outline:none;
          background:#fff;
          border-color:#01446F;
          box-shadow:0 0 0 4px rgba(1,68,111,.10);
        }

        .shipping-btn{
          margin-top:28px;
          border:none;
          background:#01446F;
          color:#fff;
          padding:14px 30px;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
          font-size:.95rem;
          letter-spacing:.01em;
          transition:.2s ease;
        }

        .shipping-btn:hover:not(:disabled){
          background:#012F4E;
          transform:translateY(-1px);
          box-shadow:0 8px 18px rgba(1,68,111,.25);
        }

        .shipping-btn:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        @media(max-width:768px){

          .shipping-card{
            padding:22px;
          }

        }
      `}</style>

      <section className="shipping-card">

        <h2>Shipping Information</h2>

        <form onSubmit={handleSubmit}>

          <div className="shipping-grid">

            <div className="shipping-field">
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="shipping-field">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="shipping-field">
              <label>Region</label>

              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="address-field">

            <label>Street Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full delivery address"
            />

          </div>

          <button
            className="shipping-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>

        </form>

      </section>
    </>
  );

}