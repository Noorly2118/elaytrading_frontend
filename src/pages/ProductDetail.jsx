import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Minus, Plus, Check, Truck, Shield, RotateCcw, Star, StarHalf } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const imageRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    api.get("/products/related", {
      params: {
        categoryId: product.category?._id,
        productId: product._id
      }
    })
      .then(res => {
        setRelatedProducts(res.data);
      })
      .catch(err => console.error(err));
  }, [product]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isInCart = product
    ? cart?.some((item) => {
        const pid = typeof item.productId === "object"
          ? item.productId?._id
          : item.productId;
        return pid === product._id;
      })
    : false;

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    if (!product) return;
    if (product.stock === 0) return;
    if (isInCart) return;

    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate("/login");
    if (!product) return;

    if (!isInCart) {
      await addToCart(product, quantity);
    }
    navigate("/cart");
  };

  const handleQuantityChange = (type) => {
    if (!product) return;
    if (type === "increase" && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const productImages = product?.images || [product?.image];
  const averageRating = 4.5;
  const reviewCount = 128;

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Oops! The product you're looking for doesn't exist.</p>
        <Link to="/" className="back-home-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="success-toast">
          <Check size={20} />
          <div className="toast-content">
            <strong>Added to Cart!</strong>
            <p>{quantity} × {product.name}</p>
          </div>
        </div>
      )}

      <div className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="product-detail-main">
          <div className="product-detail-container">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image-container">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="main-image"
                  ref={imageRef}
                />
                {product.stock < 10 && product.stock > 0 && (
                  <span className="low-stock-badge">Low Stock</span>
                )}
                {product.stock === 0 && (
                  <span className="sold-out-badge">Sold Out</span>
                )}
                
              </div>
              {productImages.length > 1 && (
                <div className="thumbnail-list">
                  {productImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail-item ${selectedImage === idx ? "active" : ""}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <img src={img} alt={`${product.name} view ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info-section">
              <div className="product-brand">{product.category?.name || "Premium Product"}</div>
              <h1 className="product-title">{product.name}</h1>

              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    return (
                      <span key={i}>
                        {starValue <= averageRating ? (
                          <Star size={18} fill="#fbbf24" color="#fbbf24" />
                        ) : starValue - 0.5 <= averageRating ? (
                          <StarHalf size={18} fill="#fbbf24" color="#fbbf24" />
                        ) : (
                          <Star size={18} color="#d1d5db" />
                        )}
                      </span>
                    );
                  })}
                </div>
                <span className="review-count">({reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="product-price-section">
                <span className="current-price">{product.price.toLocaleString()} ETB</span>
                {product.oldPrice && (
                  <>
                    <span className="old-price">{product.oldPrice.toLocaleString()} ETB</span>
                    <span className="discount-badge">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="product-short-desc">
                {product.description || "Experience premium quality with this amazing product. Designed for comfort and durability."}
              </p>

              {/* Options */}
              {product.sizes && (
                <div className="product-options">
                  <label>Select Size</label>
                  <div className="size-options">
                    {["S", "M", "L", "XL", "XXL"].map(size => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? "active" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && (
                <div className="product-options">
                  <label>Select Color</label>
                  <div className="color-options">
                    {["#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981"].map(color => (
                      <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? "active" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="quantity-section">
                <label>Quantity</label>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange("decrease")} disabled={quantity <= 1}>
                    <Minus size={18} />
                  </button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange("increase")} disabled={quantity >= product.stock}>
                    <Plus size={18} />
                  </button>
                </div>
                <span className="stock-info">{product.stock} items available</span>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isInCart || addingToCart}
                >
                  {isInCart ? (
                    <>
                      <Check size={20} />
                      In Cart
                    </>
                  ) : addingToCart ? (
                    "Adding..."
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="product-features">
                <div className="feature">
                  <Truck size={20} />
                  <div>
                    <strong>Free Shipping</strong>
                  </div>
                </div>
                <div className="feature">
                  <Shield size={20} />
                  <div>
                    <strong>Secure Payment</strong>
                    <p>100% secure transactions</p>
                  </div>
                </div>
                <div className="feature">
                  <RotateCcw size={20} />
                  <div>
                    <strong>Easy Returns</strong>
                    <p>30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="product-tabs">
            <div className="tab-headers">
              <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>
                Description
              </button>
              <button className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`} onClick={() => setActiveTab("specifications")}>
                Specifications
              </button>
              <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>
                Reviews ({reviewCount})
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "description" && (
                <div className="description-content">
                  <p>{product.description || "This premium product is designed with the highest quality materials to ensure durability and comfort. Perfect for everyday use, it combines style with functionality."}</p>
                  <ul>
                    <li>✓ Premium quality materials</li>
                    <li>✓ Ergonomic design</li>
                    <li>✓ Long-lasting durability</li>
                    <li>✓ Easy to maintain</li>
                  </ul>
                </div>
              )}
              {activeTab === "specifications" && (
                <div className="specifications-content">
                  <table>
                    <tbody>
                      <tr><td>Brand</td><td>{product.brand || "Premium Brand"}</td></tr>
                      <tr><td>Category</td><td>{product.category?.name || "General"}</td></tr>
                      <tr><td>Stock</td><td>{product.stock} units</td></tr>
                      <tr><td>SKU</td><td>{product.sku || product._id.slice(-8).toUpperCase()}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews-content">
                  <div className="review-summary">
                    <div className="average-rating">
                      <h2>{averageRating}</h2>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                        ))}
                      </div>
                      <p>Based on {reviewCount} reviews</p>
                    </div>
                  </div>
                  <div className="review-list">
                    <p className="no-reviews">Be the first to review this product!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section">
              <div className="section-header">
                <h3>You May Also Like</h3>
                <Link to="/shop" className="view-all">View All →</Link>
              </div>
              <div className="related-products-grid">
                {relatedProducts.map((p) => (
                  <Link to={`/product/${p._id}`} key={p._id} className="related-product-card">
                    <div className="related-image">
                      <img src={p.image || p.images?.[0]} alt={p.name} />
                    </div>
                    <div className="related-info">
                      <h4>{p.name}</h4>
                      <p className="related-price">{p.price.toLocaleString()} ETB</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

           <style>{`
        /* ===== PRODUCT DETAIL PAGE - FULLY RESPONSIVE ===== */
        
        .product-detail-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef3 100%);
          min-height: 100vh;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          flex-wrap: wrap;
        }

        .breadcrumb a {
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
        }

        .breadcrumb a:hover {
          color: #01446F;
        }

        .breadcrumb span {
          color: #999;
        }

        .breadcrumb .current {
          color: #01446F;
          font-weight: 500;
        }

        /* Loading State */
        .product-detail-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #01446F 0%, #012a44 100%);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .product-detail-loading p {
          margin-top: 1rem;
          color: white;
          font-size: 1.1rem;
        }

        /* Product Not Found */
        .product-not-found {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          max-width: 500px;
          margin: 4rem auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .product-not-found h2 {
          color: #ef4444;
          margin-bottom: 1rem;
        }

        .back-home-btn {
          display: inline-block;
          margin-top: 2rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #01446F 0%, #012a44 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          transition: transform 0.3s;
        }

        .back-home-btn:hover {
          transform: translateY(-2px);
        }

        /* Success Toast */
        .success-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          max-width: 90vw;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-content strong {
          display: block;
          font-size: 0.9rem;
        }

        .toast-content p {
          font-size: 0.8rem;
          margin: 0;
        }

        /* ===== MAIN PRODUCT CONTAINER ===== */
        .product-detail-container {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        /* ===== IMAGE GALLERY ===== */
        .product-gallery {
          padding: 2rem;
          background: #f8f9fa;
          position: relative;
        }

        .main-image-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: transform 0.3s;
          display: block;
        }

        .low-stock-badge,
        .sold-out-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 2;
        }

        .low-stock-badge {
          background: #fbbf24;
          color: #92400e;
        }

        .sold-out-badge {
          background: #ef4444;
          color: white;
        }

        .thumbnail-list {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .thumbnail-item {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s;
          background: white;
        }

        .thumbnail-item.active {
          border-color: #01446F;
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(1, 68, 111, 0.3);
        }

        .thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ===== PRODUCT INFO ===== */
        .product-info-section {
          padding: 2rem;
        }

        .product-brand {
          font-size: 0.875rem;
          color: #01446F;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
        }

        .review-count {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .product-price-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .current-price {
          font-size: 2rem;
          font-weight: 700;
          color: #01446F;
        }

        .old-price {
          font-size: 1.2rem;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .product-short-desc {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* Options */
        .product-options {
          margin-bottom: 1.5rem;
        }

        .product-options label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .size-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .size-btn {
          min-width: 45px;
          padding: 0.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .size-btn:hover {
          border-color: #01446F;
          color: #01446F;
        }

        .size-btn.active {
          background: #01446F;
          color: white;
          border-color: transparent;
        }

        .color-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .color-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.3s;
        }

        .color-btn:hover {
          transform: scale(1.1);
        }

        .color-btn.active {
          border-color: #01446F;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #01446F;
        }

        /* Quantity */
        .quantity-section {
          margin-bottom: 1.5rem;
        }

        .quantity-section label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .quantity-controls button {
          width: 40px;
          height: 40px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .quantity-controls button:hover:not(:disabled) {
          border-color: #01446F;
          color: #01446F;
        }

        .quantity-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-controls input {
          width: 60px;
          height: 40px;
          text-align: center;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
        }

        .stock-info {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 500;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .add-to-cart-btn,
        .buy-now-btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s;
          min-width: 140px;
        }

        .add-to-cart-btn {
          background: #01446F;
          color: white;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background: #012a44;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(1, 68, 111, 0.3);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .buy-now-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .buy-now-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
        }

        .buy-now-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Features */
        .product-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .feature strong {
          display: block;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .feature p {
          margin: 0;
          font-size: 0.75rem;
        }

        /* Tabs */
        .product-tabs {
          background: white;
          border-radius: 20px;
          margin-bottom: 3rem;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .tab-headers {
          display: flex;
          gap: 0.5rem;
          background: #f8f9fa;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 10px;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #01446F;
          background: rgba(1, 68, 111, 0.1);
        }

        .tab-btn.active {
          background: #01446F;
          color: white;
        }

        .tab-content {
          padding: 2rem;
        }

        .description-content p {
          color: #6b7280;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .description-content ul {
          list-style: none;
          padding: 0;
        }

        .description-content li {
          padding: 0.5rem 0;
          color: #374151;
        }

        .specifications-content {
          overflow-x: auto;
        }

        .specifications-content table {
          width: 100%;
          border-collapse: collapse;
          min-width: 300px;
        }

        .specifications-content td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .specifications-content td:first-child {
          font-weight: 600;
          color: #374151;
          width: 30%;
        }

        .specifications-content td:last-child {
          color: #6b7280;
        }

        .review-summary {
          text-align: center;
          margin-bottom: 2rem;
        }

        .average-rating h2 {
          font-size: 3rem;
          color: #fbbf24;
          margin: 0;
        }

        .average-rating p {
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .no-reviews {
          text-align: center;
          color: #9ca3af;
          padding: 2rem;
        }

        /* Related Products */
        .related-products-section {
          margin-top: 3rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .view-all {
          color: #01446F;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .view-all:hover {
          color: #012a44;
        }

        .related-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .related-product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .related-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .related-image {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .related-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s;
        }

        .related-product-card:hover .related-image img {
          transform: scale(1.05);
        }

        .related-info {
          padding: 1rem;
        }

        .related-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .related-price {
          font-size: 1rem;
          font-weight: 700;
          color: #01446F;
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */

        /* Tablets and smaller laptops */
        @media (max-width: 992px) {
          .product-detail-container {
            grid-template-columns: 1fr;
          }

          .product-gallery {
            padding: 1.5rem;
          }

          .product-title {
            font-size: 1.75rem;
          }

          .current-price {
            font-size: 1.75rem;
          }

          .product-info-section {
            padding: 1.5rem;
          }
        }

        /* Mobile devices */
        @media (max-width: 768px) {
          .product-detail-page {
            padding: 1rem;
          }

          .product-detail-container {
            border-radius: 16px;
          }

          .product-gallery {
            padding: 1rem;
          }

          .main-image-container {
            aspect-ratio: 1 / 1;
            border-radius: 12px;
          }

          .thumbnail-item {
            width: 60px;
            height: 60px;
          }

          .thumbnail-list {
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .product-info-section {
            padding: 1rem;
          }

          .product-title {
            font-size: 1.4rem;
          }

          .product-brand {
            font-size: 0.75rem;
          }

          .current-price {
            font-size: 1.5rem;
          }

          .old-price {
            font-size: 1rem;
          }

          .discount-badge {
            font-size: 0.75rem;
            padding: 0.2rem 0.6rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .add-to-cart-btn,
          .buy-now-btn {
            flex: 1;
            width: 100%;
            min-width: unset;
            padding: 0.875rem;
            font-size: 0.9rem;
          }

          .product-features {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }

          .feature {
            font-size: 0.8rem;
          }

          .tab-headers {
            padding: 0.75rem;
            gap: 0.25rem;
          }

          .tab-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .tab-content {
            padding: 1rem;
          }

          .related-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .related-info h4 {
            font-size: 0.85rem;
          }

          .related-price {
            font-size: 0.85rem;
          }

          .success-toast {
            top: 10px;
            right: 10px;
            padding: 0.75rem 1rem;
            font-size: 0.85rem;
            max-width: 95vw;
          }

          .low-stock-badge,
          .sold-out-badge {
            top: 10px;
            left: 10px;
            padding: 0.3rem 0.75rem;
            font-size: 0.65rem;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .product-detail-page {
            padding: 0.75rem;
            margin:2rem
          }

          .breadcrumb {
            font-size: 0.75rem;
            gap: 0.3rem;
            margin-bottom: 1rem;
          }

          .product-title {
            font-size: 1.2rem;
          }

          .current-price {
            font-size: 1.3rem;
          }

          .product-price-section {
            gap: 0.5rem;
          }

          .product-short-desc {
            font-size: 0.9rem;
          }

          .thumbnail-item {
            width: 50px;
            height: 50px;
          }

          .thumbnail-list {
            gap: 0.4rem;
          }

          .quantity-controls input {
            width: 50px;
            height: 36px;
            font-size: 0.9rem;
          }

          .quantity-controls button {
            width: 36px;
            height: 36px;
          }

          .tab-btn {
            padding: 0.4rem 0.75rem;
            font-size: 0.75rem;
          }

          .tab-content {
            padding: 0.75rem;
          }

          .related-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .related-info {
            padding: 0.5rem;
          }

          .related-info h4 {
            font-size: 0.75rem;
          }

          .related-price {
            font-size: 0.75rem;
          }

          .section-header h3 {
            font-size: 1.2rem;
          }

          .product-features {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .add-to-cart-btn,
          .buy-now-btn {
            padding: 0.75rem;
            font-size: 0.85rem;
          }

          .product-not-found {
            padding: 2rem 1rem;
            margin: 2rem auto;
          }

          .product-not-found h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default ProductDetail;