import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaShippingFast, FaCertificate, FaHeadset, FaQuoteRight } from 'react-icons/fa';
import './Footer.css';
import { FaLinkedinIn, FaFacebookF, FaTwitter, FaInstagram 
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import React, { useState, useEffect} from 'react';
import api from "../../services/api"



const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = res.data;
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);
  
  const labCategories = [
    'Chemistry Supplies',
    'Biology Equipment',
    'Physics Apparatus',
    'Glassware & Plasticware',
    'Safety Equipment',
    'Measuring Instruments',
    'Educational Tools',
    'Agricultural Testing'
  ];

  const services = [
    'Bulk Supply Orders',
    'Custom Lab Solutions',
    'Technical Support',
    'Installation Services',
    'Equipment Calibration',
    'Maintenance Contracts'
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand & CTA Section */}
            <div className="footer-brand-section">
              <div className="footer-brand">
                <div className="footer-logo">
                  <svg width="280" height="60" viewBox="0 0 280 60">
      <defs>
        <linearGradient id="scienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6F4FF" />
          <stop offset="50%" stopColor="#99D6FF" />
          <stop offset="100%" stopColor="#4AB2FF" />
        </linearGradient>
        <linearGradient id="commerceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#FFC107" />
        </linearGradient>
      </defs>

      <g transform="translate(15, 10)">
        <g fill="url(#scienceGradient)">
          <circle cx="0" cy="25" r="5" />
          <circle cx="20" cy="10" r="5" />
          <circle cx="20" cy="25" r="5" />
          <circle cx="20" cy="40" r="5" />
          <circle cx="40" cy="10" r="5" />
          <circle cx="40" cy="25" r="5" />
          <circle cx="40" cy="40" r="5" />
        </g>

        <g stroke="url(#scienceGradient)" strokeWidth="4" strokeLinecap="round">
          <line x1="0" y1="10" x2="20" y2="10" />
          <line x1="0" y1="25" x2="20" y2="25" />
          <line x1="0" y1="40" x2="20" y2="40" />
          <line x1="20" y1="10" x2="40" y2="10" />
          <line x1="20" y1="25" x2="40" y2="25" />
          <line x1="20" y1="40" x2="40" y2="40" />
        </g>

        <path
          d="M5 30 Q 22 18, 42 30"
          fill="none"
          stroke="url(#commerceGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <g>
        <text x="75" y="35" fontSize="28" fontWeight="800" fill="#fff">
          ELAY
        </text>
        <text x="75" y="52" fontSize="14" fontWeight="600" fill="#CCE7FF">
          TRADING
        </text>
      </g>
    </svg>
                </div>
                <p className="footer-tagline">Precision Supplies for Scientific Excellence</p>
                
                <div className="footer-cta-mobile">
                  <Link to="/request-quote" className="footer-quote-btn">
                    <FaQuoteRight className="me-2" />
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>

            {/* Categories */}
       <div className="footer-section">
        <h5 className="footer-section-title">Categories</h5>
        <ul className="footer-links">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <NavLink
                to={`/category/${cat.slug}`}
                className={({ isActive }) => isActive ? 'active-footer-link' : ''}
              >
                {cat.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

            {/* Services */}
            <div className="footer-section">
              <h5 className="footer-section-title">Services</h5>
              <ul className="footer-links">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link to="">{service}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="footer-section">
              <h5 className="footer-section-title">Contact</h5>
              <ul className="footer-contact">
                <li>
                  <FaPhone className="contact-icon" />
                  <a href="tel:+251 93 610 6100">+251 93 610 6100</a>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <a href="tel:+251 93 810 6100">+251 93 810 6100</a>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:elaytrading@gmail.com">elaytrading@gmail.com</a>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Kirkos Shopping Center House No. C-319/A-338, Addis Ababa, Ethiopia</span>
                </li>
              </ul>
              
              <div className="footer-social">
                <h5 className="footer-section-title">Follow Us</h5>
                <div className="social-links">
  <a href="#" className="social-icon" aria-label="LinkedIn">
    <FaLinkedinIn />
  </a>
  <a href="#" className="social-icon" aria-label="Facebook">
    <FaFacebookF />
  </a>
  <a href="#" className="social-icon" aria-label="Twitter">
    <FaTwitter />
  </a>
  <a href="#" className="social-icon" aria-label="Instagram">
    <FaInstagram />
  </a>
</div>
              </div>
            </div>

            {/* Trust & CTA Desktop */}
            {/* <div className="footer-section">
              <h5 className="footer-section-title">Why Choose Us</h5>
              <div className="trust-badges">
                <div className="badge-item">
                  <FaCertificate />
                  <span>Certified Suppliers</span>
                </div>
                <div className="badge-item">
                  <FaShippingFast />
                  <span>Pan-India Delivery</span>
                </div>
                <div className="badge-item">
                  <FaHeadset />
                  <span>Technical Support</span>
                </div>
              </div>
              
              <div className="footer-cta-desktop">
                <h5 className="footer-section-title">Quick Quote</h5>
                <p>Get competitive pricing within 24 hours</p>
                <Link to="/request-quote" className="footer-quote-btn">
                  <FaQuoteRight className="me-2" />
                  Request Quote
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">&copy; {currentYear} Elay Trading. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
      <Link to="/admin/login" className="admin-secret">
    <span className="admin-hex">  ⬢
</span>
</Link>
    </footer>
  );
};

export default Footer;