import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';
import toast, { Toaster } from 'react-hot-toast';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  
  // Modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get(`/orders/${id}`);
      setOrder(data);
      setStatus(data.status);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
      toast.error(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleVerifyPayment = async () => {
    setShowVerifyModal(false);
    setUpdating(true);
    try {
      const { data } = await adminApi.put(`/orders/${id}/verify-payment`);
      setOrder(data.order || data);
      toast.success('Payment verified successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectPayment = async () => {
    setShowRejectModal(false);
    setUpdating(true);
    try {
      const { data } = await adminApi.put(`/orders/${id}/reject-payment`);
      setOrder(data.order || data);
      toast.success('Payment rejected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === order.status) {
      setShowStatusModal(false);
      return;
    }

    setShowStatusModal(false);
    setUpdating(true);
    try {
      const { data } = await adminApi.put(`/orders/${id}`, { status: newStatus });
      setOrder(data);
      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (e) => {
    const newStatus = e.target.value;
    if (newStatus === order.status) return;
    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading order details...</p>
    </div>
  );
  
  if (error) return (
    <div style={styles.errorContainer}>
      <span style={styles.errorIcon}>⚠️</span>
      <p style={styles.errorText}>{error}</p>
    </div>
  );
  
  if (!order) return (
    <div style={styles.emptyContainer}>
      <span style={styles.emptyIcon}>📦</span>
      <p style={styles.emptyText}>Order not found</p>
    </div>
  );

  const orderItems = order.orderItems || [];
  const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div style={styles.pageWrapper} className="page-wrapper">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: '#10b981', color: '#fff' } },
          error: { style: { background: '#ef4444', color: '#fff' } },
        }}
      />

      {/* Verify Payment Modal */}
      <div className={`modal ${showVerifyModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showVerifyModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1150 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" style={{ fontWeight: 600 }}>Verify Payment</h5>
              <button type="button" className="btn-close" onClick={() => setShowVerifyModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to verify this payment?</p>
              <p className="text-success fw-bold mb-0">✓ This will confirm the payment</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={() => setShowVerifyModal(false)} style={styles.modalCancelBtn}>Cancel</button>
              <button className="btn btn-success" onClick={handleVerifyPayment} disabled={updating} style={styles.modalSuccessBtn}>
                {updating ? 'Verifying...' : 'Verify Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Payment Modal */}
      <div className={`modal ${showRejectModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showRejectModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1150 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" style={{ fontWeight: 600 }}>Reject Payment</h5>
              <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to reject this payment?</p>
              <p className="text-danger fw-bold mb-0">⚠️ This action cannot be undone</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={() => setShowRejectModal(false)} style={styles.modalCancelBtn}>Cancel</button>
              <button className="btn btn-danger" onClick={handleRejectPayment} disabled={updating} style={styles.modalDangerBtn}>
                {updating ? 'Rejecting...' : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <div className={`modal ${showStatusModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showStatusModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1150 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" style={{ fontWeight: 600 }}>Update Order Status</h5>
              <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to update the order status to <strong>{pendingStatus}</strong>?</p>
              <p className="text-warning fw-bold mb-0">⚠️ This will update the order status</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={() => setShowStatusModal(false)} style={styles.modalCancelBtn}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleStatusUpdate(pendingStatus)} disabled={updating} style={styles.modalPrimaryBtn}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header} className="header">
        <div style={styles.headerLeft}>
          <h1 style={styles.pageTitle} className="page-title">Order Details</h1>
          <p style={styles.orderId}>
            Order ID: <span style={styles.orderIdValue}>{order._id}</span>
          </p>
        </div>
        <button onClick={() => navigate('/admin/orders')} style={styles.backButton} className="back-button">
          ← Back to Orders
        </button>
      </div>

      <div style={styles.gridContainer} className="grid-container">
        {/* Main Content */}
        <div style={styles.mainContent} className="main-content">
          {/* Order Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order Information</h2>
            <div style={styles.infoGrid} className="info-grid">
              <div>
                <p style={styles.infoLabel}>Order Date</p>
                <p style={styles.infoValue}>{new Date(order.createdAt).toLocaleString('en-ET')}</p>
              </div>
              <div>
                <p style={styles.infoLabel}>Customer Name</p>
                <p style={styles.infoValue}>{order.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p style={styles.infoLabel}>Email Address</p>
                <p style={styles.infoValue}>{order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p style={styles.infoLabel}>Phone Number</p>
                <p style={styles.infoValue}>{order.shippingInfo?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Shipping Information</h2>
            <div style={styles.shippingGrid} className="shipping-grid">
              <div><span style={styles.shippingLabel}>Full Name:</span> {order.shippingInfo?.fullName}</div>
              <div><span style={styles.shippingLabel}>Phone:</span> {order.shippingInfo?.phone}</div>
              <div><span style={styles.shippingLabel}>City:</span> {order.shippingInfo?.city}</div>
              <div><span style={styles.shippingLabel}>Address:</span> {order.shippingInfo?.address}</div>
              {order.shippingInfo?.note && (
                <div style={styles.shippingNote} className="shipping-note">
                  <span style={styles.shippingLabel}>Note:</span> {order.shippingInfo.note}
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Ordered Products</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table} className="table">
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableHeaderCell}>Product</th>
                    <th style={styles.tableHeaderCellRight}>Price</th>
                    <th style={styles.tableHeaderCellCenter}>Qty</th>
                    <th style={styles.tableHeaderCellRight}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index} style={styles.tableRow} className="table-row">
                      <td style={styles.productCell} className="product-cell">
                        {item.image && (
                          <img src={item.image} alt={item.name} style={styles.productImage} />
                        )}
                        <span style={styles.productName}>{item.name}</span>
                      </td>
                      <td style={styles.priceCell}>{Number(item.price).toLocaleString()} ETB</td>
                      <td style={styles.quantityCell}>{item.quantity}</td>
                      <td style={styles.subtotalCell}>
                        {(Number(item.price) * item.quantity).toLocaleString()} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar} className="sidebar-section">
          {/* Payment Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Payment Information</h2>
            <div style={styles.paymentInfo}>
              <div>
                <p style={styles.infoLabel}>Payment Method</p>
                <p style={styles.paymentMethod}>{order.paymentMethod}</p>
              </div>

              <div>
                <p style={styles.infoLabel}>Transaction ID</p>
                <div style={styles.transactionId}>{order.transactionId}</div>
              </div>

              <div>
                <p style={styles.infoLabel}>Payment Status</p>
                <span style={{
                  ...styles.paymentStatus,
                  ...(order.paymentStatus === 'verified' ? styles.statusVerified :
                      order.paymentStatus === 'rejected' ? styles.statusRejected :
                      styles.statusPending)
                }}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>

              {order.receiptImage && (
                <div>
                  <p style={styles.infoLabel}>Receipt Image</p>
                  <img src={order.receiptImage} alt="Receipt" style={styles.receiptImage} />
                </div>
              )}
            </div>

            {order.paymentStatus === 'pending' && (
              <div style={styles.actionButtons} className="action-buttons">
                <button onClick={() => setShowVerifyModal(true)} disabled={updating} style={styles.verifyButton} className="verify-button">
                  Verify Payment
                </button>
                <button onClick={() => setShowRejectModal(true)} disabled={updating} style={styles.rejectButton} className="reject-button">
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* Order Status Adjuster */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order Status</h2>
            <div style={{ position: 'relative' }}>
              <select value={status} onChange={openStatusModal} disabled={updating} style={styles.statusSelect} className="status-select">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Order Summary */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order Summary</h2>
            <div style={styles.summaryContent}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Total Items</span>
                <span style={styles.summaryValue}>{totalItems} items</span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Grand Total</span>
                <span style={styles.totalValue}>
                  {Number(order.totalPrice).toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;

const styles = {
  pageWrapper: {
    backgroundColor: '#F8FAFC',
    padding: '24px 0',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E2E8F0',
    borderTop: '3px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#64748B',
    fontSize: '15px',
    fontWeight: '500',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '12px',
  },
  errorIcon: { fontSize: '40px' },
  errorText: { color: '#EF4444', fontSize: '16px', fontWeight: '500' },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '12px',
  },
  emptyIcon: { fontSize: '48px' },
  emptyText: { color: '#64748B', fontSize: '16px', fontWeight: '500' },

  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
    width: '100%',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
  },
  orderId: {
    color: '#64748B',
    fontSize: '14px',
    margin: 0,
  },
  orderIdValue: {
    color: '#334155',
    fontWeight: '600',
  },
  backButton: {
    padding: '10px 18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    color: '#334155',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    width: 'fit-content',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
  },

  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 20px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid #F1F5F9',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: '11px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    color: '#334155',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
  },

  shippingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
    color: '#475569',
    fontSize: '14px',
  },
  shippingLabel: {
    fontWeight: '600',
    color: '#0F172A',
    marginRight: '6px',
  },
  shippingNote: {
    gridColumn: '1',
    backgroundColor: '#F8FAFC',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    marginTop: '6px',
  },

  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '12px 16px',
    color: '#64748B',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tableHeaderCellRight: {
    textAlign: 'right',
    padding: '12px 16px',
    color: '#64748B',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tableHeaderCellCenter: {
    textAlign: 'center',
    padding: '12px 16px',
    color: '#64748B',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background-color 0.15s ease',
  },
  productCell: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  productImage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    flexShrink: 0,
  },
  productName: {
    fontWeight: '600',
    color: '#0F172A',
    fontSize: '14px',
  },
  priceCell: {
    padding: '14px 16px',
    textAlign: 'right',
    fontWeight: '500',
    color: '#475569',
    fontSize: '14px',
  },
  quantityCell: {
    padding: '14px 16px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#0F172A',
    fontSize: '14px',
  },
  subtotalCell: {
    padding: '14px 16px',
    textAlign: 'right',
    fontWeight: '600',
    color: '#0F172A',
    fontSize: '14px',
  },

  paymentInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  paymentMethod: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0F172A',
    textTransform: 'capitalize',
    margin: 0,
  },
  transactionId: {
    backgroundColor: '#F8FAFC',
    padding: '10px 14px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    color: '#334155',
    fontSize: '13px',
    wordBreak: 'break-all',
    border: '1px solid #E2E8F0',
  },
  paymentStatus: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.3px',
  },
  statusVerified: { backgroundColor: '#DCFCE7', color: '#15803D' },
  statusRejected: { backgroundColor: '#FEE2E2', color: '#B91C1C' },
  statusPending: { backgroundColor: '#EFF6FF', color: '#1D4ED8' },
  receiptImage: {
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    marginTop: '6px',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '24px',
  },
  verifyButton: {
    padding: '11px',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  rejectButton: {
    padding: '11px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  statusSelect: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
  },

  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { color: '#64748B', fontSize: '14px' },
  summaryValue: { fontWeight: '600', color: '#0F172A', fontSize: '14px' },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #F1F5F9',
    marginTop: '4px',
  },
  totalLabel: { fontSize: '15px', fontWeight: '700', color: '#0F172A' },
  totalValue: { fontSize: '20px', fontWeight: '800', color: '#3B82F6' },

  modalCancelBtn: { background: '#F1F5F9', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', color: '#475569' },
  modalSuccessBtn: { background: '#10B981', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', color: 'white' },
  modalDangerBtn: { background: '#EF4444', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', color: 'white' },
  modalPrimaryBtn: { background: '#3B82F6', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', color: 'white' },
};

if (!document.getElementById('admin-order-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'admin-order-styles';
  styleSheet.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .back-button:hover { background-color: #F8FAFC !important; border-color: #CBD5E1 !important; }
    .table-row:hover { background-color: #F8FAFC; }
    .verify-button:hover:not(:disabled) { background-color: #2563EB !important; }
    .reject-button:hover:not(:disabled) { background-color: #DC2626 !important; }
    .status-select:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .status-select:hover { border-color: #CBD5E1; }
    .modal-content { border: none !important; border-radius: 12px !important; box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important; }
    
    @media (min-width: 768px) {
      .header { flex-direction: row !important; justify-content: space-between !important; align-items: center !important; }
      .info-grid, .shipping-grid { grid-template-columns: 1fr 1fr !important; }
      .shipping-note { grid-column: 1 / -1 !important; }
    }
    @media (min-width: 1024px) {
      .grid-container { flex-direction: row !important; }
      .main-content { width: 68% !important; }
      .sidebar-section { width: 32% !important; }
    }
    @media (max-width: 480px) {
      .product-cell { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
      .action-buttons { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(styleSheet);
}