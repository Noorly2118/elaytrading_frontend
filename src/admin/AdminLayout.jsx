import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get admin name
  useEffect(() => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (adminInfo?.email) {
        const nameFromEmail = adminInfo.email.split("@")[0];
        const formattedName = nameFromEmail
          .replace(/[._]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        setAdminName(formattedName);
      }
    } catch (error) {
      console.error("Error parsing admin info:", error);
    }
  }, []);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminInfo");
    setShowLogoutModal(false);
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Categories", path: "/admin/categories", icon: "🏷️" },
    { name: "Orders", path: "/admin/orders", icon: "📋" },
    { name: "Payments", path: "/admin/payments", icon: "💰" },
    { name: "User Management", path: "/admin/users", icon: "👥" },
    { name: "Messages", path: "/admin/messages", icon: "💬" },
  ];

  return (
    <div style={styles.adminWrapper}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
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
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      {/* Logout Modal */}
      <div 
        className={`modal ${showLogoutModal ? 'show d-block' : ''}`} 
        tabIndex="-1" 
        role="dialog" 
        style={{ 
          display: showLogoutModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1050,
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" style={{ fontWeight: 600 }}>
                <span style={{ marginRight: '10px' }}>🚪</span> Logout
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={cancelLogout}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Are you sure you want to logout?</p>
              <p className="text-muted mb-0" style={{ color: '#64748b' }}>You'll need to login again to access admin features.</p>
            </div>
            <div className="modal-footer border-0">
              <button 
                className="btn btn-light" 
                onClick={cancelLogout}
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmLogout}
                style={styles.modalLogoutBtn}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        width: isMobile ? (sidebarOpen ? "260px" : "0") : (sidebarOpen ? "260px" : "80px"),
        transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.brand}>
            <svg width="200" height="50" viewBox="0 0 280 60">
              <defs>
                <linearGradient id="scienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E6F4FF" />
                  <stop offset="50%" stopColor="#99D6FF" />
                  <stop offset="100%" stopColor="#4AB2FF" />
                </linearGradient>
                <linearGradient id="commerceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFE066" />
                  <stop offset="100%" stopColor="#FFC107" />
                </linearGradient>
              </defs>
              <g transform="translate(15, 10)">
                <g fill="url(#scienceGradient)">
                  <circle cx="0" cy="25" r="5" />
                  <circle cx="20" cy="10" r="5" />
                  <circle cx="20" cy="25" r="5" />
                  <circle cx="20" cy="40" r="5" />
                  <circle cx="40" cy="10" r="5" />
                  <circle cx="40" cy="25" r="5" />
                  <circle cx="40" cy="40" r="5" />
                </g>
                <g stroke="url(#scienceGradient)" strokeWidth="4" strokeLinecap="round">
                  <line x1="0" y1="10" x2="20" y2="10" />
                  <line x1="0" y1="25" x2="20" y2="25" />
                  <line x1="0" y1="40" x2="20" y2="40" />
                  <line x1="20" y1="10" x2="40" y2="10" />
                  <line x1="20" y1="25" x2="40" y2="25" />
                  <line x1="20" y1="40" x2="40" y2="40" />
                </g>
                <path d="M5 30 Q 22 18, 42 30" fill="none" stroke="url(#commerceGradient)" strokeWidth="3" strokeLinecap="round" />
              </g>
              {(sidebarOpen || isMobile) && (
                <g>
                  <text x="75" y="35" fontSize="28" fontWeight="800" fill="#fff">ELAY</text>
                  <text x="75" y="52" fontSize="14" fontWeight="600" fill="#CCE7FF">TRADING</text>
                </g>
              )}
            </svg>
            {sidebarOpen && <h2 style={styles.logo}>Elay Trading</h2>}
          </div>
          {(sidebarOpen || isMobile) && (
            <div style={styles.adminBadge}>
              <span style={styles.adminBadgeText}>{adminName}</span>
            </div>
          )}
        </div>

        <div style={styles.navSection}>
          {(sidebarOpen || isMobile) && <div style={styles.navLabel}>Main Menu</div>}
          <nav style={styles.nav}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.menuItem,
                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                  }}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#94A3B8";
                    }
                  }}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  {(sidebarOpen || isMobile) && (
                    <span style={styles.menuText}>{item.name}</span>
                  )}
                  {isActive && (sidebarOpen || isMobile) && (
                    <span style={styles.activeIndicator}></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        ...styles.mainContent,
        marginLeft: isMobile ? "0" : sidebarOpen ? "260px" : "80px",
      }}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <button 
              onClick={toggleSidebar} 
              style={styles.toggleBtn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F1F5F9"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              aria-label="Toggle sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <div style={styles.pageTitle}>
              <span style={styles.pageTitleText}>Admin Dashboard</span>
            </div>
          </div>

          <div style={styles.topbarRight}>
            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{adminName}</div>
                <div style={styles.userRole}>Administrator</div>
              </div>
              <div style={styles.userAvatar}>
                {adminName.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={handleLogoutClick} 
                style={styles.logoutBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#EF4444";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '2px' }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <style>{`
        body {
          overflow: hidden;
          height: 100vh;
          margin: 0;
          padding: 0;
        }
        
        #root {
          height: 100vh;
          overflow: hidden;
        }
        
        .modal-content {
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important;
        }
        
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        @media (max-width: 992px) {
          .page-content {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

const styles = {
  adminWrapper: {
    position: "relative",
    height: "100vh",
    width: "100%",
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    backgroundColor: "#1C1B22",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1100,
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
  },

  sidebarHeader: {
    padding: "24px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    display: "none", // SVG code text elements cover this to look clean
  },

  adminBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "4px 12px",
    borderRadius: "14px",
    display: "inline-block",
    marginTop: "14px",
  },

  adminBadgeText: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#94A3B8",
  },

  navSection: {
    padding: "24px 16px",
  },

  navLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#4A4950",
    padding: "0 12px",
    marginBottom: "12px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    fontWeight: "500",
    fontSize: "14px",
    position: "relative",
  },

  menuIcon: {
    fontSize: "16px",
    width: "24px",
    textAlign: "center",
  },

  menuText: {
    flex: 1,
  },

  activeIndicator: {
    width: "4px",
    height: "16px",
    backgroundColor: "#3B82F6",
    borderRadius: "2px",
    marginLeft: "auto",
  },

  mainContent: {
    flex: 1,
    height: "100vh",
    transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  topbar: {
    height: "70px",
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    flexShrink: 0,
  },

  topbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  toggleBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    color: "#64748B",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pageTitle: {
    display: "flex",
    alignItems: "center",
  },

  pageTitleText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0F172A",
  },

  topbarRight: {
    display: "flex",
    alignItems: "center",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  userInfo: {
    textAlign: "right",
  },

  userName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#0F172A",
    lineHeight: "1.2",
  },

  userRole: {
    fontSize: "12px",
    color: "#94A3B8",
  },

  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
    border: "1px solid #E2E8F0",
  },

  logoutBtn: {
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  pageContent: {
    flex: 1,
    padding: "28px",
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    zIndex: 1050,
  },

  modalCancelBtn: {
    background: "#F1F5F9",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
    color: "#475569",
    cursor: "pointer",
  },

  modalLogoutBtn: {
    background: "#EF4444",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
    color: "white",
    cursor: "pointer",
  },
};