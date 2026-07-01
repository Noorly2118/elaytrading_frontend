import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="cta-section">
      {/* Background with overlay */}
      <div className="cta-bg-overlay"></div>
      
      <div className="container text-center position-relative z-1">
        <div className="cta-icon mb-4">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
           
            <g filter="url(#glow)">
              <path d="M32 8L12 20V32C12 46.359 21.641 56 32 56C42.359 56 52 46.359 52 32V20L32 8Z" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255, 255, 255, 0.05)" />
              <path d="M32 44V36" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="32" cy="24" r="3" fill="url(#ctaGradient)" />
              <path d="M24 28L28 32M40 28L36 32" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
        
        <h2 className="fw-bold mb-3 display-5">
          Get Your Lab Supplies Quote
        </h2>
        
        <p className="lead mb-4 opacity-90 cta-subtitle">
          Fast response • Competitive pricing • No commitment
        </p>
        
        <div className="mb-4 position-relative">
          <div className="cta-button-wrapper">
            <Link
              to="/request-quote"
              className="cta-button"
            >
              <span className="button-text">Request Free Quote</span>
              <span className="button-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <div className="button-shapes">
              <div className="shape-1"></div>
              <div className="shape-2"></div>
              <div className="shape-3"></div>
            </div>
          </div>
        </div>
        
        <div className="cta-features">
          <span className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Response within 24 hours
          </span>
          <span className="feature-divider">•</span>
          <span className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Bulk discounts available
          </span>
          <span className="feature-divider">•</span>
          <span className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M16 3V7M8 3V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 11H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Expert consultation
          </span>
        </div>
      </div>
      
      <style >{`
        .cta-section {
          background-image: url('https://i.pinimg.com/736x/37/72/db/3772dbfa25a4fd596dc4966cee850bc1.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          padding: clamp(80px, 10vw, 120px) 20px;
          position: relative;
          overflow: hidden;
        }
        
        .cta-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(145, 169, 185, 0.85) 0%, rgba(108, 201, 247, 0.8) 100%);
          z-index: 0;
        }
        
        .cta-icon {
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.3));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          75% { transform: translateY(-5px) rotate(-2deg); }
        }
        
        .cta-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          max-width: 600px;
          margin: 0 auto;
          letter-spacing: 0.5px;
        }
        
        .cta-button-wrapper {
          display: inline-block;
          position: relative;
        }
        
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
          color: #00446E;
          padding: 20px 50px;
          font-size: 1.2rem;
          font-weight: 800;
          border-radius: 50px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3);
          border: none;
          position: relative;
          overflow: hidden;
          z-index: 2;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.7s ease;
          z-index: 1;
        }
        
        .cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 40px rgba(255, 152, 0, 0.5);
          color: #003355;
        }
        
        .cta-button:hover::before {
          left: 100%;
        }
        
        .cta-button:active {
          transform: translateY(-2px) scale(1.02);
        }
        
        .button-text {
          position: relative;
          z-index: 2;
        }
        
        .button-arrow {
          margin-left: 12px;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 2;
        }
        
        .cta-button:hover .button-arrow {
          transform: translateX(5px);
        }
        
        .button-shapes {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .shape-1, .shape-2, .shape-3 {
          position: absolute;
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 50px;
          transition: all 0.4s ease;
        }
        
        .shape-1 {
          width: 110%;
          height: 130%;
          top: -15%;
          left: -5%;
          animation: pulse 2s infinite;
        }
        
        .shape-2 {
          width: 120%;
          height: 140%;
          top: -20%;
          left: -10%;
          animation: pulse 2s infinite 0.2s;
          border-color: rgba(255, 193, 7, 0.2);
        }
        
        .shape-3 {
          width: 130%;
          height: 150%;
          top: -25%;
          left: -15%;
          animation: pulse 2s infinite 0.4s;
          border-color: rgba(255, 193, 7, 0.1);
        }
        
        .cta-button-wrapper:hover .shape-1 {
          transform: scale(1.05);
          border-color: rgba(255, 193, 7, 0.4);
        }
        
        .cta-button-wrapper:hover .shape-2 {
          transform: scale(1.1);
          border-color: rgba(255, 193, 7, 0.3);
        }
        
        .cta-button-wrapper:hover .shape-3 {
          transform: scale(1.15);
          border-color: rgba(255, 193, 7, 0.2);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .cta-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 30px;
          font-size: 0.95rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 15px;
          border-radius: 20px;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        
        .feature-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .feature-divider {
          color: rgba(255, 255, 255, 0.5);
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .cta-section {
            background-attachment: scroll;
            padding: 60px 20px;
          }
          
          .cta-button {
            padding: 16px 35px;
            font-size: 1.1rem;
            width: 100%;
            max-width: 300px;
          }
          
          .cta-features {
            flex-direction: column;
            gap: 10px;
          }
          
          .feature-divider {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .cta-button {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default CTASection;