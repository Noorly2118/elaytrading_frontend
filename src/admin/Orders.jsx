import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../services/adminApi";
import toast, { Toaster } from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: { backgroundColor: "#F59E0B", color: "#FFFFFF" },
      processing: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
      shipped: { backgroundColor: "#8B5CF6", color: "#FFFFFF" },
      delivered: { backgroundColor: "#10B981", color: "#FFFFFF" },
      cancelled: { backgroundColor: "#EF4444", color: "#FFFFFF" },
    };
    return styles[status?.toLowerCase()] || { backgroundColor: "#94A3B8", color: "#FFFFFF" };
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      processing: "🔄",
      shipped: "📦",
      delivered: "✅",
      cancelled: "❌",
    };
    return icons[status?.toLowerCase()] || "📋";
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div style={styles.pageWrapper}>
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

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>📋 Orders Management</h1>
          <p style={styles.pageSubtitle}>Manage and track all customer orders</p>
        </div>
        <button 
          onClick={fetchOrders} 
          style={styles.refreshBtn}
          className="refresh-btn"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
     
      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              style={styles.clearBtn}
              className="clear-btn"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h5 style={styles.tableTitle}>All Orders</h5>
            <span style={styles.orderCount}>{filteredOrders.length} orders found</span>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading orders...</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHead}>Order ID</th>
                  <th style={styles.tableHead}>Customer</th>
                  <th style={styles.tableHead}>Date</th>
                  <th style={styles.tableHead}>Items</th>
                  <th style={styles.tableHead}>Total</th>
                  <th style={styles.tableHead}>Status</th>
                  <th style={styles.tableHead}></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusStyle = getStatusBadgeStyle(order.status);
                    const statusIcon = getStatusIcon(order.status);
                    const itemCount = order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                    
                    return (
                      <tr key={order._id} style={styles.tableRow} className="table-row">
                        <td style={styles.tableCell}>
                          <span style={styles.orderId}>#{order._id.slice(-8)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.customerCell}>
                            <div style={styles.customerName}>
                              {order.user?.name || "Guest"}
                            </div>
                            {order.user?.email && (
                              <div style={styles.customerEmail}>{order.user.email}</div>
                            )}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.dateCell}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.itemCount}>{itemCount}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.totalPrice}>
                            {order.totalPrice?.toLocaleString()} ETB
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: statusStyle.backgroundColor,
                            color: statusStyle.color,
                          }}>
                            <span style={{ marginRight: '4px' }}>{statusIcon}</span>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <Link
                            to={`/admin/orders/${order._id}`}
                            style={styles.viewBtn}
                            className="view-btn"
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={styles.emptyState}>
                      <div style={styles.emptyIcon}>📦</div>
                      <p style={styles.emptyText}>No orders found</p>
                      <p style={styles.emptySubtext}>
                        {searchTerm || statusFilter !== "all" 
                          ? "Try adjusting your search or filters"
                          : "Orders will appear here once customers make purchases"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        {!loading && filteredOrders.length > 0 && (
          <div style={styles.tableFooter}>
            <span style={styles.footerText}>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        )}
      </div>

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
        
        .stats-grid > *:nth-child(1) { animation-delay: 0.05s; }
        .stats-grid > *:nth-child(2) { animation-delay: 0.1s; }
        .stats-grid > *:nth-child(3) { animation-delay: 0.15s; }
        .stats-grid > *:nth-child(4) { animation-delay: 0.2s; }
        
        .refresh-btn:hover {
          background-color: #F1F5F9 !important;
          transform: translateY(-1px);
        }
        
        .search-input:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .search-input::placeholder {
          color: #94A3B8;
        }
        
        .filter-select:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .clear-btn:hover {
          background-color: #F1F5F9;
          color: #0F172A;
        }
        
        .table-row:hover {
          background-color: #F8FAFC !important;
        }
        
        .view-btn:hover {
          background-color: #2563EB !important;
          transform: translateX(4px);
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          
          .filters-container {
            flex-direction: column !important;
          }
          
          .search-wrapper {
            width: 100% !important;
          }
          
          .filter-select {
            width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          
          .page-title {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: '24px 20px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    maxWidth: '1400px',
    margin: '0 auto 28px auto',
    padding: '0 4px',
    flexWrap: 'wrap',
    gap: '12px',
  },

  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
  },

  pageSubtitle: {
    fontSize: '14px',
    color: '#64748B',
    margin: '4px 0 0 0',
  },

  refreshBtn: {
    padding: '10px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    color: '#0F172A',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
    maxWidth: '1400px',
    margin: '0 auto 24px auto',
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease',
  },

  statIcon: {
    fontSize: '32px',
  },

  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
  },

  statLabel: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: '500',
  },

  filtersContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    maxWidth: '1400px',
    margin: '0 auto 24px auto',
    padding: '0 4px',
    flexWrap: 'wrap',
  },

  searchWrapper: {
    flex: 1,
    position: 'relative',
    minWidth: '200px',
  },

  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: '#94A3B8',
  },

  searchInput: {
    width: '100%',
    padding: '12px 40px 12px 40px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    transition: 'all 0.2s ease',
    outline: 'none',
  },

  clearBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },

  filterSelect: {
    padding: '12px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
    minWidth: '160px',
  },

  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    maxWidth: '1400px',
    margin: '0 auto',
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
    color: '#0F172A',
    margin: 0,
  },

  orderCount: {
    fontSize: '13px',
    color: '#64748B',
    marginLeft: '12px',
  },

  tableWrapper: {
    overflowX: 'auto',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },

  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    color: '#64748B',
    fontSize: '16px',
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
    borderBottom: '2px solid #EDF2F7',
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

  orderId: {
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: 'monospace',
  },

  customerCell: {
    display: 'flex',
    flexDirection: 'column',
  },

  customerName: {
    fontWeight: '500',
    color: '#0F172A',
  },

  customerEmail: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '2px',
  },

  dateCell: {
    fontSize: '14px',
    color: '#475569',
  },

  itemCount: {
    display: 'inline-block',
    backgroundColor: '#F1F5F9',
    padding: '2px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },

  totalPrice: {
    fontWeight: '600',
    color: '#0F172A',
  },

  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
  },

  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
  },

  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
  },

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: '18px',
    fontWeight: '500',
    margin: '0',
  },

  emptySubtext: {
    color: '#CBD5E1',
    fontSize: '14px',
    marginTop: '4px',
  },

  tableFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #EDF2F7',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footerText: {
    fontSize: '14px',
    color: '#64748B',
  },
};