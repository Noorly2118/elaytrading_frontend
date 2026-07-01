import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import toast, { Toaster } from 'react-hot-toast';

// Category-specific hero configurations based on your exact categories
const categoryHeroConfig = {
  "chemicals": {
    title: "Chemistry Chemicals & Reagents",
    subtitle: "High-purity chemicals, reagents, and laboratory-grade materials for advanced chemical analysis and research applications",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600",
    bgGradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    icon: "🧪",
    badge: "Premium Quality"
  },
  "glassware": {
    title: "Laboratory Glassware & Plasticware",
    subtitle: "Precision-engineered glassware and durable plasticware for all laboratory needs, from beakers to volumetric flasks",
    image: "https://www.laboratorydeal.com/cdn/shop/articles/Research_Lab_glassware_equipment_0d93c629-193d-4154-a1b9-c4f21a883f01-441028.jpg?v=1749285056",
    bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    icon: "🔬",
    badge: "Scientifically Tested"
  },
  "physics": {
    title: "Physics Apparatus",
    subtitle: "Complete range of physics laboratory equipment and apparatus for mechanics, optics, electricity, and thermodynamics experiments",
    image: "https://www.aticoindia.com/uploads/blog_images/468135physics%201.png",
    bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: "⚡",
    badge: "Precision Tools"
  },
  "biology": {
    title: "Biology Models & Charts",
    subtitle: "Detailed anatomical models, biological charts, and teaching aids for effective biology education and demonstrations",
    image: "https://elaytrading.com/wp-content/uploads/2020/08/61YBgCDXoyL._AC_SX425_.jpg",
    bgGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 100%)",
    icon: "🧬",
    badge: "Educational Excellence"
  },
  "analytical": {
    title: "Analytical Equipment",
    subtitle: "State-of-the-art analytical instruments for precise measurements, quality control, and advanced laboratory testing",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBtvBhB-Be9bYaIahIvc2PCa8so_k5zigYoA&s",
    bgGradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    icon: "📊",
    badge: "High Precision"
  },
  "education": {
    title: "Educational Tools",
    subtitle: "Engaging educational tools, STEM kits, and learning materials designed to inspire curiosity and scientific exploration",
    image: "https://m.media-amazon.com/images/I/71KH3kde71L._AC_SL1024_.jpg",
    bgGradient: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
    icon: "📚",
    badge: "Learn & Explore"
  },
  "agriculture": {
    title: "Agricultural Instruments",
    subtitle: "Professional agricultural instruments and tools for soil testing, crop analysis, and modern farming practices",
    image: "https://se-source.com/wp-content/uploads/2022/06/Microscopes-3.png",
    bgGradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    icon: "🌾",
    badge: "Farm Smart"
  },
  "default": {
    title: "Our Products",
    subtitle: "Discover high-quality laboratory, educational, and agricultural products for all your scientific needs",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600",
    bgGradient: "linear-gradient(135deg, #01446F 0%, #1DA8F0 100%)",
    icon: "📦",
    badge: "Quality Assured"
  }
};

const CategoryPage = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    inStock: false
  });
  
  // Get category-specific hero configuration
  const heroConfig = categoryHeroConfig[id] || categoryHeroConfig.default;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/products", {
          params: {
            category: id,
            page
          }
        });

        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);

      } catch (err) {
        console.error(err);
        setProducts([]);
        // Show error toast notification
        toast.error(err.response?.data?.message || 'Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, page]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPage(1);

    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

const truncateText = (text, max = 80) => {
  if (!text) return "No description available";
  return text.length > max ? text.substring(0, max) + "..." : text;
};

  if (loading) return <LoadingSpinner />;

  return (
    <div className="category-page">
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
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
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      {/* Dynamic Hero Section with Category Image */}
      <section className="category-hero" style={{ background: heroConfig.bgGradient }}>
        <div className="hero-background-image">
          <img src={heroConfig.image} alt={heroConfig.title} />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-icon">{heroConfig.icon}</div>
            <div className="hero-badge">{heroConfig.badge}</div>
            <h1 className="hero-title">{heroConfig.title}</h1>
            <p className="hero-subtitle">{heroConfig.subtitle}</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Products Available</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">{totalPages}</span>
                <span className="stat-label">Pages</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="hero-cta-btn" onClick={() => {
                document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
              }}>
                Browse Products ↓
              </button>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f8fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <div className="container py-5" id="products-section">
        {/* Filters Section */}
        <div className="filters-wrapper">
          <div className="filters-header">
            <h3 className="filters-title">
              <span className="filter-icon">🔍</span> Filter Products
            </h3>
            {(filters.minPrice || filters.maxPrice || filters.inStock) && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setFilters({ minPrice: "", maxPrice: "", inStock: false });
                  setPage(1);
                  toast.success('Filters cleared successfully');
                }}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Min Price (ETB)</label>
              <div className="filter-input-wrapper">
                <span className="input-icon">💰</span>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Max Price (ETB)</label>
              <div className="filter-input-wrapper">
                <span className="input-icon">💎</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleFilterChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">✓ In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <div className="results-count">
            <span className="count-number">{products.length}</span>
            <span className="count-text"> products found</span>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or check back later</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setFilters({ minPrice: "", maxPrice: "", inStock: false });
                setPage(1);
                toast.success('Filters reset successfully');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className="product-card">
                <div className="product-image-wrapper">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                  {p.stock === 0 && (
                    <div className="product-badge out-of-stock-badge">Out of Stock</div>
                  )}
                  {p.stock > 0 && p.stock <= 5 && (
                    <div className="product-badge low-stock-badge">Low Stock</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
            <p className="text-muted">
  {truncateText(p.description, 100)}
</p>

<span className="read-more">Read more →</span>
                  <div className="product-price-wrapper">
                    <span className="product-price">{p.price?.toLocaleString()} ETB</span>
                    {p.oldPrice && (
                      <span className="product-old-price">{p.oldPrice} ETB</span>
                    )}
                  </div>
                  <div className="product-meta">
                    {p.stock > 0 ? (
                      <span className="stock-badge in-stock">✓ In Stock</span>
                    ) : (
                      <span className="stock-badge out-stock">✗ Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <button
              className="pagination-btn prev-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <span>←</span> Previous
            </button>

            <div className="pagination-pages">
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (page <= 3) {
                  pageNum = idx + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = page - 2 + idx;
                }
                
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-page ${page === pageNum ? 'active' : ''}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
            </div>

            <button
              className="pagination-btn next-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .category-page {
          background: #f8fafb;
          min-height: 100vh;
        }

        /* Dynamic Hero Section */
        .category-hero {
          position: relative;
          padding: 100px 0 120px;
          overflow: hidden;
        }
        
        .hero-background-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
        
        .hero-background-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: zoomIn 20s ease-out;
        }
        
        @keyframes zoomIn {
          from {
            transform: scale(1.1);
          }
          to {
            transform: scale(1);
          }
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%);
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .hero-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: bounce 2s ease infinite;
          display: inline-block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
          letter-spacing: 1px;
          animation: fadeInUp 0.6s ease;
        }
        
        .hero-title {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          animation: fadeInUp 0.8s ease;
          line-height: 1.2;
        }
        
        .hero-subtitle {
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.95;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease 0.1s both;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          animation: fadeInUp 0.8s ease 0.2s both;
          margin-bottom: 40px;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 5px;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.8));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
          letter-spacing: 0.5px;
        }
        
        .stat-divider {
          width: 1px;
          height: 50px;
          background: rgba(255,255,255,0.3);
        }
        
        .hero-cta {
          animation: fadeInUp 0.8s ease 0.3s both;
        }
        
        .hero-cta-btn {
          background: white;
          color: #01446F;
          border: none;
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .hero-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          background: #1DA8F0;
          color: white;
        }
        
        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1;
          line-height: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Hero */
        @media (max-width: 768px) {
          .category-hero {
            padding: 60px 0 80px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 14px;
          }
          
          .hero-icon {
            font-size: 50px;
          }
          
          .stat-number {
            font-size: 28px;
          }
          
          .stat-label {
            font-size: 11px;
          }
          
          .hero-stats {
            gap: 20px;
          }
        }

        /* Filters Section */
        .filters-wrapper {
          background: white;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .filters-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-icon {
          font-size: 20px;
        }
        
        .clear-filters-btn {
          background: none;
          border: none;
          color: #1DA8F0;
          font-size: 14px;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 6px;
          transition: all 0.3s;
        }
        
        .clear-filters-btn:hover {
          background: #f0f7ff;
        }
        
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          align-items: end;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .filter-label {
          font-size: 13px;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filter-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 12px;
          font-size: 18px;
        }
        
        .filter-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #1DA8F0;
          box-shadow: 0 0 0 3px rgba(29,168,240,0.1);
        }
        
        .checkbox-group {
          justify-content: center;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          position: relative;
          padding: 10px 0;
        }
        
        .checkbox-input {
          display: none;
        }
        
        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          position: relative;
          transition: all 0.3s;
        }
        
        .checkbox-input:checked + .checkbox-custom {
          background: #1DA8F0;
          border-color: #1DA8F0;
        }
        
        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
        }
        
        .checkbox-text {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        /* Results Info */
        .results-info {
          margin-bottom: 25px;
        }
        
        .results-count {
          font-size: 14px;
          color: #6c757d;
        }
        
        .count-number {
          font-size: 24px;
          font-weight: 700;
          color: #01446F;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }
        
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        
        .product-image-wrapper {
          position: relative;
          height: 250px;
          overflow: hidden;
          background: #f8fafb;
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s ease;
          padding: 15px;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .product-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          z-index: 1;
        }
        
        .out-of-stock-badge {
          background: #ef4444;
          color: white;
        }
        
        .low-stock-badge {
          background: #f59e0b;
          color: white;
        }
        
        .product-info {
          padding: 20px;
        }
        
        .product-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-price-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        
        .product-price {
          font-size: 20px;
          font-weight: 700;
          color: #01446F;
        }
        
        .product-old-price {
          font-size: 14px;
          color: #9ca3af;
          text-decoration: line-through;
        }
        
        .stock-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .in-stock {
          background: #d1fae5;
          color: #065f46;
        }
        
        .out-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        /* No Products */
        .no-products {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
        }
        
        .no-products-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        
        .no-products h3 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .no-products p {
          color: #6c757d;
          margin-bottom: 25px;
        }
        
        .reset-filters-btn {
          padding: 12px 30px;
          background: #01446F;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .reset-filters-btn:hover {
          background: #1DA8F0;
          transform: translateY(-2px);
        }

        /* Pagination */
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          padding: 30px 0;
          flex-wrap: wrap;
        }
        
        .pagination-btn {
          padding: 10px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .pagination-btn:hover:not(:disabled) {
          background: #01446F;
          color: white;
          border-color: #01446F;
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-pages {
          display: flex;
          gap: 8px;
        }
        
        .pagination-page {
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }
        
        .pagination-page:hover {
          background: #f0f7ff;
          border-color: #1DA8F0;
        }
        
        .pagination-page.active {
          background: #01446F;
          color: white;
          border-color: #01446F;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
          }
          
          .pagination-wrapper {
            gap: 10px;
          }
          
          .pagination-page {
            width: 35px;
            height: 35px;
          }
          
          .pagination-btn {
            padding: 8px 15px;
          }
        }
      `}</style>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <div className="loading-text">Loading amazing products...</div>
    <style>{`
      .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #01446F 0%, #1DA8F0 100%);
      }
      
      .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .loading-text {
        margin-top: 20px;
        color: white;
        font-size: 18px;
        font-weight: 500;
      }
    `}</style>
  </div>
);

export default CategoryPage;