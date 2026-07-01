import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Linkedin, Send, CheckCircle, X } from "lucide-react";
import adminApi from "../services/adminApi";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`toast-container ${isVisible ? 'show' : 'hide'}`}>
      <div className={`toast ${type}`}>
        <div className="toast-icon">
          {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
        </div>
        <div className="toast-content">
          <p className="toast-message">{message}</p>
        </div>
        <button className="toast-close" onClick={handleClose}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await adminApi.post("/contact", formData);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      showToast("Thank you for your message! We'll get back to you soon.", 'success');

    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Failed to send message. Please try again.",
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com", color: "#1877f2" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com", color: "#1da1f2" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "#e4405f" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com", color: "#ff0000" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com", color: "#0077b5" }
  ];

  return (
    <>
      <style>{`
        /* Toast Styles */
        .toast-container {
          position: fixed;
          top: 90px;
          right: 20px;
          z-index: 9999;
          max-width: 400px;
          width: 100%;
          transition: all 0.3s ease;
        }

        .toast-container.show {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-container.hide {
          transform: translateX(100%);
          opacity: 0;
        }

        .toast {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.05);
          animation: slideInRight 0.4s ease;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast.success {
          border-left: 4px solid #10b981;
        }

        .toast.error {
          border-left: 4px solid #ef4444;
        }

        .toast-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .toast.success .toast-icon {
          background: #d1fae5;
          color: #065f46;
        }

        .toast.error .toast-icon {
          background: #fee2e2;
          color: #991b1b;
        }

        .toast-content {
          flex: 1;
        }

        .toast-message {
          margin: 0;
          font-size: 0.95rem;
          color: #1f2937;
          line-height: 1.5;
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .toast-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        @media (max-width: 640px) {
          .toast-container {
            top: 80px;
            right: 10px;
            left: 10px;
            max-width: none;
            width: auto;
          }

          .toast {
            padding: 14px 16px;
          }

          .toast-message {
            font-size: 0.9rem;
          }
        }

        /* Contact Page Styles */
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef3 100%);
          padding-top: 0;
        }

        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #01446F 0%, #012a44 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-top: 45px;
        }

        .contact-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
          background-size: cover;
          opacity: 0.3;
        }

        .contact-hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .contact-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          animation: fadeInUp 0.6s ease;
        }

        .contact-hero p {
          font-size: 1.2rem;
          opacity: 0.95;
          animation: fadeInUp 0.6s ease 0.2s both;
        }

        /* Container */
        .contact-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        /* Grid Layout */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        /* Contact Info Section */
        .contact-info-section {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .contact-info-section h2 {
          font-size: 1.8rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .contact-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* Info Cards */
        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 16px;
          transition: all 0.3s;
        }

        .info-card:hover {
          transform: translateX(5px);
          background: #f0f2f5;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #01446F 0%, #012a44 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .info-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .info-content p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        /* Social Section */
        .social-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .social-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: #f8f9fa;
          border-radius: 10px;
          text-decoration: none;
          color: #4b5563;
          transition: all 0.3s;
          font-weight: 500;
        }

        .social-link:hover {
          background: var(--social-color);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Form Section */
        .contact-form-section {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .form-card h2 {
          font-size: 1.8rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        /* Form Styles */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #01446F;
          box-shadow: 0 0 0 3px rgba(1, 68, 111, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #9ca3af;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #01446F 0%, #012a44 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(1, 68, 111, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Map Section */
        .map-section {
          margin-top: 3rem;
        }

        .map-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          text-align: center;
        }

        .map-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          aspect-ratio: 16 / 9;
        }

        .map-frame {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Animations */
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

        /* ============================================
           RESPONSIVE DESIGN
           ============================================ */

        /* Tablet */
        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-hero {
            padding: 3rem 1.5rem;
            margin-top: 35px;
          }

          .contact-hero h1 {
            font-size: 2.5rem;
          }

          .contact-hero p {
            font-size: 1.1rem;
          }

          .contact-container {
            padding: 2rem 1.5rem;
          }

          .contact-info-section,
          .contact-form-section {
            padding: 1.5rem;
          }

          .info-cards {
            gap: 1rem;
          }
        }

        /* Mobile Large */
        @media (max-width: 640px) {
          .contact-hero {
            padding: 2.5rem 1rem;
            margin-top: 25px;
            margin-top:5rem;
          }

          .contact-hero h1 {
            font-size: 2rem;
          }

          .contact-hero p {
            font-size: 1rem;
          }

          .contact-container {
            padding: 1.5rem 1rem;
          }

          .contact-info-section,
          .contact-form-section {
            padding: 1.25rem;
            border-radius: 20px;
          }

          .contact-info-section h2,
          .form-card h2 {
            font-size: 1.5rem;
          }

          .info-card {
            padding: 0.75rem;
            border-radius: 12px;
            flex-direction: row;
            align-items: flex-start;
          }

          .info-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            flex-shrink: 0;
          }

          .info-icon svg {
            width: 20px;
            height: 20px;
          }

          .info-content h3 {
            font-size: 1rem;
          }

          .info-content p {
            font-size: 0.9rem;
          }

          .social-links {
            flex-direction: column;
            gap: 0.75rem;
          }

          .social-link {
            justify-content: center;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.65rem 0.9rem;
            font-size: 0.95rem;
            border-radius: 10px;
          }

          .submit-btn {
            padding: 0.85rem;
            font-size: 0.95rem;
          }

          .map-container {
            border-radius: 16px;
            aspect-ratio: 4 / 3;
          }

          .map-section h2 {
            font-size: 1.25rem;
          }

          .contact-subtitle,
          .form-subtitle {
            font-size: 0.95rem;
          }
        }

        /* Mobile Small */
        @media (max-width: 380px) {
          .contact-hero h1 {
            font-size: 1.75rem;
          }

          .contact-container {
            padding: 1rem 0.75rem;
          }

          .contact-info-section,
          .contact-form-section {
            padding: 1rem;
            border-radius: 16px;
          }

          .info-card {
            padding: 0.6rem;
            gap: 0.75rem;
          }

          .info-icon {
            width: 36px;
            height: 36px;
          }

          .info-icon svg {
            width: 18px;
            height: 18px;
          }

          .form-group label {
            font-size: 0.85rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
          }

          .social-link span {
            font-size: 0.85rem;
          }
        }

        /* Scroll Animations */
        .contact-info-section,
        .contact-form-section,
        .map-section {
          animation: fadeInUp 0.6s ease-out;
        }

        .contact-form-section {
          animation-delay: 0.1s;
        }

        .map-section {
          animation-delay: 0.2s;
        }

        /* Touch-friendly improvements */
        @media (hover: none) {
          .info-card:hover {
            transform: none;
            background: #f8f9fa;
          }

          .social-link:hover {
            background: #f8f9fa;
            color: #4b5563;
            transform: none;
          }

          .submit-btn:hover:not(:disabled) {
            transform: none;
          }
        }

        /* Accessibility - Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="contact-page">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Hero Section */}
        <div className="contact-hero">
          <div className="contact-hero-content">
            <h1>Get in Touch</h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Contact Information</h2>
              <p className="contact-subtitle">
                Have questions? We're here to help you with any inquiries about our products and services.
              </p>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="info-content">
                    <h3>Visit Us</h3>
                    <p>Kirkos Shopping Center House No. C-319/A-338</p>
                    <p>Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <Phone size={24} />
                  </div>
                  <div className="info-content">
                    <h3>Call Us</h3>
                    <p>+251 93 610 6100</p>
                    <p>+251 93 810 6100</p>
                    <p>+251 93 510 6100</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <Mail size={24} />
                  </div>
                  <div className="info-content">
                    <h3>Email Us</h3>
                    <p>elaytrading@gmail.com</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <Clock size={24} />
                  </div>
                  <div className="info-content">
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 2:30 AM - 11:30 PM</p>
                    <p>Saturday: 2:30 AM - 6:30 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{ '--social-color': social.color }}
                    >
                      <social.icon size={20} />
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-card">
                <h2>Send Us a Message</h2>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>Find Us Here</h2>
            <div className="map-container">
              <iframe
                title="Kirkos Shopping Center Map"
                className="map-frame"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.80!2d38.7526893!3d9.0049941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85c9346b9a01%3A0xc594f4c35a7dfc9c!2sKirkos%20Shopping%20Center!5e0!3m2!1sen!2set!4v0000000000"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Map showing Kirkos Shopping Center location"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}