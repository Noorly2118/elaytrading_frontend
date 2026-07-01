// pages/Myorder.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!user || authLoading) return;

    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/myorders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Filter only delivered orders
        const deliveredOrders = data.filter(
          (order) => order.status === "delivered"
        );
        setOrders(deliveredOrders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  if (authLoading) return <div style={styles.loading}>Loading orders...</div>;
  if (!user) return <div style={styles.loading}>Please login to view your orders.</div>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Orders</h1>
        <p style={styles.subtitle}>Delivered Orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h3>No delivered orders yet</h3>
          <p>You haven't received any delivered orders yet.</p>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order._id.slice(-8)}</span>
                  <span style={styles.date}>
                    {new Date(order.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span style={styles.statusBadge}>✅ Delivered</span>
              </div>

              <div style={styles.itemsContainer}>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <p style={styles.itemDetail}>
                        Qty: {item.quantity} × ETB {item.price}
                      </p>
                    </div>
                    <div style={styles.itemTotal}>
                      ETB {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.orderFooter}>
                <div style={styles.totalSection}>
                  <span style={styles.totalLabel}>Total Amount</span>
                  <span style={styles.totalAmount}>
                    ETB {order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

/* ---------------- STYLES ---------------- */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    margin:"70px auto"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontSize: "2.6rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#64748b",
  },

  loading: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#64748b",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#64748b",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "16px",
  },

  ordersList: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
    border: "1px solid #E5E7EB",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #E5E7EB",
  },
  orderId: {
    fontWeight: "600",
    color: "#1e293b",
    fontSize: "1.1rem",
  },
  date: {
    display: "block",
    color: "#64748b",
    fontSize: "0.95rem",
    marginTop: "4px",
  },
  statusBadge: {
    backgroundColor: "#22c55e",
    color: "white",
    padding: "6px 14px",
    borderRadius: "9999px",
    fontSize: "0.9rem",
    fontWeight: "600",
  },

  itemsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f1f5f9",
  },
  itemImage: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  itemDetail: {
    color: "#64748b",
    margin: 0,
    fontSize: "0.95rem",
  },
  itemTotal: {
    fontWeight: "600",
    color: "#1e293b",
  },

  orderFooter: {
    paddingTop: "16px",
    borderTop: "2px solid #4AB2FF",
  },
  totalSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: "1.1rem",
    color: "#475569",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#4AB2FF",
  },
};