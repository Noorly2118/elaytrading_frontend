import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";


const Payments = () => {
  // ========== STATE ==========
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Selected payment for drawer
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ========== FETCH PAYMENTS ==========
  const fetchPayments = async () => {
    try {
      const { data } = await adminApi.get("/payments");
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error(error.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ========== STATISTICS ==========
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + (payment.totalPrice || 0),
    0
  );

  const today = new Date();

  const todayRevenue = payments
    .filter((payment) => {
      const date = new Date(payment.updatedAt);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, payment) => sum + (payment.totalPrice || 0), 0);

  const monthRevenue = payments
    .filter((payment) => {
      const date = new Date(payment.updatedAt);
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, payment) => sum + (payment.totalPrice || 0), 0);

  const avgOrderValue = payments.length > 0 ? totalRevenue / payments.length : 0;

  // ========== FILTER LOGIC ==========
  const filteredPayments = payments.filter((payment) => {
    // Search filter
    const matchesSearch =
      payment.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      payment.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(search.toLowerCase());

    // Amount filter
    const amount = payment.totalPrice || 0;
    const matchesAmount =
      (!minAmount || amount >= Number(minAmount)) &&
      (!maxAmount || amount <= Number(maxAmount));

    // Date filter
    const paymentDate = new Date(payment.updatedAt);
    const matchesDate =
      (!startDate || paymentDate >= new Date(startDate)) &&
      (!endDate || paymentDate <= new Date(endDate));

    // Status filter
    const matchesStatus = filterStatus === "all" || payment.paymentStatus === filterStatus;

    return matchesSearch && matchesAmount && matchesDate && matchesStatus;
  });

  // ========== GET STATUS COLOR ==========
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'verified': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'rejected': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  const handleExportReport = () => {
    if (filteredPayments.length === 0) {
      toast.error("No payments to export");
      return;
    }
    toast.success(`Exporting ${filteredPayments.length} payments...`);
    // Export functionality would go here
  };

  // ========== LOADING ==========
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading payments...</p>
    </div>
  );

  // ========== RENDER ==========
  return (
    <div style={styles.pageWrapper}>
     

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Payments Dashboard</h1>
          <p style={styles.pageSubtitle}>Manage and track all payment transactions</p>
        </div>
        <div style={styles.headerActions}>
          <button 
            style={styles.exportButton} 
            onClick={handleExportReport}
            className="export-button"
          >
            📊 Export Report
          </button>
        </div>
      </div>

      {/* ===== STATISTICS CARDS ===== */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard} className="stat-card">
          <div style={styles.statIcon}>💳</div>
          <div>
            <p style={styles.statLabel}>Total Payments</p>
            <h3 style={styles.statValue}>{payments.length}</h3>
          </div>
        </div>

        <div style={styles.statCard} className="stat-card">
          <div style={styles.statIcon}>💰</div>
          <div>
            <p style={styles.statLabel}>Total Revenue</p>
            <h3 style={styles.statValue}>{totalRevenue.toLocaleString()} ETB</h3>
          </div>
        </div>

        <div style={styles.statCard} className="stat-card">
          <div style={styles.statIcon}>📈</div>
          <div>
            <p style={styles.statLabel}>Today's Revenue</p>
            <h3 style={styles.statValue}>{todayRevenue.toLocaleString()} ETB</h3>
          </div>
        </div>

        <div style={styles.statCard} className="stat-card">
          <div style={styles.statIcon}>📊</div>
          <div>
            <p style={styles.statLabel}>This Month</p>
            <h3 style={styles.statValue}>{monthRevenue.toLocaleString()} ETB</h3>
          </div>
        </div>

        <div style={styles.statCard} className="stat-card">
          <div style={styles.statIcon}>📋</div>
          <div>
            <p style={styles.statLabel}>Avg Order Value</p>
            <h3 style={styles.statValue}>{avgOrderValue.toLocaleString()} ETB</h3>
          </div>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div style={styles.filterContainer}>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <span style={styles.filterIcon}>🔍</span>
            <input
              type="text"
              style={styles.searchInput}
              className="search-input"
              placeholder="Search by transaction, customer, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <select
              style={styles.statusSelect}
              className="status-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="verified">✅ Verified</option>
              <option value="pending">⏳ Pending</option>
              <option value="rejected">❌ Rejected</option>
            </select>
          </div>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.dateRange}>
            <input
              type="date"
              style={styles.dateInput}
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span style={styles.dateRangeSeparator}>→</span>
            <input
              type="date"
              style={styles.dateInput}
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={styles.amountRange}>
            <input
              type="number"
              style={styles.amountInput}
              className="amount-input"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <span style={styles.amountRangeSeparator}>-</span>
            <input
              type="number"
              style={styles.amountInput}
              className="amount-input"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          <button 
            style={styles.clearFiltersButton}
            className="clear-filters"
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
              setMinAmount("");
              setMaxAmount("");
              setFilterStatus("all");
              toast.success("Filters cleared");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ===== PAYMENTS TABLE ===== */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h5 style={styles.tableTitle}>Payment Transactions</h5>
          <span style={styles.tableCount}>{filteredPayments.length} results</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Transaction ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr 
                    key={payment._id} 
                    style={styles.tr}
                    className="table-row"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <td style={styles.td}>
                      <span style={styles.transactionId}>{payment.transactionId}</span>
                    </td>
                    <td style={styles.td}>
                      <div>
                        <div style={styles.customerName}>{payment.user?.name || "Unknown"}</div>
                        <div style={styles.customerEmail}>{payment.user?.email || ""}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.amount}>{payment.totalPrice?.toLocaleString()} ETB</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.paymentMethod}>{payment.paymentMethod || "N/A"}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusBgColor(payment.paymentStatus),
                        color: getStatusColor(payment.paymentStatus),
                      }}>
                        {payment.paymentStatus || "pending"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div>
                        <div style={styles.date}>{new Date(payment.updatedAt).toLocaleDateString()}</div>
                        <div style={styles.time}>{new Date(payment.updatedAt).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewButton} className="view-button" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayment(payment);
                      }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>
                    <span style={styles.emptyIcon}>🔍</span>
                    <p style={styles.emptyText}>No payments found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== SIDE DRAWER ===== */}
      {selectedPayment && (
        <div style={styles.drawerOverlay} onClick={() => setSelectedPayment(null)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <div>
                <h4 style={styles.drawerTitle}>Payment Details</h4>
                <p style={styles.drawerSubtitle}>Transaction #{selectedPayment.transactionId}</p>
              </div>
              <button
                style={styles.closeButton}
                className="close-button"
                onClick={() => setSelectedPayment(null)}
              >
                ✕
              </button>
            </div>

            <div style={styles.drawerBody}>
              {/* Status Banner */}
              <div style={{
                ...styles.statusBanner,
                backgroundColor: getStatusBgColor(selectedPayment.paymentStatus),
                borderColor: getStatusColor(selectedPayment.paymentStatus),
              }}>
                <span style={styles.statusBannerIcon}>
                  {selectedPayment.paymentStatus === 'verified' ? '✅' : 
                   selectedPayment.paymentStatus === 'pending' ? '⏳' : '❌'}
                </span>
                <div>
                  <div style={styles.statusBannerLabel}>Payment Status</div>
                  <div style={{
                    ...styles.statusBannerValue,
                    color: getStatusColor(selectedPayment.paymentStatus),
                  }}>
                    {selectedPayment.paymentStatus?.toUpperCase() || "PENDING"}
                  </div>
                </div>
              </div>

              {/* Payment Info Grid */}
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💳 Payment Method</span>
                  <span style={styles.detailValue}>{selectedPayment.paymentMethod || "N/A"}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💰 Amount</span>
                  <span style={styles.detailValueHighlight}>{selectedPayment.totalPrice?.toLocaleString()} ETB</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>👤 Customer</span>
                  <span style={styles.detailValue}>{selectedPayment.user?.name || "N/A"}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📧 Email</span>
                  <span style={styles.detailValue}>{selectedPayment.user?.email || "N/A"}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📅 Date</span>
                  <span style={styles.detailValue}>{new Date(selectedPayment.updatedAt).toLocaleString()}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>🆔 Transaction ID</span>
                  <span style={styles.detailValueMono}>{selectedPayment.transactionId}</span>
                </div>
              </div>

              {/* Order Items */}
              {selectedPayment.orderItems?.length > 0 && (
                <div style={styles.orderItems}>
                  <h6 style={styles.orderItemsTitle}>🛒 Order Items</h6>
                  {selectedPayment.orderItems.map((item, index) => (
                    <div key={index} style={styles.orderItem}>
                      <span style={styles.orderItemName}>{item.name}</span>
                      <span style={styles.orderItemDetails}>
                        {item.quantity} × {item.price} ETB
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Receipt Image */}
              {selectedPayment.receiptImage && (
                <div style={styles.receiptSection}>
                  <h6 style={styles.receiptTitle}>📷 Receipt Image</h6>
                  <img
                    src={selectedPayment.receiptImage}
                    alt="Receipt"
                    style={styles.receiptImage}
                  />
                </div>
              )}

              {/* Activity Log */}
              {selectedPayment.paymentLogs?.length > 0 && (
                <div style={styles.activityLog}>
                  <h6 style={styles.activityTitle}>📋 Activity Log</h6>
                  {selectedPayment.paymentLogs.map((log, index) => (
                    <div key={index} style={styles.activityItem}>
                      <span style={styles.activityAction}>{log.action}</span>
                      <span style={styles.activityDate}>
                        {new Date(log.date).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

// ============================================
// STYLES
// ============================================
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: '24px 20px',
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4AB2FF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  exportButton: {
    padding: '12px 24px',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(74, 178, 255, 0.3)',
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '32px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },

  // Filters
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '200px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    padding: '4px 12px',
    border: '1px solid #e2e8f0',
  },
  filterIcon: {
    fontSize: '18px',
    marginRight: '8px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    padding: '10px 0',
    fontSize: '14px',
    outline: 'none',
    flex: 1,
  },
  statusSelect: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: '#F8FAFC',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '150px',
    transition: 'all 0.2s ease',
  },
  dateRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  dateInput: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    backgroundColor: '#F8FAFC',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  dateRangeSeparator: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  amountRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  amountInput: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    backgroundColor: '#F8FAFC',
    outline: 'none',
    width: '100px',
    transition: 'all 0.2s ease',
  },
  amountRangeSeparator: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  clearFiltersButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Table
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  tableCount: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '14px 20px',
    verticalAlign: 'middle',
  },
  transactionId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '500',
  },
  customerName: {
    fontWeight: '500',
    color: '#1e293b',
    fontSize: '14px',
  },
  customerEmail: {
    color: '#94a3b8',
    fontSize: '12px',
  },
  amount: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '15px',
  },
  paymentMethod: {
    fontSize: '13px',
    color: '#64748b',
    textTransform: 'capitalize',
  },
  statusBadge: {
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: '13px',
    color: '#1e293b',
  },
  time: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  viewButton: {
    padding: '6px 16px',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '16px',
  },

  // Drawer
  drawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  drawer: {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '480px',
    maxWidth: '90vw',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
    zIndex: 1001,
    animation: 'slideIn 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  drawerTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  drawerSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
  },
  drawerBody: {
    padding: '24px 28px',
    overflowY: 'auto',
    flex: 1,
  },
  statusBanner: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '24px',
  },
  statusBannerIcon: {
    fontSize: '32px',
  },
  statusBannerLabel: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statusBannerValue: {
    fontSize: '20px',
    fontWeight: '700',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '15px',
    color: '#1e293b',
    fontWeight: '500',
  },
  detailValueHighlight: {
    fontSize: '20px',
    color: '#4AB2FF',
    fontWeight: '700',
  },
  detailValueMono: {
    fontSize: '14px',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  orderItems: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  orderItemsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  orderItemName: {
    color: '#1e293b',
    fontSize: '14px',
  },
  orderItemDetails: {
    color: '#64748b',
    fontSize: '14px',
  },
  receiptSection: {
    marginBottom: '24px',
  },
  receiptTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  receiptImage: {
    width: '100%',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    maxHeight: '300px',
    objectFit: 'contain',
  },
  activityLog: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  activityAction: {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  activityDate: {
    color: '#94a3b8',
    fontSize: '13px',
  },
};

// CSS Animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .export-button:hover {
    background-color: #3a9be8 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 178, 255, 0.4) !important;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
  }
  
  .table-row:hover {
    background-color: #f8fafc !important;
  }
  
  .view-button:hover {
    background-color: #3a9be8 !important;
    transform: scale(1.05);
  }
  
  .clear-filters:hover {
    background-color: #e2e8f0 !important;
  }
  
  .search-input:focus, .date-input:focus, .amount-input:focus, .status-select:focus {
    border-color: #4AB2FF !important;
    box-shadow: 0 0 0 3px rgba(74, 178, 255, 0.1) !important;
  }
  
  .close-button:hover {
    background-color: #f1f5f9 !important;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr !important;
    }
    .header {
      flex-direction: column !important;
    }
    .detail-grid {
      grid-template-columns: 1fr !important;
    }
    .drawer {
      width: 100% !important;
      max-width: 100% !important;
    }
    .filter-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .filter-group {
      min-width: auto !important;
    }
    .date-range, .amount-range {
      flex: 1 !important;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr !important;
    }
    .page-title {
      font-size: 24px !important;
    }
    .drawer-body {
      padding: 16px !important;
    }
  }
`;
document.head.appendChild(styleSheet);