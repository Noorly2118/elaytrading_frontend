import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import toast, { Toaster } from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        await adminApi.put(`/categories/${editId}`, { name, slug });
        toast.success("Category updated successfully!");
      } else {
        await adminApi.post("/categories", { name, slug });
        toast.success("Category added successfully!");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setSlug(cat.slug);
    setEditId(cat._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await adminApi.delete(`/categories/${deleteTarget}`);
      fetchCategories();
      toast.success("Category deleted successfully!");
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

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditId(null);
  };

  return (
    <>
      {/* Toast Container */}
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

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showDeleteModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Delete Category</h5>
              <button type="button" className="btn-close" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this category?</p>
              <p className="text-danger fw-bold mb-0">⚠️ This action cannot be undone</p>
              <p className="text-muted mt-2">Note: Products in this category may be affected.</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete Category</button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

      {/* Add/Edit Category Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h4 className="mb-0">{editId ? "✏️ Edit Category" : "➕ Add New Category"}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Category Name</label>
                <input
                  className="form-control"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-5">
                <label className="form-label">Slug</label>
                <input
                  className="form-control"
                  placeholder="e.g., biology"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className="btn w-100" 
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #01446F 0%, #1DA8F0 100%)",
                    color: "white",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(1, 68, 111, 0.3)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : editId ? "Update" : "Add"}
                </button>
              </div>

              {editId && (
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">All Categories</h5>
          <small className="text-muted">{categories.length} categories</small>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {cat.name}
                        </span>
                      </td>
                      <td>
                        <code className="bg-light px-2 py-1 rounded">{cat.slug}</code>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm me-2"
                          onClick={() => handleEdit(cat)}
                          style={{
                            background: "linear-gradient(135deg, #01446F 0%, #0165a3 100%)",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 2px 8px rgba(1, 68, 111, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleDeleteClick(cat._id)}
                          style={{
                            background: "linear-gradient(135deg, #dc3545 0%, #e4606d 100%)",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 2px 8px rgba(220, 53, 69, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
                      <p className="text-muted mb-0">No categories found</p>
                      <p className="text-muted small">Add your first category above</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .table-hover tbody tr:hover {
          background-color: rgba(1, 68, 111, 0.05) !important;
          transition: background-color 0.2s ease;
        }
        
        .badge {
          font-weight: 500;
        }
        
        .btn-close:focus {
          box-shadow: none !important;
        }
        
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
        
        .btn-light {
          background: #f1f3f5 !important;
          border: none !important;
          padding: 10px 24px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        
        .btn-light:hover {
          background: #e9ecef !important;
        }
        
        .btn-danger {
          padding: 10px 24px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        
        .btn-danger:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
        }
        
        .form-control:focus {
          border-color: #1DA8F0 !important;
          box-shadow: 0 0 0 3px rgba(29, 168, 240, 0.1) !important;
        }
        
        @media (max-width: 768px) {
          .col-md-2 {
            margin-top: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Categories;