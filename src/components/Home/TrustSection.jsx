import { Container, Row, Col } from "react-bootstrap";

const TrustSection = () => {
  const trustItems = [
    {
      value: "10+",
      label: "Years of Excellence",
      sublabel: "Serving since 2013",
      icon: "🏆",
      color: "#1DA8F0",
      gradient: "linear-gradient(135deg, #1DA8F0 0%, #0d8ed0 100%)",
      animation: "pulse"
    },
    {
      value: "500+",
      label: "Satisfied Institutions",
      sublabel: "Universities & Labs",
      icon: "🤝",
      color: "#2FB7C4",
      gradient: "linear-gradient(135deg, #2FB7C4 0%, #00A3A3 100%)",
      animation: "float"
    },
    {
      value: "100%",
      label: "Nationwide Coverage",
      sublabel: "Across Ethiopia",
      icon: "🚚",
      color: "#7ED321",
      gradient: "linear-gradient(135deg, #7ED321 0%, #5EBF0D 100%)",
      animation: "shake"
    },
    {
      value: "Certified",
      label: "Quality Standards",
      sublabel: "ISO & WHO Compliant",
      icon: "✓",
      color: "#FF6B6B",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)",
      animation: "spin"
    },
  ];

  const testimonials = [
    {
      text: "Reliable supplier for our university lab equipment. Quality and delivery exceeded expectations.",
      author: "Dr. Alemayehu, Addis Ababa University",
      role: "Department Head"
    },
    {
      text: "Their technical support helped us set up our new chemistry lab efficiently. Highly recommended!",
      author: "Sara Mengistu",
      role: "Lab Manager, Biotech Firm"
    }
  ];

  return (
    <section className="trust-section position-relative overflow-hidden">
      {/* Animated background elements */}
      <div className="trust-bg-elements">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="bg-grid"></div>
      </div>

      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}></div>
        ))}
      </div>

      <Container className="position-relative z-2 py-6 py-lg-7">
        {/* Section Header */}
        <div className="text-center mb-6 mb-lg-7">
          <div className="d-inline-block mb-4">
            
          </div>
          
          <h2 className="fw-bold mb-3 display-5 text-white">
            Why Leading <span className="text-gradient">Laboratories</span> Choose Us
          </h2>
          
          <p className="lead text-white opacity-85 mx-auto" style={{ maxWidth: "720px" }}>
            A decade of proven reliability, uncompromising quality standards, and nationwide support 
            — empowering Ethiopia's scientific community with premium laboratory solutions.
          </p>
        </div>

        {/* Stats Grid with enhanced cards */}
        <Row className="g-4 g-lg-5 justify-content-center mb-6 mb-lg-7">
          {trustItems.map((item, index) => (
            <Col md={6} lg={3} key={index}>
              <div 
                className={`trust-card text-center h-100 position-relative ${item.animation}`}
                style={{ '--item-color': item.color, '--item-gradient': item.gradient }}
              >
                {/* Card background glow */}
                <div className="card-glow"></div>
                
                {/* Animated icon container */}
                <div className="trust-icon-container mb-4">
                  <div className="icon-circle">
                    <span className="trust-icon">{item.icon}</span>
                  </div>
                  <div className="icon-ring"></div>
                </div>
                
                {/* Main value */}
                <h3 className="fw-bold mb-2 display-4 text-gradient" style={{ 
                  background: item.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {item.value}
                </h3>
                
                {/* Labels */}
                <p className="trust-label mb-1 fw-semibold fs-5 text-white">
                  {item.label}
                </p>
                <p className="trust-sublabel text-white opacity-75 mb-0">
                  {item.sublabel}
                </p>
                
                {/* Progress ring for animated stats */}
                {!isNaN(item.value) && (
                  <div className="progress-ring">
                    <svg width="120" height="120">
                      <circle 
                        className="progress-ring-circle" 
                        stroke={item.color}
                        strokeWidth="4"
                        fill="transparent"
                        r="52"
                        cx="60"
                        cy="60"
                        style={{
                          strokeDasharray: '326.56',
                          strokeDashoffset: '326.56',
                          animation: `progress 1.5s ease-out ${index * 0.2}s forwards`
                        }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>

        {/* Testimonials Section */}
        <div className="testimonials-wrapper rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="testimonial-main p-5 p-lg-6">
                <div className="d-flex align-items-center mb-4">
                  <span className="quote-icon me-3">❝</span>
                  <h4 className="mb-0 text-white fw-bold">Client Testimonials</h4>
                </div>
                
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="testimonial-card mb-4">
                    <p className="text-white opacity-90 mb-3">"{testimonial.text}"</p>
                    <div className="d-flex align-items-center">
                      <div className="author-avatar me-3">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-semibold text-white">{testimonial.author}</div>
                        <small className="text-white opacity-75">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="trust-features p-5 p-lg-6 h-100">
                <h4 className="fw-bold mb-4 text-white">Our Commitment</h4>
                
                <div className="feature-list">
                  {[
                    { icon: "⚡", text: "24-48 Hour Quote Response" },
                    { icon: "🔧", text: "On-site Technical Support" },
                    { icon: "🎓", text: "Training & Installation" },
                    { icon: "🔄", text: "After-sales Service" }
                  ].map((feature, index) => (
                    <div key={index} className="feature-item d-flex align-items-center mb-3">
                      <div className="feature-icon me-3">{feature.icon}</div>
                      <span className="text-white opacity-90">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="certifications mt-5 pt-3">
                  <small className="text-white opacity-75 d-block mb-2">Certifications & Partnerships</small>
                  <div className="d-flex gap-3 flex-wrap">
                    <span className="cert-badge">ISO 9001</span>
                    <span className="cert-badge">WHO Compliant</span>
                    <span className="cert-badge">Ministry Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     
      </Container>

      <style >{`
        .trust-section {
          background: linear-gradient(135deg, #00446E 0%, #003055 100%);
          position: relative;
          overflow: hidden;
        }

        /* Background elements */
        .trust-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29, 168, 240, 0.15) 0%, transparent 70%);
          filter: blur(40px);
        }

        .bg-orb-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -100px;
          animation: floatOrb 20s infinite ease-in-out;
        }

        .bg-orb-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -100px;
          animation: floatOrb 25s infinite ease-in-out reverse;
        }

        .bg-orb-3 {
          width: 200px;
          height: 200px;
          top: 30%;
          left: 10%;
          animation: floatOrb 15s infinite ease-in-out;
        }

        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Floating particles */
        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: floatParticle 20s infinite linear;
        }

        /* Section badge */
        .trust-badge {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .text-gradient {
          background: linear-gradient(135deg, #1DA8F0 0%, #7ED321 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Trust cards */
        .trust-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 2.5rem 1.5rem;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }

        .trust-card:hover {
          transform: translateY(-15px) scale(1.03);
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--item-color);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--item-gradient);
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -1;
          border-radius: 24px;
          filter: blur(20px);
        }

        .trust-card:hover .card-glow {
          opacity: 0.3;
        }

        /* Icon container */
        .trust-icon-container {
          position: relative;
          display: inline-block;
        }

        .icon-circle {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.5s ease;
        }

        .trust-card:hover .icon-circle {
          background: var(--item-gradient);
          border-color: transparent;
          transform: scale(1.1);
        }

        .icon-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: pulseRing 2s infinite;
        }

        .trust-icon {
          font-size: 3.5rem;
          transition: all 0.5s ease;
        }

        .trust-card:hover .trust-icon {
          transform: scale(1.2);
        }

        /* Progress ring */
        .progress-ring {
          position: absolute;
          top: 20px;
          right: 20px;
          opacity: 0.5;
        }

        /* Testimonials section */
        .testimonials-wrapper {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin:1.5rem;
        }

        .testimonial-main {
          background: linear-gradient(135deg, rgba(0, 68, 110, 0.8), rgba(0, 48, 85, 0.9));
          margin:1.5rem;
        }

        .trust-features {
          background: rgba(255, 255, 255, 0.03);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .quote-icon {
          font-size: 3rem;
          color: #1DA8F0;
          line-height: 1;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          background: var(--item-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          background: rgba(29, 168, 240, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .cert-badge {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Partners */
        .partner-logo {
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .partner-logo:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.1);
          border-color: #1DA8F0;
        }

        .logo-placeholder {
          color: white;
          opacity: 0.8;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* Animations */
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }

        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }

        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        @keyframes progress {
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .display-5 {
            font-size: 2.5rem !important;
          }
          
          .trust-card h3 {
            font-size: 2.5rem !important;
          }
          
          .trust-features {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        }

        @media (max-width: 768px) {
          .trust-icon {
            font-size: 3rem;
          }
          
          .icon-circle {
            width: 80px;
            height: 80px;
          }
          
          .display-4 {
            font-size: 2.5rem !important;
          }
        }

        @media (max-width: 576px) {
          .trust-section {
            padding: 60px 0 !important;
          }
          
          .trust-card {
            padding: 2rem 1rem;
          }
          
          .testimonial-main, .trust-features {
            padding: 2rem !important;
          }
          
          .partners-section {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustSection;