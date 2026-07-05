import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    class Particle {
      constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update(width, height) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width || this.x < 0) this.speedX *= -1;
        if (this.y > height || this.y < 0) this.speedY *= -1;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      particles = [];
      const count = Math.min(80, Math.floor((rect.width * rect.height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(rect.width, rect.height));
      }
    };

    const connectParticles = (ctx, width, height) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = 0.15 * (1 - distance / 150);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 180, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particles.forEach(particle => {
        particle.update(rect.width, rect.height);
        particle.draw(ctx);
      });

      connectParticles(ctx, rect.width, rect.height);
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero-section">
      {/* Canvas for dynamic particle network */}
      <canvas ref={canvasRef} className="hero-canvas"></canvas>

      {/* Floating geometric shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="container position-relative">
        <div className="row align-items-center min-vh-100">
          {/* Left: Content */}
          <div className="col-lg-7 col-xl-7 hero-content mt-4">
            {/* Badge */}
            <div className="hero-badge mb-4 mt-5">
              <span className="badge-icon">✦</span> Scientific Excellence Since 2010
            </div>

            {/* Headline */}
            <h1 className="hero-title fw-bold mb-3 mt-4">
              ELAY TRADING
            </h1>

            {/* Subtitle */}
             <p className="hero-subtext mb-4">
              Elay Trading delivers premium laboratory equipment, analytical systems, 
              and scientific solutions for institutions that demand accuracy.
            </p>
         
            

            {/* CTA Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-5 hero-cta-group mt-5">
              <Link
                to="/shop"
                className="btn btn-lg px-5 py-3 fw-semibold rounded-pill hero-btn-primary"
              >
                Explore Equipment
                <span className="btn-arrow">→</span>
              </Link>
              <Link
                to="/contact"
                className="btn btn-lg px-4 py-3 fw-semibold rounded-pill hero-btn-secondary"
              >
                Talk to Specialist
              </Link>
            </div>

           
          </div>

          {/* Right: Visual */}
          <div className="col-lg-5 col-xl-5 hero-visual">
            <div className="visual-container">
              <div className="visual-ring ring-1"></div>
              <div className="visual-ring ring-2"></div>
              <div className="visual-ring ring-3"></div>
              <div className="visual-core">
                <div className="core-pulse"></div>
              </div>
              <div className="visual-label">Advanced Laboratory Systems</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      

      <style>{`
        /* ===== BASE ===== */
        .hero-section {
          position: relative;
          width: 100%;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #f8faff 0%, #e8f0fe 50%, #f0f5ff 100%);
          padding: 80px 0;
        }

        /* ===== CANVAS BACKGROUND ===== */
        .hero-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* ===== FLOATING SHAPES ===== */
        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -50px;
          right: -50px;
          background: radial-gradient(circle, rgba(66, 153, 225, 0.15), transparent 70%);
          animation: floatShape 20s ease-in-out infinite;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: 10%;
          left: -30px;
          background: radial-gradient(circle, rgba(99, 179, 237, 0.1), transparent 70%);
          animation: floatShape 25s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 40%;
          right: 10%;
          background: radial-gradient(circle, rgba(66, 153, 225, 0.08), transparent 70%);
          animation: floatShape 18s ease-in-out infinite 2s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          right: 30%;
          background: radial-gradient(circle, rgba(99, 179, 237, 0.06), transparent 70%);
          animation: floatShape 22s ease-in-out infinite 4s;
        }

        @keyframes floatShape {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* ===== LEFT CONTENT ===== */
        .hero-content {
          position: relative;
          z-index: 5;
          padding-right: 40px;
          margin-top:30px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(66, 153, 225, 0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(66, 153, 225, 0.15);
          color: #2b6cb0;
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .badge-icon {
          margin-right: 8px;
          color: #4299e1;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          color: #1a202c;
        }

        .hero-title span {
          color: #2b6cb0;
          font-weight: 300;
          letter-spacing: -0.5px;
        }

        .hero-subtext {
          max-width: 520px;
          color: #4a5568;
          font-size: 1.15rem;
          font-weight: 400;
          line-height: 1.7;
        }

        .hero-disciplines {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .discipline-tag {
          background: rgba(66, 153, 225, 0.08);
          border: 1px solid rgba(66, 153, 225, 0.12);
          color: #2b6cb0;
          padding: 5px 18px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .discipline-tag:hover {
          background: rgba(66, 153, 225, 0.15);
          transform: translateY(-2px);
        }

        /* ===== BUTTONS ===== */
        .hero-btn-primary {
          background: #2b6cb0;
          border: none;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(43, 108, 176, 0.25);
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary:hover {
          background: #1a4f7a;
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(43, 108, 176, 0.35);
          color: white;
        }

        .btn-arrow {
          display: inline-block;
          margin-left: 10px;
          transition: transform 0.3s ease;
        }

        .hero-btn-primary:hover .btn-arrow {
          transform: translateX(6px);
        }

        .hero-btn-secondary {
          background: transparent;
          border: 2px solid #4299e1;
          color: #2b6cb0;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          background: rgba(66, 153, 225, 0.08);
          border-color: #2b6cb0;
          color: #1a4f7a;
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(66, 153, 225, 0.15);
        }

        /* ===== TRUST ITEMS ===== */
        .trust-wrapper {
          margin-top: 10px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          color: #4a5568;
          font-size: 0.9rem;
          font-weight: 500;
          gap: 8px;
        }

        .trust-icon {
          color: #4299e1;
          font-weight: 700;
        }

        /* ===== RIGHT VISUAL ===== */
        .hero-visual {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }

        .visual-container {
          position: relative;
          width: 100%;
          max-width: 480px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(66, 153, 225, 0.1);
          animation: ringPulse 4s ease-in-out infinite;
        }

        .ring-1 {
          width: 100%;
          height: 100%;
          animation-delay: 0s;
          border-color: rgba(66, 153, 225, 0.08);
        }

        .ring-2 {
          width: 75%;
          height: 75%;
          animation-delay: 1.3s;
          border-color: rgba(66, 153, 225, 0.12);
          border-width: 1.5px;
        }

        .ring-3 {
          width: 50%;
          height: 50%;
          animation-delay: 2.6s;
          border-color: rgba(66, 153, 225, 0.15);
          border-width: 1px;
        }

        @keyframes ringPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          25% { transform: scale(1.05) rotate(5deg); opacity: 1; }
          50% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          75% { transform: scale(0.95) rotate(-5deg); opacity: 0.8; }
        }

        .visual-core {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4299e1, #2b6cb0);
          box-shadow: 
            0 0 60px rgba(66, 153, 225, 0.3),
            0 0 120px rgba(66, 153, 225, 0.1);
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .core-pulse {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          animation: corePulse 2s ease-in-out infinite;
        }

        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 0.2; }
        }

        .visual-label {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          color: #2b6cb0;
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          padding: 8px 24px;
          border-radius: 50px;
          border: 1px solid rgba(66, 153, 225, 0.15);
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          z-index: 3;
        }

        /* ===== SCROLL INDICATOR ===== */
        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #718096;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          z-index: 5;
          opacity: 0.6;
          animation: scrollBounce 2s ease-in-out infinite;
        }

        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, #718096, transparent);
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 991.98px) {
          .hero-content {
            padding-right: 0;
            text-align: center;
            margin-bottom: 40px;
          }

          .hero-title {
            font-size: 3rem;
          }

          .hero-subtext {
            margin: 0 auto;
          }

          .hero-disciplines {
            justify-content: center;
          }

          .hero-cta-group {
            justify-content: center;
          }

          .trust-wrapper {
            justify-content: center;
          }

          .hero-visual {
            min-height: 300px;
          }

          .visual-container {
            max-width: 320px;
          }

          .visual-core {
            width: 80px;
            height: 80px;
          }

          .core-pulse {
            width: 40px;
            height: 40px;
          }

          .visual-label {
            font-size: 0.75rem;
            padding: 6px 16px;
            bottom: -5px;
          }
        }

        @media (max-width: 767.98px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-title span {
            font-size: 1.6rem;
          }

          .hero-subtext {
            font-size: 1rem;
          }

          .hero-cta-group {
            flex-direction: column;
            align-items: center;
          }

          .hero-cta-group .btn {
            width: 100%;
            max-width: 300px;
          }

          .hero-visual {
            min-height: 200px;
          }

          .visual-container {
            max-width: 240px;
          }

          .visual-core {
            width: 60px;
            height: 60px;
          }

          .core-pulse {
            width: 30px;
            height: 30px;
          }

          .visual-label {
            font-size: 0.7rem;
            padding: 4px 12px;
            bottom: -2px;
          }

          .scroll-indicator {
            display: none;
          }

          .trust-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 8px !important;
          }

          .hero-disciplines {
            gap: 6px;
          }

          .discipline-tag {
            font-size: 0.75rem;
            padding: 4px 12px;
          }
        }

        @media (max-width: 479.98px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-title span {
            font-size: 1.3rem;
          }

          .hero-badge {
            font-size: 0.7rem;
            padding: 6px 16px;
          }

          .visual-container {
            max-width: 180px;
          }

          .visual-core {
            width: 50px;
            height: 50px;
          }

          .core-pulse {
            width: 24px;
            height: 24px;
          }

          .visual-label {
            font-size: 0.6rem;
            padding: 4px 10px;
          }
        }

        /* ===== DESKTOP ===== */
        @media (min-width: 992px) {
          .hero-section {
            padding: 0;
          }

          .hero-content {
            padding-top: 0;
          }

          .hero-title {
            font-size: 4.2rem;
          }
        }

        @media (min-width: 1400px) {
          .hero-title {
            font-size: 5rem;
          }

          .hero-subtext {
            font-size: 1.3rem;
            max-width: 580px;
          }

          .visual-container {
            max-width: 550px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;