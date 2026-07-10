import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import * as XLSX from "xlsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    stock: "",
    description: "",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await adminApi.get("/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await adminApi.get("/categories");
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
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
      if (editId) {
        await adminApi.put(`/products/${editId}`, form);
        toast.success("Product updated successfully!");
      } else {
        await adminApi.post("/products", form);
        toast.success("Product added successfully!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category?._id || p.category,
      price: p.price,
      image: p.image,
      stock: p.stock,
      description: p.description || "",
    });
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await adminApi.delete(`/products/${deleteTarget}`);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

 const handleImportProducts = async () => {
  if (!importFile) {
    toast.error("Please select an Excel file");
    return;
  }

  try {
    setImportLoading(true);

    const formData = new FormData();
    formData.append("file", importFile);

    const { data } = await adminApi.post(
      "/products/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setImportResult(data);
    fetchProducts();

    if (data.imported > 0) {
      toast.success(
        `Successfully imported ${data.imported} products!`
      );
    }

    if (data.failedCount > 0) {
      toast.warn(
        `${data.failedCount} products failed to import`
      );
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Import failed"
    );
  } finally {
    setImportLoading(false);
  }
};

  const downloadTemplate = () => {
    const data = [
      {
        name: "",
        category: "",
        description: "",
        price: "",
        image: "",
        stock: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "product-import-template.xlsx");
    toast.success("Template downloaded successfully!");
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      image: "",
      stock: "",
      description: "",
    });
    setEditId(null);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageWrapper}>
     

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showDeleteModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Delete Product</h5>
              <button type="button" className="btn-close" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product?</p>
              <p className="text-danger fw-bold mb-0">⚠️ This action cannot be undone</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete Product</button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Products</h1>
          <p style={styles.pageSubtitle}>Manage your product inventory</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.importButton} className="import-button" onClick={() => setShowModal(true)}>
            📥 Import
          </button>
          <button style={styles.templateButton} className="template-button" onClick={downloadTemplate}>
            📄 Template
          </button>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h3 style={styles.formTitle}>
            {editId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h3>
          {editId && (
            <button style={styles.cancelEditButton} className="cancel-edit" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid} className="form-grid">
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                style={styles.input}
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                style={styles.select}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price (ETB)</label>
              <input
                type="number"
                style={styles.input}
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                style={styles.input}
                placeholder="Quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>

            <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
              <label style={styles.label}>Image URL</label>
              <input
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                required
              />
              {form.image && (
                <div style={styles.imagePreview}>
                  <img src={form.image} alt="Preview" style={styles.previewImage} />
                </div>
              )}
            </div>

            <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                rows="3"
                placeholder="Product description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
              <button style={styles.submitButton} className="submit-button" type="submit" disabled={loading}>
                {loading ? "Processing..." : editId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.tableTitle}>All Products</h3>
            <p style={styles.tableSubtitle}>{products.length} products</p>
          </div>
          <div style={styles.searchWrapper}>
            <input
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.productInfo}>
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          style={styles.productImage}
                          onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='10' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"}
                        />
                        <span style={styles.productName}>{p.name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>
                        {p.category?.name || "N/A"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.priceText}>{p.price} ETB</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.stockText}>{p.stock}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button style={styles.editButton} className="edit-button" onClick={() => handleEdit(p)}>
                          Edit
                        </button>
                        <button style={styles.deleteButton} className="delete-button" onClick={() => handleDeleteClick(p._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.emptyState}>
                    <p style={styles.emptyText}>No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h4 style={styles.modalTitle}>Import Products</h4>
              <button style={styles.modalClose} className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.fileUpload}>
                <label style={styles.fileLabel} className="file-label">
                  📂 Select Excel File
                  <input
                    type="file"
                    style={styles.fileInput}
                    accept=".xlsx,.xls"
                    onChange={(e) => setImportFile(e.target.files[0])}
                  />
                </label>
                {importFile && (
                  <p style={styles.fileName}>📄 {importFile.name}</p>
                )}
              </div>

              <div style={styles.infoBox}>
                <strong>Expected Columns:</strong>
                <ul style={styles.infoList}>
                  <li>Name</li>
                  <li>Category</li>
                  <li>Description</li>
                  <li>Price</li>
                  <li>Stock</li>
                  <li>Image URL</li>
                </ul>
              </div>

              {importResult && (
                <div style={styles.importResult}>
                  <div style={styles.resultStats} className="result-stats">
                    <div style={styles.resultSuccess}>
                      ✅ Imported: {importResult.imported}
                    </div>
                    <div style={styles.resultFailed}>
                      ❌ Failed: {importResult.failedCount}
                    </div>
                  </div>

                  {importResult.failed?.length > 0 && (
                    <div style={styles.failedList}>
                      <p style={styles.failedTitle}>Failed Items:</p>
                      {importResult.failed.map((item, index) => (
                        <div key={index} style={styles.failedItem}>
                          <span style={styles.failedRow}>Row {item.row}:</span>
                          <span style={styles.failedProduct}>{item.product}</span>
                          <span style={styles.failedError}>{item.error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.modalCancel} className="modal-cancel" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button 
                style={styles.modalImport} 
                className="modal-import"
                onClick={handleImportProducts}
                disabled={importLoading}
              >
                {importLoading ? "Importing..." : "Import Products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

// ============================================
// STYLES
// ============================================
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: '24px 20px',
  },

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
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  importButton: {
    padding: '10px 20px',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  templateButton: {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #4AB2FF',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  cancelEditButton: {
    padding: '6px 16px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  select: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  imagePreview: {
    marginTop: '8px',
    padding: '6px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'inline-block',
  },
  previewImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 'fit-content',
  },

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
    flexWrap: 'wrap',
    gap: '12px',
  },
  tableTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  tableSubtitle: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '2px 0 0 0',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    padding: '0 12px',
    border: '1px solid #e2e8f0',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    padding: '8px 0',
    fontSize: '14px',
    outline: 'none',
    width: '200px',
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
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  productImage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    flexShrink: 0,
  },
  productName: {
    fontWeight: '500',
    color: '#1e293b',
    fontSize: '14px',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '2px 12px',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500',
  },
  priceText: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '14px',
  },
  stockText: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '14px',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  editButton: {
    padding: '5px 14px',
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
    padding: '5px 14px',
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
    padding: '40px 20px',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '15px',
    margin: 0,
  },

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
    maxWidth: '550px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
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
    padding: '20px 24px',
  },
  fileUpload: {
    marginBottom: '20px',
  },
  fileLabel: {
    display: 'block',
    padding: '14px',
    backgroundColor: '#F8FAFC',
    border: '2px dashed #e2e8f0',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    color: '#1e293b',
  },
  fileInput: {
    display: 'none',
  },
  fileName: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#4AB2FF',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: '14px',
    borderRadius: '10px',
    marginBottom: '16px',
    color: '#1e3a8a',
    fontSize: '14px',
  },
  infoList: {
    margin: '6px 0 0 0',
    paddingLeft: '20px',
  },
  importResult: {
    marginTop: '16px',
  },
  resultStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '12px',
  },
  resultSuccess: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '14px',
  },
  resultFailed: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '14px',
  },
  failedList: {
    backgroundColor: '#f8fafc',
    padding: '10px',
    borderRadius: '8px',
  },
  failedTitle: {
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 6px 0',
    fontSize: '13px',
  },
  failedItem: {
    display: 'flex',
    gap: '6px',
    padding: '4px 0',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '13px',
    flexWrap: 'wrap',
  },
  failedRow: {
    fontWeight: '600',
    color: '#1e293b',
  },
  failedProduct: {
    color: '#1e293b',
  },
  failedError: {
    color: '#dc2626',
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
  modalImport: {
    padding: '8px 24px',
    backgroundColor: '#4AB2FF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// CSS for hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .import-button:hover {
    background-color: #3a9be8 !important;
  }
  .template-button:hover {
    border-color: #4AB2FF !important;
    background-color: #f8fafc !important;
  }
  .submit-button:hover:not(:disabled) {
    background-color: #3a9be8 !important;
  }
  .cancel-edit:hover {
    background-color: #e2e8f0 !important;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #4AB2FF !important;
    box-shadow: 0 0 0 3px rgba(74, 178, 255, 0.08) !important;
  }
  .file-label:hover {
    border-color: #4AB2FF !important;
    background-color: #f0f9ff !important;
  }
  .edit-button:hover {
    background-color: #3a9be8 !important;
  }
  .delete-button:hover {
    background-color: #dc2626 !important;
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
  .modal-import:hover:not(:disabled) {
    background-color: #3a9be8 !important;
  }
  
  /* Modal styles */
  .modal-content {
    border: none !important;
    border-radius: 12px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
  }
  .modal-header {
    padding: 1.25rem 1.5rem !important;
  }
  .modal-body {
    padding: 1.5rem !important;
  }
  .modal-footer {
    padding: 1rem 1.5rem !important;
  }
  .btn-close:focus {
    box-shadow: none !important;
  }
  .btn-light {
    background: #f1f3f5 !important;
    border: none !important;
    padding: 10px 24px !important;
    font-weight: 500 !important;
  }
  .btn-light:hover {
    background: #e9ecef !important;
  }
  .btn-danger {
    padding: 10px 24px !important;
    font-weight: 500 !important;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr !important;
    }
    .header {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .header-actions {
      width: 100% !important;
    }
    .header-actions button {
      flex: 1 !important;
    }
    .table-header {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .search-input {
      width: 100% !important;
    }
    .action-buttons {
      flex-direction: column !important;
    }
    .modal {
      width: 95% !important;
    }
    .result-stats {
      grid-template-columns: 1fr !important;
    }
  }
  
  @media (max-width: 480px) {
    .page-title {
      font-size: 24px !important;
    }
    .product-info {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
  }
`;
document.head.appendChild(styleSheet);