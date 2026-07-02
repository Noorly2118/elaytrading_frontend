import React, { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { bankAccounts } from "../data/bankAccounts";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';

// Bank Logos
import cbeLogo from "../assets/commercial_bank_logo.png";
import awashLogo from "../assets/Awash_International_Bank.png";
import dashenLogo from "../assets/Dashen_Bank.png";
import telebirrLogo from "../assets/TeleBirr-Logo.png";

const bankLogos = {
  cbe: cbeLogo,
  awash: awashLogo,
  dashen: dashenLogo,
  telebirr: telebirrLogo,
};

const CheckoutPage = () => {
  const { cart: cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    if (!transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fix all errors before proceeding');
      return;
    }

    setIsSubmitting(true);
    let imageUrl = "";

    try {
      if (receiptImage) {
        const formData = new FormData();
        formData.append("file", receiptImage);
        formData.append("upload_preset", "elay_uploads");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/elaystore/image/upload",
          formData
        );
        imageUrl = uploadRes.data.secure_url;
      }

      const orderData = {
        orderItems: cartItems,
        totalPrice,
        paymentMethod,
        transactionId,
        shippingInfo,
        receiptImage: imageUrl,
      };

      const { data } = await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add responsive styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @media (max-width: 768px) {
        .checkout-container {
          flex-direction: column !important;
          gap: 20px !important;
        }
        .checkout-card {
          min-width: 100% !important;
        }
        .header-title {
          font-size: 2.2rem !important;
        }
        .methods-grid {
          grid-template-columns: 1fr !important;
        }
      }
      
      @media (max-width: 480px) {
        .header-title {
          font-size: 1.9rem !important;
        }
        .page-wrapper {
          padding: 20px 15px !important;
        }
      }
      
      .error-text {
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 4px;
      }
      
      .input-error {
        border-color: #ef4444 !important;
        background-color: #fef2f2 !important;
      }
      
      .input-error:focus {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.pageWrapper} className="page-wrapper">
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title} className="header-title">Checkout</h1>
        <p style={styles.subtitle}>
          Review your order and complete payment
        </p>
      </div>

      <div style={styles.container} className="checkout-container">
        {/* SHIPPING SECTION */}
        <div style={styles.card} className="checkout-card">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Shipping Information</h2>
          </div>
          <div style={styles.formGroup}>
            <div>
              <input 
                name="fullName" 
                placeholder="Full Name" 
                onChange={handleChange} 
                style={{
                  ...styles.input,
                  ...(errors.fullName ? styles.inputError : {})
                }}
              />
              {errors.fullName && <div className="error-text">{errors.fullName}</div>}
            </div>
            <div>
              <input 
                name="phone" 
                placeholder="Phone Number" 
                onChange={handleChange} 
                style={{
                  ...styles.input,
                  ...(errors.phone ? styles.inputError : {})
                }}
              />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>
            <div>
              <input 
                name="city" 
                placeholder="City" 
                onChange={handleChange} 
                style={{
                  ...styles.input,
                  ...(errors.city ? styles.inputError : {})
                }}
              />
              {errors.city && <div className="error-text">{errors.city}</div>}
            </div>
            <div>
              <input 
                name="address" 
                placeholder="Address" 
                onChange={handleChange} 
                style={{
                  ...styles.input,
                  ...(errors.address ? styles.inputError : {})
                }}
              />
              {errors.address && <div className="error-text">{errors.address}</div>}
            </div>
            <textarea 
              name="note" 
              placeholder="Additional Note (optional)" 
              onChange={handleChange} 
              style={styles.textarea} 
            />
          </div>
        </div>

        {/* ORDER SUMMARY & PAYMENT */}
        <div style={styles.card} className="checkout-card">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Order Summary</h2>
          </div>

          <div style={styles.summary}>
            {cartItems.map((item, index) => (
              <div key={index} style={styles.item}>
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemDetails}>
                  x{item.quantity} = {(item.price * item.quantity).toLocaleString()} ETB
                </span>
              </div>
            ))}
            <hr style={styles.divider} />
            <div style={styles.total}>
              <strong style={styles.totalLabel}>Total:</strong>
              <strong style={styles.totalAmount}>{totalPrice.toLocaleString()} ETB</strong>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div style={styles.paymentSection}>
            <h3 style={styles.paymentTitle}>Select Payment Method</h3>
            <div style={styles.methods} className="methods-grid">
              {["cbe", "awash", "dashen", "telebirr"].map((method) => (
                <label 
                  key={method} 
                  style={{
                    ...styles.methodLabel,
                    ...(paymentMethod === method ? styles.methodLabelSelected : {}),
                    ...(errors.paymentMethod ? styles.methodLabelError : {})
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      if (errors.paymentMethod) {
                        setErrors({ ...errors, paymentMethod: '' });
                      }
                    }}
                    style={styles.radioInput}
                  />
                  <img
                    src={bankLogos[method]}
                    alt={bankAccounts[method].name}
                    style={styles.bankLogo}
                  />
                  <span style={styles.methodText}>{bankAccounts[method].name}</span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && <div className="error-text">{errors.paymentMethod}</div>}
          </div>

          {/* BANK DETAILS */}
          {paymentMethod && (
            <div style={styles.bankBox}>
              <div style={styles.bankHeader}>
                <img
                  src={bankLogos[paymentMethod]}
                  alt={bankAccounts[paymentMethod].name}
                  style={styles.bankLogoLarge}
                />
                <h4 style={styles.bankName}>{bankAccounts[paymentMethod].name}</h4>
              </div>

              {bankAccounts[paymentMethod].accountNumber && (
                <>
                  <p style={styles.bankDetail}>
                    <span style={styles.detailLabel}>Account Name:</span>
                    {bankAccounts[paymentMethod].accountName}
                  </p>
                  <p style={styles.bankDetail}>
                    <span style={styles.detailLabel}>Account Number:</span>
                    {bankAccounts[paymentMethod].accountNumber}
                  </p>
                </>
              )}
              {bankAccounts[paymentMethod].phone && (
                <p style={styles.bankDetail}>
                  <span style={styles.detailLabel}>Phone:</span>
                  {bankAccounts[paymentMethod].phone}
                </p>
              )}
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Transaction ID (e.g. FT24291ABC)"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                if (errors.transactionId) {
                  setErrors({ ...errors, transactionId: '' });
                }
              }}
              style={{
                ...styles.input,
                ...(errors.transactionId ? styles.inputError : {})
              }}
            />
            {errors.transactionId && <div className="error-text">{errors.transactionId}</div>}
          </div>

          <div style={{ marginTop: '12px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReceiptImage(e.target.files[0])}
              style={styles.fileInput}
            />
            {receiptImage && (
              <div style={styles.fileName}>
                📎 {receiptImage.name}
              </div>
            )}
          </div>

          <button 
            onClick={handlePlaceOrder} 
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {})
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              `Place Order • ${totalPrice.toLocaleString()} ETB`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

/* ---------------- RESPONSIVE STYLES ---------------- */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "70px 0 8px 0",
  },
  subtitle: {
    fontSize: "1.15rem",
    color: "#64748b",
    margin: 0,
  },

  container: {
    display: "flex",
    gap: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },

  sectionHeader: { marginBottom: "16px" },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
    paddingBottom: "12px",
    borderBottom: "2px solid #4AB2FF",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    backgroundColor: "#ffffff",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  textarea: {
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    minHeight: "110px",
    resize: "vertical",
    backgroundColor: "#ffffff",
    width: "100%",
  },
  fileInput: {
    padding: "10px",
    border: "2px dashed #e2e8f0",
    borderRadius: "10px",
    width: "100%",
    cursor: "pointer",
    backgroundColor: "#f8fafc",
  },
  fileName: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#334155",
    padding: "8px 12px",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
  },

  summary: {
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  itemName: { fontWeight: "500", color: "#1e293b" },
  itemDetails: { color: "#64748b" },
  divider: { border: "none", borderTop: "2px solid #e2e8f0", margin: "12px 0" },
  total: { display: "flex", justifyContent: "space-between", paddingTop: "12px" },
  totalLabel: { fontSize: "18px", color: "#1e293b" },
  totalAmount: { fontSize: "20px", color: "#4AB2FF", fontWeight: "700" },

  paymentSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #e2e8f0",
  },
  paymentTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "16px",
  },

  methods: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  methodLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    backgroundColor: "#F8FAFC",
    borderRadius: "10px",
    border: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  methodLabelSelected: {
    borderColor: "#4AB2FF",
    backgroundColor: "#f0f9ff",
  },
  methodLabelError: {
    borderColor: "#ef4444",
  },
  bankLogo: {
    width: "34px",
    height: "34px",
    objectFit: "contain",
  },
  radioInput: {
    accentColor: "#4AB2FF",
    width: "18px",
    height: "18px",
  },
  methodText: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1e293b",
  },

  bankBox: {
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #4AB2FF",
    borderLeft: "5px solid #4AB2FF",
    marginBottom: "20px",
  },
  bankHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  bankLogoLarge: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
  },
  bankName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
  },
  bankDetail: {
    margin: "8px 0",
    fontSize: "15px",
    color: "#334155",
  },
  detailLabel: {
    fontWeight: "600",
    color: "#1e293b",
    marginRight: "8px",
  },

  button: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#4AB2FF",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(74, 178, 255, 0.3)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};