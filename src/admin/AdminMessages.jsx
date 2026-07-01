import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

// Isolated Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsVisible(false), 4700);
    const closeTimer = setTimeout(onClose, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const handleManualClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div className={`toast-container ${isVisible ? 'show' : 'hide'}`}>
      <div className={`toast ${type}`}>
        <div className="toast-icon">
          {type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <div className="toast-content">
          <p className="toast-message">{message}</p>
        </div>
        <button className="toast-close" onClick={handleManualClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main Component
const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all"); // Option tracking: "all", "unread", "read"

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/contact");
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load backend communication ledger.", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Automatically mark an item read when selected
  const handleSelectMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === 'unread') {
      await markRead(msg._id);
    }
  };

  const markRead = async (id) => {
    try {
      await adminApi.patch(`/contact/${id}/read`);
      
      setMessages(prev => prev.map(msg => 
        msg._id === id ? { ...msg, status: 'read' } : msg
      ));
      
      setSelected(prev => (prev && prev._id === id ? { ...prev, status: 'read' } : prev));
    } catch (err) {
      console.error(err);
      showToast("Failed to update status on server context", 'error');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;

    try {
      await adminApi.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(msg => msg._id !== id));
      
      if (selected?._id === id) {
        setSelected(null);
      }
      showToast("Message deleted successfully", 'success');
    } catch (err) {
      console.error(err);
      showToast("Failed to delete requested message index", 'error');
    }
  };

  // Filter computation logic 
  const filteredMessages = messages.filter(msg => {
    if (filter === "unread") return msg.status === "unread";
    if (filter === "read") return msg.status === "read";
    return true;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <>
      <style>{customInlineStyles}</style>

      <div className="admin-messages-container">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="row g-3">
          {/* Left Side: Inbox List Column */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100 msg-sidebar-card">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold d-flex align-items-center" style={{ color: '#0F172A', fontSize: '1.25rem' }}>
                  Inbox
                  {unreadCount > 0 && (
                    <span className="ms-2 badge unread-indicator-pill">
                      {unreadCount} New
                    </span>
                  )}
                </h4>
                <button
                  className="btn btn-refresh-sync"
                  onClick={fetchMessages}
                  disabled={loading}
                  title="Synchronize Inbox"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Segment Filtering Chips Tab Bar */}
              <div className="filter-chip-bar px-3 pb-2 d-flex gap-1">
                {["all", "unread", "read"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`chip-btn ${filter === type ? 'active' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="message-list">
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner-border-custom"></div>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-5 px-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                      <path d="M22 6.5L12 13L2 6.5M22 6.5V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6.5M22 6.5L12 13M2 6.5L12 13" strokeLinecap="round"/>
                    </svg>
                    <h6 className="mt-3 fw-semibold text-secondary">No items found</h6>
                    <p className="text-muted small mb-0">No context available inside this layout queue.</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <button
                      key={msg._id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`message-item text-start ${msg.status === 'unread' ? 'unread' : ''} ${selected?._id === msg._id ? 'selected' : ''}`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="message-sender">{msg.name || "Anonymous Guest"}</div>
                        <span className="message-date">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="message-email">{msg.email}</div>
                      <div className="message-subject">{msg.subject || "(No Subject Provided)"}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Active Detailed View Column */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 h-100 detail-main-card">
              {selected ? (
                <div className="d-flex flex-column h-100">
                  <div className="detail-header">
                    <div className="flex-grow-1">
                      <h5 className="detail-subject">{selected.subject || "(No Subject)"}</h5>
                      <div className="detail-sender mt-1">
                        <strong style={{ color: '#334155' }}>{selected.name}</strong> 
                        <span className="text-muted"> &lt;{selected.email}&gt;</span>
                      </div>
                      <div className="detail-date text-muted mt-1">
                        Received: {new Date(selected.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="detail-actions">
                      <button
                        className="btn-action btn-action-danger"
                        onClick={() => deleteMessage(selected._id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="card-body bg-white p-4 flex-grow-1">
                    <div className="detail-message">{selected.message}</div>
                  </div>
                </div>
              ) : (
                <div className="detail-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
                  </svg>
                  <h5>Select a conversation item</h5>
                  <p className="text-muted small mb-0">Choose an incoming message pipeline card from your sidebar ledger panel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Refined Modern CSS Variables & Utility Styles
const customInlineStyles = `
  .admin-messages-container {
    background-color: #F8FAFC;
    min-height: 100vh;
    padding: 24px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .msg-sidebar-card, .detail-main-card {
    border-radius: 12px !important;
    overflow: hidden;
  }
  .unread-indicator-pill {
    background-color: #EFF6FF;
    color: #2563EB;
    font-weight: 700;
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: 20px;
  }
  .btn-refresh-sync {
    background: #F1F5F9;
    border: none;
    color: #475569;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  .btn-refresh-sync:hover {
    background: #E2E8F0;
    color: #0F172A;
  }
  .filter-chip-bar {
    border-bottom: 1px solid #EDF2F7;
  }
  .chip-btn {
    border: none;
    background: #F1F5F9;
    color: #64748B;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    padding: 4px 12px;
    border-radius: 14px;
    transition: all 0.15s ease;
  }
  .chip-btn:hover {
    background: #E2E8F0;
  }
  .chip-btn.active {
    background: #0F172A;
    color: #FFFFFF;
  }
  .message-list {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
  .message-item {
    width: 100%;
    background: #FFFFFF;
    border: none;
    padding: 16px;
    border-bottom: 1px solid #F1F5F9;
    border-left: 4px solid transparent;
    transition: all 0.15s ease;
  }
  .message-item:hover {
    background: #F8FAFC;
  }
  .message-item.unread {
    background: #F0F7FF;
  }
  .message-item.unread:hover {
    background: #E0F2FE;
  }
  .message-item.selected {
    background: #E2E8F0 !important;
    border-left-color: #0F172A;
  }
  .message-sender {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1E293B;
  }
  .message-item.unread .message-sender {
    color: #2563EB;
    font-weight: 700;
  }
  .message-email {
    font-size: 0.75rem;
    color: #64748B;
    margin-bottom: 4px;
  }
  .message-subject {
    font-size: 0.825rem;
    font-weight: 500;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .message-date {
    font-size: 0.75rem;
    color: #94A3B8;
  }
  .detail-header {
    background: #FFFFFF;
    padding: 24px;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }
  .detail-subject {
    font-weight: 700;
    color: #0F172A;
    font-size: 1.25rem;
    margin: 0;
  }
  .detail-sender {
    font-size: 0.9rem;
  }
  .detail-date {
    font-size: 0.8rem;
  }
  .detail-message {
    white-space: pre-wrap;
    line-height: 1.7;
    color: #334155;
    font-size: 0.95rem;
  }
  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 420px;
    color: #64748B;
    padding: 40px;
    text-align: center;
  }
  .detail-empty svg {
    width: 64px;
    height: 64px;
    color: #CBD5E1;
    margin-bottom: 16px;
  }
  .btn-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .btn-action-danger {
    background: #FEE2E2;
    color: #DC2626;
  }
  .btn-action-danger:hover {
    background: #FCA5A5;
    color: #991B1B;
  }
  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
  }
  .spinner-border-custom {
    width: 28px;
    height: 28px;
    border: 3px solid #E2E8F0;
    border-radius: 50%;
    border-top-color: #0F172A;
    animation: spin-kf 0.7s linear infinite;
  }
  @keyframes spin-kf {
    to { transform: rotate(360deg); }
  }

  /* Toast Framework overrides */
  .toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1050;
    width: 320px;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }
  .toast-container.hide {
    transform: translateY(-20px);
    opacity: 0;
    pointer-events: none;
  }
  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FFFFFF;
    padding: 14px 16px;
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    border-left: 4px solid #CBD5E1;
  }
  .toast.success { border-left-color: #10B981; }
  .toast.error { border-left-color: #EF4444; }
  .toast-icon { display: flex; align-items: center; }
  .toast.success .toast-icon { color: #10B981; }
  .toast.error .toast-icon { color: #EF4444; }
  .toast-content { flex-grow: 1; }
  .toast-message { margin: 0; font-size: 0.85rem; font-weight: 600; color: #1E293B; }
  .toast-close { background: transparent; border: none; color: #94A3B8; cursor: pointer; }
  
  @media(max-width: 991px) {
    .message-list { max-height: 280px; }
  }
`;

export default AdminMessages;