import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName] = useState("Elay");

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);

      const statsRes = await adminApi.get("/admin/stats");
      const ordersRes = await adminApi.get("/orders");

      console.log("Stats response:", statsRes.data); // Debug log
      console.log("Orders response:", ordersRes.data); // Debug log

      setStats(statsRes.data);
      const orders = ordersRes.data || [];
      setRecentOrders(orders.slice(0, 7));

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const getStatusBadgeStyle = (status) => {
    const styles = {
      Delivered: { backgroundColor: "#10b981", color: "white" },
      Shipped: { backgroundColor: "#3b82f6", color: "white" },
      Processing: { backgroundColor: "#f59e0b", color: "white" },
      Pending: { backgroundColor: "#94a3b8", color: "white" },
      Cancelled: { backgroundColor: "#ef4444", color: "white" },
    };
    return styles[status] || styles.Pending;
  };

  // Get total orders count correctly
  const totalOrders = stats?.totalOrders || stats?.orders || stats?.recentOrders || 0;
  const totalRevenue = stats?.totalRevenue || stats?.totalValue || 0;
  const totalProducts = stats?.totalProducts || 0;

  // Mock growth data (replace with real data from API)
  const orderGrowth = 12.5;
  const revenueGrowth = 8.3;
  const productGrowth = 5.2;

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Greeting Section */}
          <div style={styles.greetingSection}>
            <div>
              <h2 style={styles.greetingTitle}>GOOD DAY, <span style={styles.greetingName}>{adminName}!</span></h2>
              <div style={styles.dateTime}>
                <span style={styles.dateIcon}>📅</span>
                {new Date().toLocaleString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                <span style={styles.statIcon}>📋</span> Orders
              </div>
              <div style={styles.statNumber}>{totalOrders.toLocaleString()}</div>
              <div style={styles.statFooter}>
                <span style={orderGrowth >= 0 ? styles.trendUp : styles.trendDown}>
                  {orderGrowth >= 0 ? '↑' : '↓'} {Math.abs(orderGrowth)}%
                </span>
                <span style={styles.sinceLast}>Since last month</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                <span style={styles.statIcon}>💰</span> Revenue
              </div>
              <div style={styles.statNumber}>{totalRevenue.toLocaleString()}</div>
              <div style={styles.statFooter}>
                <span style={revenueGrowth >= 0 ? styles.trendUp : styles.trendDown}>
                  {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth)}%
                </span>
                <span style={styles.sinceLast}>Since last month</span>
              </div>
            </div>

            <div style={{...styles.statCard, ...styles.growthCard}}>
              <div style={styles.statLabel}>
                <span style={styles.statIcon}>📈</span> GROWTH
              </div>
              <div style={styles.statNumber}>+{productGrowth}%</div>
              <div style={styles.statFooter}>
                <span style={styles.trendUp}>↑ {productGrowth}%</span>
                <span style={styles.sinceLast}>Since last month</span>
              </div>
            </div>
          </div>

          {/* Store Performance Analytics */}
          <div style={styles.performanceRow}>
            <div style={styles.performanceTitle}>
              <span style={styles.performanceIcon}>📊</span> Store Performance Analytics
            </div>
            <div style={styles.totalBadge}>
              <span>🏷️</span> Total {totalProducts}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h5 style={styles.tableTitle}>📋 Recent Orders</h5>
              <span style={styles.orderCount}>{recentOrders.length} orders</span>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHead}>User</th>
                    <th style={styles.tableHead}>Total</th>
                    <th style={styles.tableHead}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => {
                      const statusStyle = getStatusBadgeStyle(order.status);
                      return (
                        <tr key={order._id} style={styles.tableRow}>
                          <td style={styles.tableCell}>
                            <div style={styles.userCell}>
                              <div style={styles.userName}>
                                {order.user?.name || order.user || "Guest"}
                              </div>
                              {order.user?.email && (
                                <div style={styles.userEmail}>{order.user.email}</div>
                              )}
                            </div>
                          </td>
                          <td style={styles.tableCell}>
                            <span style={styles.orderTotal}>
                              {order.totalPrice?.toFixed(2) || '0.00'}
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <span style={{
                              ...styles.statusBadge,
                              backgroundColor: statusStyle.backgroundColor,
                              color: statusStyle.color,
                            }}>
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📦</div>
                        <p style={styles.emptyText}>No orders found</p>
                        <p style={styles.emptySubtext}>Orders will appear here once customers make purchases</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .stats-grid > * {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .stats-grid > *:nth-child(1) { animation-delay: 0.1s; }
        .stats-grid > *:nth-child(2) { animation-delay: 0.2s; }
        .stats-grid > *:nth-child(3) { animation-delay: 0.3s; }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },

  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  greetingSection: {
    marginBottom: '32px',
  },

  greetingTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F172A',
    margin: '0 0 4px 0',
  },

  greetingName: {
    fontWeight: '400',
    color: '#3E5A76',
  },

  dateTime: {
    fontSize: '14px',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  dateIcon: {
    fontSize: '14px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px',
    marginBottom: '32px',
  },

  statCard: {
    backgroundColor: 'white',
    borderRadius: '22px',
    padding: '20px 20px 18px',
    border: '1px solid #EEF3F8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },

  growthCard: {
    background: 'linear-gradient(145deg, #F2F7FF, #FFFFFF)',
    borderColor: '#D9E6FF',
  },

  statLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#5E6F88',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  statIcon: {
    fontSize: '16px',
  },

  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0B1E33',
    lineHeight: '1.1',
  },

  statFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    fontSize: '13px',
    fontWeight: '500',
  },

  trendUp: {
    color: '#2B8C4A',
  },

  trendDown: {
    color: '#E53E3E',
  },

  sinceLast: {
    color: '#64748B',
  },

  performanceRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
    padding: '0 2px',
  },

  performanceTitle: {
    fontWeight: '600',
    fontSize: '17px',
    color: '#0B1E33',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  performanceIcon: {
    fontSize: '18px',
  },

  totalBadge: {
    backgroundColor: '#EEF4FF',
    padding: '8px 18px',
    borderRadius: '40px',
    fontWeight: '600',
    fontSize: '15px',
    color: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  tableCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    border: '1px solid #EDF2F7',
    overflow: 'hidden',
  },

  tableHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #EDF2F7',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tableTitle: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#0B1E33',
    margin: 0,
  },

  orderCount: {
    backgroundColor: '#EEF4FF',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#2563EB',
  },

  tableWrapper: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  tableHead: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#94A3B8',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #EDF2F7',
  },

  tableRow: {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background-color 0.2s ease',
  },

  tableCell: {
    padding: '14px 20px',
    fontSize: '14px',
    color: '#0F172A',
  },

  userCell: {
    display: 'flex',
    flexDirection: 'column',
  },

  userName: {
    fontWeight: '500',
  },

  userEmail: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '2px',
  },

  orderTotal: {
    fontWeight: '600',
  },

  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '12px',
    display: 'inline-block',
  },

  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
  },

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },

  emptyText: {
    color: '#94A3B8',
    margin: 0,
  },

  emptySubtext: {
    color: '#CBD5E1',
    fontSize: '14px',
    marginTop: '4px',
  },
};