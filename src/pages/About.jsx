import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import about  from "../assets/about.jpg"

const AboutPage = () => {
  const [counters, setCounters] = useState({ clients: 0, years: 0, products: 0, deliveries: 0 });

  useEffect(() => {
    // Animate counters
    const animateCounter = (key, target, duration) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    animateCounter('clients', 500, 2000);
    animateCounter('years', 15, 2000);
    animateCounter('products', 1000, 2000);
    animateCounter('deliveries', 10000, 2000);
  }, []);

  const brandColor = "#002C4B";
  const brandLight = "#003A66";

  const styles = {
    page: {
      background: `linear-gradient(135deg, ${brandColor} 0%, ${brandLight} 100%)`,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: "100vh",
      paddingTop: "70px",
    },

    hero: {
      position: "relative",
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${brandColor}CC 0%, ${brandLight}CC 100%)`,
    },
    heroBackground: {
      position: "absolute",
      inset: 0,
      backgroundImage: "url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.15,
      zIndex: 0,
    },
    heroContent: {
      maxWidth: "900px",
      margin: "0 auto",
      textAlign: "center",
      position: "relative",
      zIndex: 2,
      padding: "20px",
    },
    heroBadge: {
      display: "inline-block",
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(10px)",
      padding: "8px 20px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "500",
      marginBottom: "20px",
      letterSpacing: "1px",
      color: "white",
    },
    heroTitle: {
      fontSize: "clamp(2.2rem, 8vw, 4rem)",
      fontWeight: "800",
      marginBottom: "20px",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    heroSubtitle: {
      fontSize: "clamp(1rem, 4vw, 1.25rem)",
      marginBottom: "32px",
      opacity: 0.95,
      lineHeight: 1.6,
      color: "#e0e7ff",
      padding: "0 10px",
    },

    // Stats Section
    statsSection: {
      marginTop: "-50px",
      position: "relative",
      zIndex: 10,
      padding: "0 15px",
    },
    statsContainer: {
      maxWidth: "1100px",
      margin: "0 auto",
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      padding: "32px 20px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "24px",
    },
    statCard: {
      textAlign: "center",
      padding: "12px",
    },
    statNumber: {
      fontSize: "clamp(2rem, 6vw, 3rem)",
      fontWeight: "800",
      color: brandColor,
      marginBottom: "6px",
      background: `linear-gradient(135deg, ${brandColor} 0%, ${brandLight} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    statLabel: {
      fontSize: "clamp(11px, 3vw, 13px)",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontWeight: "600",
    },

    // General Sections
    section: {
      padding: "60px 0",
      background: "white",
    },
    sectionAlt: {
      padding: "60px 0",
      background: "#f8fafc",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    },

    sectionTitle: {
      fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
      fontWeight: "700",
      color: brandColor,
      marginBottom: "16px",
      letterSpacing: "-0.01em",
      textAlign: "center",
    },
    sectionSubtitle: {
      fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
      color: "#4b5563",
      marginBottom: "40px",
      textAlign: "center",
      padding: "0 10px",
    },

    imageCard: {
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      height: "clamp(240px, 50vw, 400px)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "transform 0.3s ease",
      width: "100%",
    },

    trustCard: {
      background: "white",
      padding: "clamp(20px, 5vw, 32px)",
      borderRadius: "20px",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      border: "1px solid #e5e7eb",
    },

    // CTA Section
    ctaSection: {
      background: `linear-gradient(135deg, ${brandColor} 0%, ${brandLight} 100%)`,
      padding: "clamp(50px, 10vw, 80px) 20px",
      position: "relative",
      overflow: "hidden",
    },
    ctaContent: {
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      maxWidth: "800px",
      margin: "0 auto",
      color: "white",
    },
    ctaTitle: {
      fontSize: "clamp(1.8rem, 7vw, 3rem)",
      fontWeight: "800",
      marginBottom: "20px",
      lineHeight: 1.2,
    },
    ctaSubtitle: {
      fontSize: "clamp(0.95rem, 4vw, 1.15rem)",
      marginBottom: "40px",
      opacity: 0.95,
      padding: "0 10px",
    },
    ctaButtons: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    ctaPrimaryButton: {
      background: "white",
      color: brandColor,
      padding: "clamp(12px, 4vw, 16px) clamp(24px, 8vw, 48px)",
      borderRadius: "50px",
      fontSize: "clamp(14px, 4vw, 18px)",
      fontWeight: "700",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
      display: "inline-block",
      textAlign: "center",
    },
    ctaSecondaryButton: {
      background: "transparent",
      color: "white",
      padding: "clamp(12px, 4vw, 16px) clamp(24px, 8vw, 48px)",
      borderRadius: "50px",
      fontSize: "clamp(14px, 4vw, 18px)",
      fontWeight: "600",
      border: "2px solid white",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
      display: "inline-block",
      textAlign: "center",
    },
    listItem: {
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },
  };

  const trustPoints = [
    { icon: "🚚", title: "Nationwide Delivery", text: "Fast and reliable delivery across all regions of Ethiopia", color: brandColor },
    { icon: "⚗️", title: "Premium Quality", text: "Top-grade chemicals and laboratory equipment", color: brandLight },
    { icon: "🤝", title: "Global Partners", text: "Trusted suppliers from around the world", color: brandColor },
    { icon: "💰", title: "Competitive Pricing", text: "Best value for quality products", color: brandLight }
  ];

  const values = [
    { icon: "🔬", title: "Scientific Excellence", desc: "Commitment to highest laboratory standards" },
    { icon: "🎓", title: "Educational Support", desc: "Empowering learning institutions nationwide" },
    { icon: "🌱", title: "Sustainable Growth", desc: "Eco-friendly practices and solutions" },
    { icon: "🤝", title: "Partnership", desc: "Building lasting relationships with clients" },
    { icon: "⚡", title: "Innovation", desc: "Adopting latest technology and methods" },
    { icon: "⭐", title: "Quality First", desc: "Never compromising on product standards" }
  ];

  const mediaStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @media (max-width: 768px) {
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    }
    .stat-card:hover {
      transform: translateY(-5px);
      transition: all 0.3s ease;
    }
    .trust-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .value-card:hover {
      transform: translateY(-5px);
      background: linear-gradient(135deg, ${brandColor} 0%, ${brandLight} 100%);
      color: white;
    }
    @media (max-width: 768px) {
      .trust-card:hover {
        transform: translateY(-5px);
      }
      .value-card:hover {
        transform: translateY(-3px);
      }
    }

    /* Desktop styles */
    @media (min-width: 769px) {
      .grid-2-col {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 60px !important;
      }
      .grid-3-col {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 30px !important;
      }
      .grid-4-col {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 30px !important;
      }
      .cta-buttons-row {
        flex-direction: row !important;
      }
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .grid-2-col, .grid-3-col, .grid-4-col {
        display: flex !important;
        flex-direction: column !important;
      }
      .cta-buttons-row {
        flex-direction: column !important;
        align-items: center !important;
      }
      .cta-buttons-row a {
        width: 100% !important;
        max-width: 320px !important;
      }
    }

    /* Small mobile */
    @media (max-width: 480px) {
      .stats-container {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
        padding: 20px 16px !important;
      }
      .hero-title {
        font-size: 1.8rem !important;
      }
    }

    /* Image container fixes for mobile */
    .image-wrapper {
      width: 100%;
      height: auto;
      min-height: 200px;
    }
    .image-wrapper .image-card {
      height: clamp(200px, 40vw, 300px) !important;
      width: 100% !important;
      display: block !important;
    }
    @media (max-width: 768px) {
      .image-wrapper {
        min-height: 180px;
      }
      .image-wrapper .image-card {
        height: 220px !important;
        min-height: 180px !important;
      }
    }
  `;

  return (
    <>
      <style>{mediaStyles}</style>
      <div style={styles.page}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroBackground}></div>
          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>
              <h2>ABOUT ELAY TRADING</h2>
            </div>
            <h1 style={styles.heroTitle}>
              Empowering Ethiopia's Scientific Future
            </h1>
            <p style={styles.heroSubtitle}>
              Elay Trading is revolutionizing laboratory supply chains across Ethiopia, 
              providing premium quality chemicals, equipment, and educational tools to 
              universities, research institutions, and industries nationwide.
            </p>
          </div>
        </section>

        {/* Floating Stats Section */}
        <div style={styles.statsSection}>
          <div className="stats-container" style={styles.statsContainer}>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>{counters.clients}+</div>
              <div style={styles.statLabel}>Happy Clients</div>
            </div>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>{counters.years}+</div>
              <div style={styles.statLabel}>Years Experience</div>
            </div>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>{counters.products}+</div>
              <div style={styles.statLabel}>Products Available</div>
            </div>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>{counters.deliveries}+</div>
              <div style={styles.statLabel}>Successful Deliveries</div>
            </div>
          </div>
        </div>

        {/* Who We Are Section */}
        <div style={styles.section}>
          <div style={styles.container}>
            <div className="grid-2-col" style={{ display: "grid", gap: "40px", alignItems: "center" }}>
              <div>
                <h2 style={styles.sectionTitle}>Who We Are</h2>
                <p style={{ color: "#4b5563", lineHeight: 1.8, marginBottom: "24px", fontSize: "clamp(14px, 4vw, 16px)" }}>
                  Elay Trading is Ethiopia's premier supplier of laboratory equipment, 
                  educational tools, agricultural instruments, and premium chemicals & reagents. 
                  With over a decade of experience, we've become the trusted partner for 
                  universities, research institutions, and industries across the nation.
                </p>
                <div style={{ marginTop: "30px" }}>
                  {[
                    "🏛️ 50+ Universities & Research Institutions",
                    "📚 100+ Educational Organizations",
                    "🌾 Agricultural Sector Support",
                    "🚚 Nationwide Delivery Network",
                    "🔬 ISO Certified Laboratory Supplies",
                    "⭐ 99% Customer Satisfaction Rate"
                  ].map((item, idx) => (
                    <div key={idx} style={styles.listItem}>
                      <span style={{ fontSize: "clamp(16px, 5vw, 20px)", minWidth: "30px" }}>{item.split(" ")[0]}</span>
                      <span style={{ color: "#4b5563", fontSize: "clamp(13px, 3.5vw, 16px)" }}>{item.substring(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="image-wrapper">
                <div >
                  <img
                  style={{
                  ...styles.imageCard,
                  backgroundImage: about,
                  cursor: "pointer",
                  height: "clamp(220px, 50vw, 400px)",
                  width: "100%",
                  display: "block",
                }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                   src={about} alt="" />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div style={styles.sectionAlt}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Why Choose Us</h2>
            <p style={styles.sectionSubtitle}>
              Setting the standard for quality and reliability in Ethiopia
            </p>
            <div className="grid-4-col" style={{ display: "grid", gap: "30px" }}>
              {trustPoints.map((point, idx) => (
                <div 
                  key={idx} 
                  className="trust-card"
                  style={styles.trustCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ fontSize: "clamp(40px, 10vw, 56px)", marginBottom: "16px" }}>{point.icon}</div>
                  <h4 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: "700", color: point.color, marginBottom: "12px" }}>{point.title}</h4>
                  <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: "clamp(13px, 3.5vw, 16px)" }}>{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div style={styles.section}>
          <div style={styles.container}>
            <div className="grid-2-col" style={{ display: "grid", gap: "40px", alignItems: "center" }}>
              <div className="image-wrapper">
                <div style={{
                  ...styles.imageCard,
                  backgroundImage: "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
                  height: "clamp(220px, 50vw, 350px)",
                  width: "100%",
                  display: "block",
                }}></div>
              </div>
              <div>
                <div style={{ marginBottom: "clamp(24px, 6vw, 40px)" }}>
                  <div style={{ fontSize: "clamp(36px, 8vw, 48px)", marginBottom: "16px" }}>🎯</div>
                  <h3 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: "700", color: brandColor, marginBottom: "20px" }}>Our Vision</h3>
                  <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "clamp(14px, 3.5vw, 16px)" }}>
                    To become Ethiopia's leading chemical and laboratory supply company, 
                    transitioning from import to local manufacturing while driving innovation 
                    in scientific education and industrial growth across the nation.
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: "clamp(36px, 8vw, 48px)", marginBottom: "16px" }}>🚀</div>
                  <h3 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: "700", color: brandColor, marginBottom: "20px" }}>Our Mission</h3>
                  <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "clamp(14px, 3.5vw, 16px)" }}>
                    To deliver high-quality chemical and laboratory products quickly and ethically, 
                    provide cutting-edge technology solutions, collaborate with industry stakeholders, 
                    and ensure complete customer satisfaction through excellence in service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div style={styles.sectionAlt}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Our Core Values</h2>
            <p style={styles.sectionSubtitle}>
              The principles that guide everything we do
            </p>
            <div className="grid-3-col" style={{ display: "grid", gap: "24px" }}>
              {values.map((value, idx) => (
                <div 
                  key={idx} 
                  className="value-card"
                  style={{ ...styles.trustCard, cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${brandColor} 0%, ${brandLight} 100%)`;
                    e.currentTarget.style.color = "white";
                    const title = e.currentTarget.querySelector("h4");
                    const desc = e.currentTarget.querySelector("p");
                    if (title) title.style.color = "white";
                    if (desc) desc.style.color = "rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#1f2937";
                    const title = e.currentTarget.querySelector("h4");
                    const desc = e.currentTarget.querySelector("p");
                    if (title) title.style.color = "#1f2937";
                    if (desc) desc.style.color = "#6b7280";
                  }}
                >
                  <div style={{ fontSize: "clamp(36px, 8vw, 48px)", marginBottom: "16px" }}>{value.icon}</div>
                  <h4 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: "700", marginBottom: "12px", transition: "color 0.3s" }}>{value.title}</h4>
                  <p style={{ color: "#6b7280", lineHeight: 1.6, transition: "color 0.3s", fontSize: "clamp(13px, 3.5vw, 16px)" }}>{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <div style={{ fontSize: "clamp(48px, 10vw, 64px)", marginBottom: "20px", animation: "float 3s ease-in-out infinite" }}>
              🤝
            </div>
            <h2 style={styles.ctaTitle}>
              Ready to Transform Your Laboratory Experience?
            </h2>
            <p style={styles.ctaSubtitle}>
              Join over 500+ satisfied clients who trust Elay Trading for their laboratory needs. 
              Get a free consultation and quote today!
            </p>
            <div className="cta-buttons-row" style={styles.ctaButtons}>
              <Link to="/request-quote" style={styles.ctaPrimaryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                }}>
                Request a Quote →
              </Link>
              <Link to="/contact" style={styles.ctaSecondaryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = brandColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "white";
                }}>
                Contact Sales Team
              </Link>
            </div>
            <div style={{ marginTop: "clamp(24px, 6vw, 40px)", fontSize: "clamp(11px, 3vw, 14px)", opacity: 0.8 }}>
              ⚡ Free consultation | ⚡ Volume discounts | ⚡ Nationwide delivery
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;