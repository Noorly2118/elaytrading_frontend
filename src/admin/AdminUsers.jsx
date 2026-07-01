import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      const { data } = await adminApi.put(`/admin/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setActionType("delete");
    setShowModal(true);
  };

  const confirmRoleChange = (user) => {
    setSelectedUser(user);
    setActionType("role");
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (actionType === "delete") {
      await deleteUser(selectedUser._id);
    }
    if (actionType === "role") {
      await promoteUser(selectedUser._id);
    }
    setShowModal(false);
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      const { data } = await adminApi.put(`/admin/users/${id}/status`, { isBlocked });
      setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const deleteUser = async (id) => {
    try {
      await adminApi.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  const promoteUser = async (id) => {
    try {
      await updateRole(id, "admin");
    } catch (error) {
      console.error(error);
      alert("Failed to promote user");
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && !user.isBlocked) ||
      (statusFilter === "blocked" && user.isBlocked);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;
  const adminUsers = users.filter(u => u.role === "admin").length;

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading users...</p>
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>👥 User Management</h1>
          <p style={styles.pageSubtitle}>Manage and monitor all registered users</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👤</div>
          <div>
            <p style={styles.statLabel}>Total Users</p>
            <h3 style={styles.statValue}>{totalUsers}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <p style={styles.statLabel}>Active Users</p>
            <h3 style={styles.statValue}>{activeUsers}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚫</div>
          <div>
            <p style={styles.statLabel}>Blocked Users</p>
            <h3 style={styles.statValue}>{blockedUsers}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🛡️</div>
          <div>
            <p style={styles.statLabel}>Admins</p>
            <h3 style={styles.statValue}>{adminUsers}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.filterRow}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          

          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
            <button
              style={styles.clearButton}
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>All Users</h3>
          <span style={styles.tableCount}>{filteredUsers.length} users</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={styles.userName}>{user.name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.userEmail}>{user.email}</span>
                    </td>
                    <td style={styles.td}>
                      <select
                        style={{
                          ...styles.roleSelect,
                          backgroundColor: user.role === "admin" ? "#dbeafe" : "#ffffff",
                          color: user.role === "admin" ? "#2563eb" : "#1e293b",
                        }}
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.statusButton,
                          backgroundColor: user.isBlocked ? "#fee2e2" : "#dcfce7",
                          color: user.isBlocked ? "#dc2626" : "#16a34a",
                        }}
                        onClick={() => toggleBlock(user._id, !user.isBlocked)}
                      >
                        {user.isBlocked ? "🔒 Blocked" : "✅ Active"}
                      </button>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        {user.role !== "admin" && (
                          <button
                            style={styles.promoteButton}
                            onClick={() => confirmRoleChange(user)}
                          >
                            Promote
                          </button>
                        )}
                        <button
                          style={styles.deleteButton}
                          onClick={() => confirmDelete(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.emptyState}>
                    <span style={styles.emptyIcon}>🔍</span>
                    <p style={styles.emptyText}>No users found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h4 style={styles.modalTitle}>
                {actionType === "delete" ? "🗑️ Delete User" : "👑 Promote User"}
              </h4>
              <button style={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              {actionType === "delete" ? (
                <>
                  <p style={styles.modalText}>
                    Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
                  </p>
                  <p style={styles.modalWarning}>
                    This action cannot be undone. All user data will be permanently removed.
                  </p>
                </>
              ) : (
                <>
                  <p style={styles.modalText}>
                    Are you sure you want to promote <strong>{selectedUser?.name}</strong> to admin?
                  </p>
                  <p style={styles.modalInfo}>
                    Admin users have full access to the admin dashboard.
                  </p>
                </>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.modalCancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                style={{
                  ...styles.modalConfirm,
                  backgroundColor: actionType === "delete" ? "#ef4444" : "#4AB2FF",
                }}
                onClick={handleConfirm}
              >
                {actionType === "delete" ? "Delete User" : "Promote to Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

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
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
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
    borderRadius: '14px',
    padding: '18px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
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
    borderRadius: '14px',
    padding: '18px 20px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '200px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    padding: '0 12px',
    border: '1px solid #e2e8f0',
  },
  searchIcon: {
    fontSize: '16px',
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
  filterSelect: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    backgroundColor: '#F8FAFC',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '140px',
  },
  clearButton: {
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
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
  },
  tableTitle: {
    fontSize: '17px',
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
    padding: '12px 16px',
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
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
    flexShrink: 0,
  },
  userName: {
    fontWeight: '500',
    color: '#1e293b',
    fontSize: '14px',
  },
  userEmail: {
    color: '#64748b',
    fontSize: '14px',
  },
  roleSelect: {
    padding: '4px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  statusButton: {
    padding: '4px 14px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  promoteButton: {
    padding: '4px 14px',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    padding: '4px 14px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
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

  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    padding: '18px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0 4px',
  },
  modalBody: {
    padding: '24px',
  },
  modalText: {
    fontSize: '15px',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  modalWarning: {
    fontSize: '14px',
    color: '#ef4444',
    margin: 0,
  },
  modalInfo: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  modalCancel: {
    padding: '8px 20px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modalConfirm: {
    padding: '8px 24px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// CSS for animations and hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .clear-button:hover {
    background-color: #e2e8f0 !important;
  }
  
  .role-select:focus {
    border-color: #4AB2FF !important;
    box-shadow: 0 0 0 3px rgba(74, 178, 255, 0.1) !important;
  }
  
  .status-button:hover {
    transform: scale(1.05);
  }
  
  .promote-button:hover {
    background-color: #3a9be8 !important;
    transform: scale(1.05);
  }
  
  .delete-button:hover {
    background-color: #dc2626 !important;
    transform: scale(1.05);
  }
  
  tr:hover {
    background-color: #f8fafc !important;
  }
  
  .modal-close:hover {
    background-color: #f1f5f9 !important;
  }
  
  .modal-cancel:hover {
    background-color: #e2e8f0 !important;
  }
  
  .modal-confirm:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .search-input:focus {
    border-color: #4AB2FF !important;
  }
  
  .filter-select:focus {
    border-color: #4AB2FF !important;
    box-shadow: 0 0 0 3px rgba(74, 178, 255, 0.1) !important;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr !important;
    }
    .filter-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .search-wrapper {
      min-width: auto !important;
    }
    .filter-select {
      width: 100% !important;
    }
    .action-buttons {
      flex-direction: column !important;
    }
    .modal {
      width: 95% !important;
    }
  }
  
  @media (max-width: 480px) {
    .page-title {
      font-size: 24px !important;
    }
    .stats-grid {
      grid-template-columns: 1fr !important;
    }
    .user-info {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
  }
`;
document.head.appendChild(styleSheet);