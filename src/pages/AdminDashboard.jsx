import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
const [form, setForm] = useState({
  name: "",
  category: "",
  price: "",
  image: "",
  stock: "",
  description: ""
});  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
    recentOrders: 0
  });

 const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
const token = adminInfo?.token;

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }

  }, [token, navigate]);

  const fetchProducts = async () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const { data } = await adminApi.get("/products", {
headers: { Authorization: `Bearer ${token}` }
    });
    const productsData = Array.isArray(data) ? data : data.products || [];
    setProducts(productsData);

    
    // Update stats
    const categories = [...new Set(productsData.map(p => p.category))];
    const totalValue = productsData.reduce((sum, p) => sum + (p.price || 0), 0);
    setStats({
      totalProducts: productsData.length,
      totalCategories: categories.length,
      totalValue: totalValue,
      recentOrders: Math.floor(Math.random() * 50) + 10 // Example
    });
  };
const fetchCategories = async () => {
  try {
    const { data } = await adminApi.get("/categories");

    const categoriesData = Array.isArray(data)
      ? data
      : data.categories || [];

    console.log("CATEGORIES:", categoriesData);

    setCategories(categoriesData);
  } catch (error) {
    console.error("Category fetch error:", error);
  }
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) throw new Error("Admin not logged in");
      if (editId) {
        await adminApi.put(`/products/${editId}`, { ...form, price: Number(form.price) }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
      await adminApi.post("/products", form, {
  headers: { Authorization: `Bearer ${token}` }
});
      }
   setForm({
  name: "",
  category: "",
  price: "",
  image: "",
  stock: "",
  description: "" // ✅
});
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Action failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

 const handleEdit = (product) => {
  setForm({
    name: product.name,
    category: product.category?._id || product.category,
    price: product.price,
    image: product.image,
    stock: product.stock,
    description: product.description || "" // ✅
  });
  setEditId(product._id);
};


  const handleDelete = async (id) => {
    if (!token) return alert("Admin not logged in");
    if (window.confirm("Delete this product?")) {
      try {
        await adminApi.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Delete failed.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const styles = {
    dashboard: {
      display: "flex",
      minHeight: "100vh",
      background: "#f0f2f5",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    sidebar: {
      width: sidebarOpen ? "280px" : "80px",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      color: "white",
      transition: "all 0.3s ease",
      position: "fixed",
      height: "100vh",
      overflowY: "auto",
      zIndex: 1000,
      boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
    },
    sidebarHeader: {
      padding: "24px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    logo: {
      fontSize: "20px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    toggleBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    nav: {
      padding: "20px 0"
    },
    navItem: {
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "rgba(255,255,255,0.8)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      margin: "4px 0"
    },
    main: {
      flex: 1,
      marginLeft: sidebarOpen ? "280px" : "80px",
      transition: "all 0.3s ease",
      padding: "20px"
    },
    topBar: {
      background: "white",
      padding: "15px 25px",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    pageTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1e3c72"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
      marginBottom: "30px"
    },
    statCard: {
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "transform 0.3s ease",
      cursor: "pointer"
    },
    cardContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    cardInfo: {
      flex: 1
    },
    cardTitle: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "8px",
      fontWeight: "500"
    },
    cardValue: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#1e3c72"
    },
    cardIcon: {
      fontSize: "48px",
      opacity: 0.3
    },
    formSection: {
      background: "white",
      borderRadius: "12px",
      padding: "25px",
      marginBottom: "30px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e3c72",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "2px solid #e5e7eb"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease"
    },
    button: {
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      color: "white",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    tableWrapper: {
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      padding: "15px",
      textAlign: "left",
      background: "#f8fafc",
      color: "#1f2937",
      fontWeight: "600",
      borderBottom: "2px solid #e5e7eb"
    },
    td: {
      padding: "15px",
      borderBottom: "1px solid #e5e7eb",
      verticalAlign: "middle"
    },
    productImage: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "8px"
    },
    editBtn: {
      background: "#f59e0b",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "8px"
    },
    deleteBtn: {
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer"
    },
    logoutBtn: {
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500"
    },
    mobileMenuBtn: {
      display: "none",
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <span>⚗️</span>
            {sidebarOpen && <span>Elay Admin</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.toggleBtn}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <div style={styles.nav}>
          {[
            { icon: "📊", label: "Dashboard", active: true },
            { icon: "📦", label: "Products" },
            { icon: "📝", label: "Orders" },
            { icon: "👥", label: "Users" },
            { icon: "⚙️", label: "Settings" }
          ].map((item, idx) => (
            <div key={idx} style={{...styles.navItem, background: item.active ? "rgba(255,255,255,0.2)" : "transparent"}}>
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          {[
            { title: "Total Products", value: stats.totalProducts, icon: "📦", color: "#3b82f6" },
            { title: "Categories", value: stats.totalCategories, icon: "🏷️", color: "#10b981" },
            { title: "Total Value", value: `$${stats.totalValue.toLocaleString()}`, icon: "💰", color: "#f59e0b" },
            { title: "Recent Orders", value: stats.recentOrders, icon: "📝", color: "#8b5cf6" }
          ].map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <div style={styles.cardContent}>
                <div style={styles.cardInfo}>
                  <div style={styles.cardTitle}>{stat.title}</div>
                  <div style={styles.cardValue}>{stat.value}</div>
                </div>
                <div style={{...styles.cardIcon, color: stat.color}}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Form */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>
            {editId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
                required
              />
              <select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  style={styles.input}
  required
>
  <option value="" disabled hidden >Select Category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>
<textarea
  placeholder="Product Description (detailed info...)"
  value={form.description || ""}
  onChange={(e) => setForm({ ...form, description: e.target.value })}
  style={{ ...styles.input, minHeight: "120px" }}
  required
/>

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                style={styles.input}
                required
              />
              <input
  type="number"
  placeholder="Stock"
  value={form.stock || ""}
  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
  style={styles.input}
  required
/>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Processing..." : (editId ? "Update Product" : "Add Product")}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", category: "", price: "", image: "" });
                  }}
                  style={{...styles.button, background: "#6b7280"}}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td style={styles.td}>
                    <img src={p.image} alt={p.name} style={styles.productImage} />
                  </td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category?.name}</td>
                  <td style={styles.td}>${p.price}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(p)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;