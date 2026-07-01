import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProducts = ({ products }) => {
  // Optional: fallback message if no products
  if (!products || products.length === 0) {
    return (
      <section className="featured-products-section py-6 py-lg-7 position-relative">
        <div className="section-bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
        </div>
        <div className="container position-relative z-2">
          <div className="text-center py-5">
            <div className="d-inline-block mb-4">
              <span className="section-badge px-4 py-2 rounded-pill fw-semibold">
                Featured Products
              </span>
            </div>
            <h2 className="fw-bold mb-3 display-5">
              Discover Our <span className="text-primary">Premium</span> Selection
            </h2>
            <p className="text-muted lead mb-4 mx-auto" style={{ maxWidth: "680px" }}>
              Loading our handpicked collection of laboratory essentials...
            </p>
            <div className="loading-placeholder">
              <div className="placeholder-shimmer"></div>
              <div className="placeholder-shimmer"></div>
              <div className="placeholder-shimmer"></div>
              <div className="placeholder-shimmer"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products-section py-6 py-lg-7 position-relative">
      {/* Background decorative elements */}
      <div className="section-bg-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="container position-relative z-2">
        {/* Header with badges and compelling copy */}
        <div className="text-center mb-6 mb-lg-7">
          <div className="d-inline-block mb-4">
            <span className="section-badge px-4 py-2 rounded-pill fw-semibold">
              Editor's Choice
            </span>
            <span className="ms-3 section-badge badge-bestseller px-4 py-2 rounded-pill fw-semibold">
              🔥 Best Sellers
            </span>
          </div>
          
          <h2 className="fw-bold mb-3 display-5">
            Discover Our <span className="text-primary">Premium</span> Selection
          </h2>
          
          <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: "680px" }}>
            Handpicked laboratory essentials, chemicals, and educational tools trusted by professionals across Ethiopia
          </p>
          
          {/* Trust badges */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <div className="trust-badge d-flex align-items-center gap-2">
              <span className="trust-icon">✓</span>
              <span>Quality Certified</span>
            </div>
            <div className="trust-badge d-flex align-items-center gap-2">
              <span className="trust-icon">🚚</span>
              <span>Nationwide Delivery</span>
            </div>
            <div className="trust-badge d-flex align-items-center gap-2">
              <span className="trust-icon">⭐</span>
              <span>4.8/5 Customer Rating</span>
            </div>
          </div>
        </div>

        {/* Products Grid with enhanced layout */}
        <div className="row g-4 g-lg-5">
          {products.slice(0, 8).map((product, index) => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={product._id}>
              <div className="featured-card-wrapper position-relative">
                {/* Badge for first product or special offers */}
                {index === 0 && (
                  <div className="featured-badge position-absolute">
                    <span className="badge-text">Most Popular</span>
                  </div>
                )}
                
                {/* Quick view overlay trigger */}
                <div className="quick-view-overlay">
                  <button 
                    className="btn quick-view-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add quick view modal logic here
                      console.log("Quick view:", product.name);
                    }}
                  >
                    👁️ Quick View
                  </button>
                </div>
                
                <div className="product-card-container h-100">
                  <ProductCard product={product} />
                </div>
                
                {/* Additional product info on hover */}
                <div className="product-extra-info">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <small className="text-muted">In Stock</small>
                    <small className="text-success fw-semibold">
                      <span className="me-1">⚡</span> Fast Delivery
                    </small>
                  </div>
                  <button className="btn btn-primary w-100 btn-sm">
                    Add to Inquiry List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section with benefits */}
        <div className="cta-section mt-6 mt-lg-7 pt-4">
          <div className="cta-card rounded-4 p-5 text-center position-relative overflow-hidden">
            <div className="cta-bg-pattern"></div>
            
            <h3 className="fw-bold mb-3" style={{ color: "#00446E" }}>
              Need Specific Products Not Listed?
            </h3>
            
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
              We source specialized laboratory equipment and chemicals on demand. 
              Get customized quotes for bulk orders or specific requirements.
            </p>
            
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <Link 
                to="/products" 
                className="btn btn-primary btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg"
              >
                Browse All Products →
              </Link>
              
              <Link 
                to="/request-quote" 
                className="btn btn-outline-primary btn-lg px-5 py-3 fw-bold rounded-pill"
              >
                🔧 Request Custom Quote
              </Link>
            </div>
            
            <div className="d-flex flex-wrap justify-content-center gap-4 mt-5 pt-3">
              <div className="cta-benefit">
                <span className="benefit-icon">📞</span>
                <div>
                  <div className="fw-semibold">Expert Support</div>
                  <small className="text-muted">Technical guidance available</small>
                </div>
              </div>
              <div className="cta-benefit">
                <span className="benefit-icon">🏷️</span>
                <div>
                  <div className="fw-semibold">Bulk Discounts</div>
                  <small className="text-muted">Save on large orders</small>
                </div>
              </div>
              <div className="cta-benefit">
                <span className="benefit-icon">🔄</span>
                <div>
                  <div className="fw-semibold">Warranty</div>
                  <small className="text-muted">All products covered</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .featured-products-section {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFB 100%);
          position: relative;
          overflow: hidden;
        }

        /* Background elements */
        .section-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(29, 168, 240, 0.03), transparent);
          border: 1px solid rgba(29, 168, 240, 0.08);
        }

      .bg-circle-1 {
  width: 100px;
  height: 100px;
  top: -50px;   /* reduced from -150px */
  right: -50px; /* reduced from -150px */
}

.bg-circle-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;   /* slightly adjusted */
  left: -70px;   /* reduced from -100px */
}

.bg-circle-3 {
  width: 150px;
  height: 150px;
  bottom: 10%;
  right: 10%;
}

        /* Section badges */
        .section-badge {
          background: rgba(0, 68, 110, 0.1);
          color: #00446E;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          border: 1px solid rgba(0, 68, 110, 0.2);
          transition: all 0.3s ease;
        }

        .badge-bestseller {
          background: linear-gradient(135deg, rgba(29, 168, 240, 0.15), rgba(29, 168, 240, 0.1));
          color: #00446E;
          border-color: rgba(29, 168, 240, 0.3);
        }

        /* Trust badges */
        .trust-badge {
          background: rgba(255, 255, 255, 0.8);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1F2933;
          border: 1px solid rgba(0, 68, 110, 0.1);
          backdrop-filter: blur(5px);
        }

        .trust-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(29, 168, 240, 0.1);
          border-radius: 50%;
          font-size: 0.8rem;
        }

        /* Product card wrapper */
        .featured-card-wrapper {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .featured-card-wrapper:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
        }

        .featured-card-wrapper:hover .quick-view-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* Featured badge */
        .featured-badge {
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .badge-text {
          background: linear-gradient(135deg, #1DA8F0, #0d8ed0);
          color: white;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(29, 168, 240, 0.3);
        }

        /* Quick view overlay */
        .quick-view-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 68, 110, 0.85);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          z-index: 5;
          border-radius: 16px;
        }

        .quick-view-btn {
          background: white;
          color: #00446E;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .quick-view-btn:hover {
          background: #1DA8F0;
          color: white;
          transform: scale(1.05);
        }

        /* Product extra info */
        .product-extra-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          padding: 1rem;
          transform: translateY(100%);
          transition: transform 0.4s ease;
          border-radius: 0 0 16px 16px;
          backdrop-filter: blur(10px);
        }

        .featured-card-wrapper:hover .product-extra-info {
          transform: translateY(0);
        }

        /* CTA Section */
        .cta-card {
          background: linear-gradient(135deg, rgba(248, 250, 251, 0.9), rgba(255, 255, 255, 0.95));
          border: 1px solid rgba(0, 68, 110, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .cta-bg-pattern {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, transparent 50%, rgba(29, 168, 240, 0.05) 100%);
          border-radius: 0 16px 0 100px;
          z-index: 1;
        }

        .cta-card > * {
          position: relative;
          z-index: 2;
        }

        /* CTA benefits */
        .cta-benefit {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.7);
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(0, 68, 110, 0.1);
          transition: all 0.3s ease;
        }

        .cta-benefit:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: rgba(29, 168, 240, 0.3);
        }

        .benefit-icon {
          font-size: 1.5rem;
        }

        /* Loading placeholder */
        .loading-placeholder {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .placeholder-shimmer {
          height: 300px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .display-5 {
            font-size: 2.5rem !important;
          }
          
          .quick-view-overlay {
            opacity: 1;
            transform: translateY(0);
            background: rgba(0, 68, 110, 0.7);
          }
          
          .featured-badge {
            top: 8px;
            left: 8px;
          }
        }

        @media (max-width: 768px) {
          .display-5 {
            font-size: 2.2rem !important;
          }
          
          .trust-badges {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          
          .featured-card-wrapper:hover {
            transform: translateY(-8px);
          }
          
          .cta-benefits {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .display-5 {
            font-size: 1.8rem !important;
          }
          
          .section-badge {
            font-size: 0.85rem;
            padding: 0.4rem 0.8rem;
          }
          
          .featured-badge .badge-text {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
          }
          
          .btn-lg {
            padding: 0.75rem 1.5rem !important;
            font-size: 1rem;
          }
          
          .loading-placeholder {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
