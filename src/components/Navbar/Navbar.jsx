// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from "../../context/cartcontext";
import CartSidebar from "../CartSidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

// Icon Components for better styling
const UserIcon = ({ isLoggedIn, userName }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    {isLoggedIn && (
      <circle cx="12" cy="8" r="6" fill="#1DA8F0" fillOpacity="0.2" stroke="none"/>
    )}
  </svg>
);

const CartIcon = ({ itemCount }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 7L8 16H16L18 7H6Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="currentColor"/>
    <circle cx="15" cy="20" r="1.5" fill="currentColor" stroke="currentColor"/>
    <path d="M12 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const location = useLocation();
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const togglerRef = useRef(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
const data = res.data;

setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);


  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
  } else {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
  return () => {
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  };
}, [mobileMenuOpen]);
  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
    setDropdownOpen(false);
  };

  // Categories
  // const categories = [
  //   { name: "Chemistry Chemicals & Reagents", slug: "chemicals" },
  //   { name: "Laboratory Glassware & Plasticware", slug: "glassware" },
  //   { name: "Physics Apparatus", slug: "physics" },
  //   { name: "Biology Models & Charts", slug: "biology" },
  //   { name: "Analytical Equipment", slug: "analytical" },
  //   { name: "Educational Tools", slug: "education" },
  //   { name: "Agricultural Instruments", slug: "agriculture" },
  // ];

  const Logo = () => (
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
  );

  return (
 
    <>
      {/* Overlay - only renders when menu is open */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(false);
          }}
        />
      )}

      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-fluid px-3 px-lg-4">

          {/* Logo */}
          <NavLink to="/" className="navbar-brand">
            <Logo />
          </NavLink>

          {/* Toggler */}
          <button
            ref={togglerRef}
            className={`navbar-toggler ${mobileMenuOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMobileMenu();
            }}
          >
            <span className={`navbar-toggler-icon ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>

          {/* Mobile Menu - Using custom class */}
          <div
            ref={mobileMenuRef}
            className={`custom-mobile-menu ${mobileMenuOpen ? 'show' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

              <li className="nav-item">
                <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/shop" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</NavLink>
              </li>

              {/* Categories Dropdown */}
              <li className="nav-item dropdown" ref={dropdownRef}>
                <a
                  href="#"
                  className={`nav-link dropdown-toggle ${dropdownOpen ? 'show' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDropdown(e);
                  }}
                >
                  Categories <ChevronDown />
                </a>

                <ul className={`dropdown-menu categories-dropdown ${dropdownOpen ? 'show' : ''}`}>
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <NavLink
                        to={`/category/${cat.slug}`}
                        className="dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileMenuOpen(false);
                          setDropdownOpen(false);
                        }}
                      >
                        {cat.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <NavLink to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
              </li>

              {/* User Section */}
              <li className="nav-item user-nav-item" ref={userDropdownRef}>
                {!user ? (
                  <NavLink to="/login" className="user-icon-btn" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon isLoggedIn={false} />
                    <span className="user-label">Login</span>
                  </NavLink>
                ) : (
                  <>
                    <button
                    
                      className={`user-menu-btn ${userDropdownOpen ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserDropdown(e);
                      }}
                    >
                      <UserIcon isLoggedIn={true} />
                      <span className="user-name">{user.name?.split(" ")[0]}</span>
                      <ChevronDown />
                    </button>

                    <ul className={`dropdown-menu user-dropdown ${userDropdownOpen ? 'show' : ''}`}>
                      <li>
                        <NavLink to="/profile" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                          👤 My Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/cart" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                          🛒 My Cart
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/myorders" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                           My Orders
                        </NavLink>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }} className="dropdown-item logout-item">
                          🚪 Logout
                        </button>
                      </li>
                    </ul>
                  </>
                )}
              </li>

              {/* Cart Icon */}
              <li className="nav-item cart-nav-item">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCartOpen(true);
                    setMobileMenuOpen(false);
                  }} 
                  className="cart-icon-btn"
                >
                  <CartIcon itemCount={totalItems} />
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </button>
              </li>

              <CartSidebar 
                isOpen={cartOpen} 
                onClose={() => setCartOpen(false)} 
              />
            </ul>
          </div>
        </div>
      </nav>
    </>
  
  );
};

export default Navbar;