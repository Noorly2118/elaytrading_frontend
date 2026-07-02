import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Animated scientific background (molecular / data flow) */}
      <div className="hero-bg-overlay"></div>
      <div className="animated-particles">
        <div className="particle orbital-1"></div>
        <div className="particle orbital-2"></div>
        <div className="particle orbital-3"></div>
        <div className="particle data-line-1"></div>
        <div className="particle data-line-2"></div>
        <div className="particle molecule-nucleus"></div>
        <div className="particle electron-1"></div>
        <div className="particle electron-2"></div>
      </div>

      <div className="container position-relative">
        <div className="row align-items-center min-vh-100">
          {/* Left: Content — scientific authority */}
          <div className="col-lg-6 col-xl-6 hero-content">
            <div></div>
            {/* Headline — authoritative, not commercial */}
            <h1 className="hero-title fw-bold mb-3">
              Elay Trading
              <span className="d-block mt-2">for Science That Demands Absolute Accuracy</span>
            </h1>

            {/* Secondary emphasis */}
            <div className="hero-disciplines mb-4">
              <span>Chemistry</span>
              <span className="divider">•</span>
              <span>Physics</span>
              <span className="divider">•</span>
              <span>Biology</span>
              <span className="divider">•</span>
              <span>Analytical Systems</span>
            </div>

            {/* CTA Buttons — B2B / procurement */}
            <div className="d-flex flex-wrap gap-3 mb-5 hero-cta-group">
              <Link
                to="/shop"
                className="btn btn-lg px-5 py-3 fw-semibold rounded-pill hero-btn-secondary"
              >
                Explore Equipment
              </Link>
              <Link
                to="/contact"
                className="btn btn-lg px-4 py-3 fw-semibold rounded-pill hero-btn-tertiary"
              >
                Talk to Lab Specialist
              </Link>
            </div>
          </div>

          {/* Right: Immersive lab visual — high‑end scientific environment */}
          <div
            className="hero-lab-wrapper"
            style={{
              backgroundImage: `url('https://i.pinimg.com/1200x/0c/6b/b7/0c6bb797b81fde16e697d5e1b7325561.jpg')`,
              backgroundPosition: "50% -80px",
              marginTop: '-70px',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="lab-glow"></div>
          </div>
        </div>
      </div>

      {/* ===== STYLES — high‑end scientific ===== */}
      <style>{`
        /* ----- base section ----- */
        .hero-section {
          position: relative;
          width: 100%;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding-top: 120px 0;
          overflow: hidden;
          background:#F1F2F4;
          height: 120vh;
        }

        /* background overlay with subtle gradient */
        .hero-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 30%, rgba(20, 60, 100, 0.4) 0%, rgba(8, 20, 35, 0.85) 90%);
          z-index: 1;
          pointer-events: none;
        }

        /* Mobile overlay - darkens image for readability */
        .hero-mobile-overlay {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(8, 20, 35, 0.75);
          z-index: 2;
          pointer-events: none;
        }

        /* ---- animated molecular / scientific particles ---- */
        .animated-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
          background: rgba(70, 180, 255, 0.15);
          box-shadow: 0 0 30px rgba(40, 160, 255, 0.1);
        }
        .orbital-1 {
          width: 400px;
          height: 400px;
          top: 10%;
          left: 5%;
          border: 1px solid rgba(70, 180, 255, 0.08);
          border-radius: 50%;
          animation: orbitSpin 28s linear infinite;
          background: transparent;
          box-shadow: none;
        }
        .orbital-2 {
          width: 280px;
          height: 280px;
          bottom: 5%;
          right: 8%;
          border: 1px solid rgba(70, 180, 255, 0.06);
          border-radius: 50%;
          animation: orbitSpin 22s linear infinite reverse;
          background: transparent;
          box-shadow: none;
        }
        .orbital-3 {
          width: 180px;
          height: 180px;
          top: 55%;
          left: 70%;
          border: 1px solid rgba(70, 200, 255, 0.05);
          border-radius: 50%;
          animation: orbitSpin 18s linear infinite;
          background: transparent;
          box-shadow: none;
        }
        .data-line-1 {
          width: 60%;
          height: 2px;
          top: 20%;
          left: 10%;
          background: linear-gradient(90deg, transparent, rgba(70, 200, 255, 0.1), transparent);
          animation: scanLine 14s ease-in-out infinite;
          border-radius: 0;
        }
        .data-line-2 {
          width: 40%;
          height: 2px;
          bottom: 30%;
          right: 5%;
          background: linear-gradient(90deg, transparent, rgba(70, 200, 255, 0.08), transparent);
          animation: scanLine 18s ease-in-out infinite reverse;
          border-radius: 0;
        }
        .molecule-nucleus {
          width: 20px;
          height: 20px;
          top: 25%;
          left: 20%;
          background: rgba(70, 200, 255, 0.4);
          box-shadow: 0 0 60px rgba(40, 160, 255, 0.3);
          animation: pulseGlow 6s ease-in-out infinite;
        }
        .electron-1 {
          width: 10px;
          height: 10px;
          top: 22%;
          left: 18%;
          background: #7fd4ff;
          box-shadow: 0 0 30px #2aa0ff;
          animation: electronOrbit 8s linear infinite;
        }
        .electron-2 {
          width: 8px;
          height: 8px;
          top: 30%;
          left: 24%;
          background: #7fd4ff;
          box-shadow: 0 0 30px #2aa0ff;
          animation: electronOrbit 11s linear infinite reverse;
        }

        /* animations */
        @keyframes orbitSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes scanLine {
          0% { transform: translateX(-20%) scaleX(0.4); opacity: 0.1; }
          50% { transform: translateX(20%) scaleX(1); opacity: 0.3; }
          100% { transform: translateX(-20%) scaleX(0.4); opacity: 0.1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        @keyframes electronOrbit {
          0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }

        /* ----- left content ----- */
        .hero-content {
          position: relative;
          z-index: 5;
          padding-right: 30px;
          padding-top: 140px;
        }

        .hero-badge {
          background: rgba(10, 40, 70, 0.7);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(70, 180, 255, 0.2);
          color: #b8dfff;
          padding: 8px 22px;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.4px;
        }
        .badge-icon {
          font-size: 1.1rem;
        }

        .hero-title {
          font-size: 3.4rem;
          line-height: 1.1;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 2px 20px rgba(0, 20, 50, 0.5);
        }
        .hero-title span {
          color: #7fd4ff;
          font-weight: 300;
          letter-spacing: -0.3px;
        }

        .hero-disciplines {
          font-size: 1.2rem;
          font-weight: 300;
          color: #b0d4f0;
          letter-spacing: 0.5px;
        }
        .hero-disciplines .divider {
          margin: 0 10px;
          color: #3a7ca5;
        }

        .hero-subtext {
          max-width: 520px;
          color: #ccddee;
          font-weight: 300;
          line-height: 1.6;
          opacity: 0.9;
        }

        /* ----- buttons (B2B / institutional) ----- */
        .hero-btn-primary {
          background: #1a7fc4;
          border: none;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(26, 127, 196, 0.25);
        }
        .hero-btn-primary:hover {
          background: #0f6aad;
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(26, 127, 196, 0.4);
          color: white;
        }

        .hero-btn-secondary {
          background: transparent;
          border: 1.5px solid #5a9fd4;
          color: #e0edf9;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .hero-btn-secondary:hover {
          background: rgba(26, 127, 196, 0.15);
          border-color: #7fd4ff;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(26, 127, 196, 0.15);
        }

        .hero-btn-tertiary {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #c0ddf5;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .hero-btn-tertiary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-3px);
        }

        /* ----- trust items (scientific) ----- */
        .trust-wrapper {
          margin-top: 10px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          color: #d0e4f5;
          font-size: 0.95rem;
          font-weight: 400;
          background: rgba(10, 35, 60, 0.4);
          backdrop-filter: blur(5px);
          padding: 6px 18px 6px 12px;
          border-radius: 40px;
          border: 1px solid rgba(70, 180, 255, 0.08);
        }
        .trust-icon {
          font-size: 1.2rem;
          opacity: 0.8;
        }

        /* ----- right side: lab environment (cinematic) ----- */
        .hero-lab-wrapper {
          position: absolute;
          right: -60px;
          top: 60px;
          bottom: 0;
          z-index: 3;
          width: 58%;
          max-width: 800px;
          height: 130%;
          pointer-events: none;
          margin-top: 50vh;
          min-height: 100%;
          filter: drop-shadow(-25px 0 70px rgba(29, 168, 240, 0.18))
                  drop-shadow(0 25px 80px rgba(0, 0, 0, 0.35));
          transform-origin: right bottom;
        }

        .lab-glow {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 85%;
          height: 85%;
          background: radial-gradient(
            ellipse at right bottom,
            rgba(29, 168, 240, 0.22) 0%,
            rgba(0, 68, 110, 0.12) 40%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
        }

        .glass-orb {
          position: absolute;
          top: 15%;
          right: 10%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(120, 210, 255, 0.08), transparent 70%);
          box-shadow: 0 0 80px rgba(50, 180, 255, 0.05);
          pointer-events: none;
        }
        .glow-ring {
          position: absolute;
          bottom: 20%;
          left: 5%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 1px solid rgba(70, 200, 255, 0.04);
          box-shadow: 0 0 100px rgba(30, 150, 255, 0.02);
          pointer-events: none;
        }
        .reflection-line {
          position: absolute;
          top: 10%;
          left: 15%;
          width: 40%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180, 230, 255, 0.1), transparent);
          transform: rotate(-12deg);
          pointer-events: none;
        }
        .specimen-shadow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background: linear-gradient(0deg, rgba(0, 10, 25, 0.5) 0%, transparent 100%);
          pointer-events: none;
        }

        /* ============================================
           RESPONSIVE - Tablet & Mobile (below 992px)
           ============================================ */
        @media (max-width: 991.98px) {
          .hero-section {
            min-height: 100vh;
            height: auto;
            padding: 100px 0 80px;
            background: #0b1a2b;
            position: relative;
          }

          /* Mobile overlay - darkens image */
          .hero-mobile-overlay {
            display: block;
          }

          /* Hide particles on mobile for cleaner look */
          .animated-particles {
            opacity: 0.3;
          }

          /* Lab wrapper becomes full background */
          .hero-lab-wrapper {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            max-width: 100%;
            height: 100%;
            margin-top: 0;
            min-height: 100%;
            z-index: 1;
            filter: none;
            transform: none;
            pointer-events: none;
            background-size: cover !important;
            background-position: center !important;
          }

          .hero-lab-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(8, 20, 35, 0.7);
            z-index: 1;
          }

          .lab-glow {
            display: none;
          }

          /* Content centered on mobile */
          .hero-content {
            position: relative;
            z-index: 5;
            padding: 0;
            margin: 0 auto;
            text-align: center;
            width: 100%;
            max-width: 600px;
          }

          .hero-title {
            font-size: 2.8rem;
            text-align: center;
          }

          .hero-title span {
            display: block;
          }

          .hero-disciplines {
            justify-content: center;
            text-align: center;
          }

          .hero-subtext {
            margin: 0 auto;
            text-align: center;
          }

          /* Center CTA buttons */
          .hero-cta-group {
            justify-content: center;
          }

          .hero-cta-group .btn {
            min-width: 200px;
          }

          /* Hide the original background overlay */
          .hero-bg-overlay {
            display: none;
          }
        }

        /* ---- Tablet (768px - 991px) ---- */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .hero-title {
            font-size: 3rem;
          }

          .hero-content {
            padding: 0 2rem;
          }

          .hero-cta-group .btn {
            min-width: 220px;
            padding: 0.75rem 1.5rem !important;
          }
        }

        /* ---- Mobile (below 768px) ---- */
        @media (max-width: 767.98px) {
          .hero-section {
            padding: 80px 0 60px;
          }

          .hero-title {
            font-size: 2.2rem;
          }

          .hero-title span {
            font-size: 1.6rem;
          }

          .hero-disciplines {
            font-size: 1rem;
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .hero-disciplines .divider {
            margin: 0 6px;
          }

          .hero-cta-group {
            flex-direction: column;
            align-items: center;
            gap: 1rem !important;
          }

          .hero-cta-group .btn {
            width: 100%;
            max-width: 280px;
            padding: 0.7rem 1.5rem !important;
            font-size: 0.95rem !important;
          }

          .hero-content {
            padding: 0 1rem;
          }

          .trust-wrapper {
            flex-direction: column;
            align-items: center;
          }

          .trust-item {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }

          /* Enhanced overlay for mobile */
          .hero-lab-wrapper::before {
            background: rgba(8, 20, 35, 0.8);
          }
        }

        /* ---- Small Mobile (below 480px) ---- */
        @media (max-width: 479.98px) {
          .hero-section {
            padding: 70px 0 50px;
            min-height: 50vh;
            height:70vh;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-title span {
            font-size: 1.3rem;
          }

          .hero-disciplines {
            font-size: 0.85rem;
          }

          .hero-cta-group .btn {
            max-width: 240px;
            padding: 0.6rem 1.2rem !important;
            font-size: 0.85rem !important;
          }

          .hero-content {
            padding: 0 0.75rem;
          }

          .hero-lab-wrapper::before {
            background: rgba(8, 20, 35, 0.85);
          }
        }

        /* ============================================
           DESKTOP - Preserve original layout (992px+)
           ============================================ */
        @media (min-width: 992px) {
          .hero-section {
            height: 120vh;
            min-height: 90vh;
          }

          .hero-content {
            padding-right: 30px;
            padding-top: 140px;
            text-align: left;
          }

          .hero-title {
            font-size: 3.4rem;
            text-align: left;
          }

          .hero-disciplines {
            justify-content: flex-start;
          }

          .hero-cta-group {
            justify-content: flex-start;
          }

          .hero-cta-group .btn {
            min-width: auto;
          }

          .hero-lab-wrapper {
            display: block;
            position: absolute;
            right: -60px;
            top: 60px;
            bottom: 0;
            z-index: 3;
            width: 58%;
            max-width: 800px;
            height: 130%;
            margin-top: 50vh;
            min-height: 100%;
            filter: drop-shadow(-25px 0 70px rgba(29, 168, 240, 0.18))
                    drop-shadow(0 25px 80px rgba(0, 0, 0, 0.35));
          }

          .hero-mobile-overlay {
            display: none !important;
          }

          .hero-bg-overlay {
            display: block;
          }
        }

        /* ---- Large Desktop (1400px+) ---- */
        @media (min-width: 1400px) {
          .hero-title {
            font-size: 4rem;
          }

          .hero-content {
            padding-right: 60px;
          }

          .hero-lab-wrapper {
            width: 55%;
            max-width: 900px;
            right: -80px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;