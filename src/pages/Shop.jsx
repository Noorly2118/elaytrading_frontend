import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import api from "../services/api"

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Use ref to prevent multiple clicks
  const isAddingRef = useRef(false);

  const { cart, addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
      const res = await api.get("/categories");
const data = res.data;
setCategories(data);

        // add "All" manually at the top
        setCategories([{ name: "All", slug: "all" }, ...data]);

      } catch (err) {
        console.error(err);
        setCategories([{ name: "All", slug: "all" }]);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Read category from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const categoryFromURL = query.get("category");

    if (categoryFromURL) {
      setActiveCategory(categoryFromURL);
    }
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

      const res = await api.get(
  `/products?category=${activeCategory}`
);

const data = res.data;
setProducts(data);

        setProducts(data.products || []);

      } catch (err) {
        console.error(err);
        setProducts([]);
        toast.error('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleAddToCart = (product) => {
    // Prevent adding if not logged in
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate("/login");
      return;
    }
    
    // Prevent adding if invalid product
    if (!product?._id) {
      console.error("Invalid product:", product);
      toast.error('Invalid product');
      return;
    }
    
    // CRITICAL: Check if already in cart
    if (isInCart(product._id)) {
      toast.info('Product already in cart');
      return;
    }
    
    // Prevent adding if out of stock
    if ((product.stock ?? 0) === 0) {
      toast.error('Product is out of stock!');
      return;
    }
    
    // CRITICAL: Prevent multiple simultaneous clicks
    if (isAddingRef.current) {
      toast.info('Please wait...');
      return;
    }
    
    // Set flags to prevent multiple clicks
    isAddingRef.current = true;
    setAddingProductId(product._id);
    
    try {
      // Add to cart
      addToCart(product);
      toast.success(`"${product.name}" added to cart!`);
      
      // Small delay to ensure the button stays disabled
      setTimeout(() => {
        isAddingRef.current = false;
        setAddingProductId(null);
      }, 500);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Failed to add item to cart');
      isAddingRef.current = false;
      setAddingProductId(null);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="shop-page">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
        <style>{`
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="shop-page">
     

      {/* HEADER */}
      <section className="shop-header text-center">
        <div className="container">
          <h1 className="fw-bold">Shop Products</h1>
          <p className="text-muted">
            Browse high-quality laboratory, educational and agricultural products
          </p>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div className="category-tabs-wrapper">
        <div className="container">
          <div className="category-tabs d-flex gap-3 overflow-auto">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`category-tab ${
                  activeCategory === cat.slug ? "active" : ""
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="shop-products">
        <div className="container">
          {Array.isArray(products) && products.length > 0 ? (
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-md-6 col-lg-4" key={product._id}>
                  <div className="product-card">
                    <div className="product-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      {(product.stock ?? 0) === 0 && (
                        <div className="product-badge out-of-stock-badge">
                          Out of Stock
                        </div>
                      )}
                      {(product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5 && (
                        <div className="product-badge low-stock-badge">
                          Low Stock
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h5 className="fw-bold">{product.name}</h5>

                      <p className="text-muted">
                        ETB {product.price?.toLocaleString()}
                      </p>

                      {(product.stock ?? 0) > 0 &&
                        (product.stock ?? 0) <= 5 && (
                          <p className="stock-warning">
                            ⚠️ Only {product.stock} left in stock!
                          </p>
                        )}

                      <div className="d-flex gap-2">
                        <button
                          className={`add-to-cart-btn ${
                            (product.stock ?? 0) === 0
                              ? "out-of-stock"
                              : isInCart(product._id)
                              ? "added"
                              : "primary"
                          }`}
                          disabled={
                            isInCart(product._id) ||
                            (product.stock ?? 0) === 0 ||
                            addingProductId === product._id ||
                            isAddingRef.current
                          }
                          onClick={() => handleAddToCart(product)}
                        >
                          {addingProductId === product._id
                            ? "Adding..."
                            : isInCart(product._id)
                            ? "✓ Added to Cart"
                            : (product.stock ?? 0) === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>

                        <Link
                          to={`/product/${product._id}`}
                          className="btn-view"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="no-products">
                <div className="no-products-icon">🛒</div>
                <h4>No products found</h4>
                <p className="text-muted">Try selecting a different category</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        .shop-header {
          padding: 100px 0 40px;
          background: #F8FAFB;
        }

        .category-tabs-wrapper {
          background: white;
          border-bottom: 1px solid #eee;
          padding: 15px 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .category-tabs::-webkit-scrollbar {
          display: none;
        }

        .category-tab {
          border: none;
          padding: 10px 20px;
          border-radius: 50px;
          background: #F8FAFB;
          color: #00446E;
          font-weight: 500;
          white-space: nowrap;
          transition: 0.3s;
          cursor: pointer;
        }

        .category-tab.active {
          background: #1DA8F0;
          color: white;
        }

        .category-tab:hover {
          background: #00446E;
          color: white;
        }

        .shop-products {
          padding: 60px 0 100px;
          background: #F8FAFB;
          min-height: 400px;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          transition: 0.3s;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        /* FIXED IMAGE CONTAINER - prevents cutting */
        .product-image-wrapper {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
          background: white;
          padding: 10px;
        }

        .product-card:hover .product-image-wrapper img {
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

        .stock-warning {
          color: #e67e22;
          font-size: 12px;
          margin: -10px 0 10px 0;
          font-weight: 500;
        }

        /* FIXED ADD TO CART BUTTON - Color #01446F */
        .add-to-cart-btn {
          flex: 1;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .add-to-cart-btn.primary {
          background: #01446F;
          color: white;
        }

        .add-to-cart-btn.primary:hover:not(:disabled) {
          background: #1DA8F0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(1, 68, 111, 0.3);
        }

        .add-to-cart-btn.added {
          background: #28a745;
          color: white;
          cursor: not-allowed;
          opacity: 0.8;
        }

        .add-to-cart-btn.out-of-stock {
          background: #6c757d;
          color: white;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .add-to-cart-btn:disabled {
          cursor: not-allowed;
          transform: none;
          opacity: 0.7;
        }

        /* View Details Button */
        .btn-view {
          padding: 10px 20px;
          background: transparent;
          border: 1.5px solid #01446F;
          border-radius: 8px;
          color: #01446F;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-view:hover {
          background: #01446F;
          color: white;
          transform: translateY(-2px);
          text-decoration: none;
        }

        /* No products */
        .no-products {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          margin: 40px 0;
        }

        .no-products-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .no-products h4 {
          color: #1f2937;
          margin-bottom: 10px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .shop-header {
            padding: 80px 0 30px;
          }
          
          .product-image-wrapper {
            height: 200px;
          }
          
          .add-to-cart-btn, .btn-view {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;