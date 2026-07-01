import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>Loading your order...</div>
      </div>
    );
  }

  if (!order) {
    return <div style={styles.error}>Order not found</div>;
  }

  const isVerified = order.paymentStatus === "verified";
  const isRejected = order.paymentStatus === "rejected";

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Status Icon */}
        <div style={styles.iconContainer}>
          {isVerified ? (
            <div style={styles.successIcon}>✅</div>
          ) : isRejected ? (
            <div style={styles.rejectedIcon}>❌</div>
          ) : (
            <div style={styles.pendingIcon}>⏳</div>
          )}
        </div>

        {/* Status Message */}
        <h1 style={styles.title}>
          {isVerified
            ? "Payment Verified Successfully!"
            : isRejected
            ? "Payment Rejected"
            : "Waiting for Confirmation"}
        </h1>

        <p style={styles.subtitle}>
          {isVerified
            ? "Thank you for your order! We are preparing your items."
            : isRejected
            ? "Please check your transaction and try again."
            : "Your payment is being reviewed by our team. You will be notified soon."}
        </p>

        {/* Order Details Card */}
        <div style={styles.orderCard}>
          <h3 style={styles.orderTitle}>Order Details</h3>
          
          <div style={styles.detailRow}>
            <span style={styles.label}>Order ID</span>
            <span style={styles.value}>{order._id}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.label}>Total Amount</span>
            <span style={styles.value}>{order.totalPrice.toLocaleString()} ETB</span>
          </div>

          {order.paymentMethod && (
            <div style={styles.detailRow}>
              <span style={styles.label}>Payment Method</span>
              <span style={styles.value}>{order.paymentMethod.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => navigate("/")} 
            style={styles.primaryButton}
          >
            Return to Home
          </button>
          
          <button 
            onClick={() => navigate("/myorders")} 
            style={styles.secondaryButton}
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

/* ---------------- STYLES ---------------- */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    margin:"30px 0 0 0"
  },
  container: {
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "40px 30px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid #E5E7EB",
  },
  loadingContainer: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#64748b",
  },
  spinner: {
    padding: "20px",
  },
  error: {
    textAlign: "center",
    padding: "50px",
    color: "#ef4444",
    fontSize: "18px",
  },
  iconContainer: {
    fontSize: "4.5rem",
    marginBottom: "20px",
  },
  successIcon: { color: "#22c55e" },
  rejectedIcon: { color: "#ef4444" },
  pendingIcon: { color: "#f59e0b" },

  title: {
    fontSize: "2.1rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    lineHeight: "1.5",
    marginBottom: "30px",
  },

  orderCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    textAlign: "left",
    border: "1px solid #E5E7EB",
  },
  orderTitle: {
    margin: "0 0 18px 0",
    fontSize: "1.25rem",
    color: "#1e293b",
    fontWeight: "600",
    textAlign: "center",
    paddingBottom: "12px",
    borderBottom: "2px solid #4AB2FF",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  label: {
    color: "#64748b",
    fontWeight: "500",
  },
  value: {
    fontWeight: "600",
    color: "#1e293b",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  primaryButton: {
    padding: "16px",
    backgroundColor: "#4AB2FF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.05rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    padding: "16px",
    backgroundColor: "transparent",
    color: "#4AB2FF",
    border: "2px solid #4AB2FF",
    borderRadius: "12px",
    fontSize: "1.05rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};