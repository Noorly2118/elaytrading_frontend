import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
  { 
    name: "Chemicals & Reagents", 
    slug: "chemicals", 
    icon: "🧪",
    description: "Premium chemicals for laboratory analysis",
    color: "#1DA8F0",
    gradient: "linear-gradient(135deg, #1DA8F0 0%, #0d8ed0 100%)"
  },
  { 
    name: "Laboratory Equipment", 
    slug: "lab-equipment", 
    icon: "🔬",
    description: "Modern lab instruments & tools",
    color: "#00446E",
    gradient: "linear-gradient(135deg, #00446E 0%, #003355 100%)"
  },
  { 
    name: "Educational Models", 
    slug: "educational-models", 
    icon: "📚",
    description: "Teaching aids & visual tools",
    color: "#2FB7C4",
    gradient: "linear-gradient(135deg, #2FB7C4 0%, #00A3A3 100%)"
  },
  { 
    name: "Agricultural Instruments", 
    slug: "agricultural-tools", 
    icon: "🌾",
    description: "Precision farming equipment",
    color: "#7ED321",
    gradient: "linear-gradient(135deg, #7ED321 0%, #5EBF0D 100%)"
  },
];

const CategorySection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="category-section py-6 py-lg-7 position-relative mb-2">
      {/* Background elements - REMOVED overflow-hidden from parent */}
      <div className="section-bg-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="container position-relative z-2">
        {/* Section Header */}
        <div className="text-center mb-6 mb-lg-7">
          <div className="d-inline-block mb-3">
           <div>

           </div>
          </div>
          <h2 className="fw-bold mb-3 display-5 mt-3">
            Explore Our <span className="text-primary">Premium</span> Collections
          </h2>
          <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: "680px" }}>
            Carefully selected high-quality products for laboratories, educational institutions, 
            and agricultural sectors across Ethiopia.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="row g-4 g-lg-5">
          {categories.map((cat, index) => (
            <div className="col-md-6 col-lg-3" key={cat.slug}>
              <Link
  to={`/category/${cat.slug}`}  // ← Changed to match navbar
  className="category-card text-decoration-none d-block h-100"
  style={{ 
    '--category-color': cat.color, 
    '--category-gradient': cat.gradient 
  }}
  onMouseEnter={() => setHoveredCard(index)}
  onMouseLeave={() => setHoveredCard(null)}
>
                <div 
                  className={`category-card-inner h-100 rounded-4 overflow-hidden position-relative ${
                    hoveredCard === index ? 'hovered' : ''
                  }`}
                >
                  {/* Icon Container */}
                  <div className="category-icon-container position-absolute">
                    <div 
                      className={`category-icon-wrapper d-flex align-items-center justify-content-center rounded-circle ${
                        hoveredCard === index ? 'hovered' : ''
                      }`}
                    >
                      <span 
                        className={`category-icon ${hoveredCard === index ? 'hovered' : ''}`}
                      >
                        {cat.icon}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="category-content p-4 p-lg-5 d-flex flex-column h-100">
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-3" style={{ color: "#00446E" }}>
                        {cat.name}
                      </h3>
                      <p className="text-muted mb-4">
                        {cat.description}
                      </p>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between mt-auto">
                      <span className="explore-link fw-semibold">
                        Explore Products
                      </span>
                      <div className="arrow-circle d-flex align-items-center justify-content-center rounded-circle">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-4 mt-lg-7">
          <Link
            to="/shop"
            className="btn-view-all btn btn-lg px-5 py-3 fw-bold rounded-pill"
          >
            View All Categories
          </Link>
        </div>
      </div>

      <style>{`
        .category-section {
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
          position: relative;
          /* REMOVED overflow-hidden */
        }

        /* Background decorative elements - FIXED: Contain circles within section */
        .section-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          /* ADD overflow: hidden to contain circles */
          overflow: hidden;
          pointer-events: none; /* Prevent interaction */
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(29, 168, 240, 0.05), transparent);
          border: 1px solid rgba(29, 168, 240, 0.1);
          pointer-events: none; /* Prevent interaction */
        }

        /* Adjusted positions to stay within bounds */
        .bg-circle-1 {
          width: 250px; /* Reduced size */
          height: 250px;
          top: 10%; /* Changed from -150px */
          right: -80px; /* Changed from -150px */
        }

        .bg-circle-2 {
          width: 180px; /* Reduced size */
          height: 180px;
          bottom: 20%; /* Changed position */
          left: -60px; /* Changed from -100px */
        }

        .bg-circle-3 {
          width: 120px;
          height: 120px;
          bottom: 30%; /* Adjusted position */
          right: 5%; /* Adjusted position */
        }

        /* Section badge */
        .section-badge {
          background: rgba(0, 68, 110, 0.1);
          color: #00446E;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          border: 1px solid rgba(0, 68, 110, 0.2);
        }

        /* Category cards */
        .category-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .category-card:hover {
          transform: translateY(-10px); /* Reduced from -12px */
        }

        .category-card-inner {
          background: white;
          border: 1px solid rgba(0, 68, 110, 0.1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .category-card-inner.hovered {
          border-color: var(--category-color);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        /* Icon container */
        .category-icon-container {
          top: -25px;
          right: 20px;
          z-index: 2;
        }

        .category-icon-wrapper {
          width: 80px;
          height: 80px;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, rgba(29, 168, 240, 0.1), rgba(29, 168, 240, 0.05));
          border: 1px solid rgba(29, 168, 240, 0.2);
        }

        .category-icon-wrapper.hovered {
          transform: scale(1.1) rotate(5deg);
          background: var(--category-gradient) !important;
          border-color: transparent !important;
        }

        .category-icon {
          font-size: 2.5rem;
          transition: all 0.4s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .category-icon.hovered {
          transform: scale(1.1);
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
        }

        /* Card content */
        .category-content {
          position: relative;
          z-index: 1;
          background: white;
          transition: all 0.4s ease;
        }

        .category-card-inner.hovered .category-content {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
        }

        .category-content h3 {
          color: #00446E;
          font-size: 1.4rem;
        }

        .category-content p {
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Arrow circle */
        .arrow-circle {
          width: 36px;
          height: 36px;
          background: rgba(0, 68, 110, 0.1);
          color: #00446E;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .category-card-inner.hovered .arrow-circle {
          background: var(--category-gradient);
          color: white;
          transform: translateX(5px);
        }

        /* Explore link */
        .explore-link {
          transition: all 0.3s ease;
          position: relative;
          padding-bottom: 2px;
          color: #00446E;
        }

        .explore-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--category-color);
          transition: width 0.3s ease;
        }

        .category-card-inner.hovered .explore-link {
          color: var(--category-color);
        }

        .category-card-inner.hovered .explore-link::after {
          width: 100%;
        }

        /* View All button */
        .btn-view-all {
          background: #F8FAFB;
          color: #00446E;
          border: 2px solid #00446E;
          transition: all 0.3s ease;
        }

        .btn-view-all:hover {
          background: #00446E;
          color: #F8FAFB;
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(0, 68, 110, 0.2);
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .category-section {
            padding: 80px 0 !important;
          }
          
          .display-5 {
            font-size: 2.5rem !important;
          }
          
          .category-content {
            padding: 1.5rem !important;
          }
          
          .bg-circle-1 {
            width: 200px;
            height: 200px;
            top: 5%;
            right: -50px;
          }
          
          .bg-circle-2 {
            width: 150px;
            height: 150px;
            left: -40px;
          }
        }

        @media (max-width: 768px) {
          .category-icon-wrapper {
            width: 70px;
            height: 70px;
          }
          
          .category-icon {
            font-size: 2rem !important;
          }
          
          .category-content h3 {
            font-size: 1.2rem !important;
          }
          
          .bg-circle-1, .bg-circle-2, .bg-circle-3 {
            display: none; /* Hide on smaller screens if causing issues */
          }
        }

        @media (max-width: 576px) {
          .category-section {
            padding: 60px 0 !important;
          }
          
          .row.g-4.g-lg-5 {
            gap: 1.5rem !important;
          }
          
          .display-5 {
            font-size: 2rem !important;
          }
          
          .lead {
            font-size: 1rem !important;
          }
          
          .category-content {
            padding: 1.25rem !important;
          }
          
          .category-icon-container {
            top: -20px;
            right: 15px;
          }
          
          .category-icon-wrapper {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </section>
  );
};

export default CategorySection;