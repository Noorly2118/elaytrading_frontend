import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email";
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(form.password)) {
      newErrors.password = "Include 1 uppercase & 1 special character";
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  setErrors({});
  
  try {
    const res = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password
    });
    
    // Redirect to verification page with email
    navigate("/verify-email", { 
      state: { 
        email: form.email,
        message: res.message 
      }
    });
    
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    
    if (errorMessage?.includes("User already exists")) {
      setErrors({ email: "Email already registered" });
    } else if (errorMessage?.includes("Password must")) {
      setErrors({ password: errorMessage });
    } else {
      setErrors({ 
        submit: errorMessage || "Registration failed. Please try again." 
      });
    }
  } finally {
    setIsLoading(false);
  }
};
  // Inline CSS styles
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      padding: "32px 16px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      marginTop:"50px"
    },
    container: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      width: "100%",
      maxWidth: "448px",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      position: "relative"
    },
    header: {
      position: "relative",
      padding: "32px 32px 16px 32px",
      textAlign: "center"
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginTop: "2rem",
      top:"0",
      bottom:"0",

    },
    title: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#1e3c72",
      marginBottom: "8px",
      letterSpacing: "-0.025em"
    },
    subtitle: {
      fontSize: "14px",
      color: "#4b5563",
      fontWeight: "500"
    },
    beakerIcon: {
      fontSize: "48px",
      marginBottom: "8px",
      color: "#1e3c72"
    },
    form: {
      padding: "16px 32px 32px 32px",
      position: "relative",
      zIndex: 1
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "6px"
    },
    inputWrapper: {
      position: "relative"
    },
    inputIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      fontSize: "16px",
      zIndex: 1
    },
    input: {
      width: "100%",
      padding: "14px 14px 14px 44px",
      background: "white",
      border: "1px solid",
      borderRadius: "14px",
      color: "#1f2937",
      fontSize: "15px",
      transition: "all 0.2s ease",
      outline: "none",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    },
    inputError: {
      borderColor: "#ef4444",
      backgroundColor: "#fff5f5"
    },
    inputNormal: {
      borderColor: "#e5e7eb"
    },
    inputFocus: {
      borderColor: "#1e3c72",
      boxShadow: "0 0 0 3px rgba(30, 60, 114, 0.1)",
      backgroundColor: "white"
    },
    errorText: {
      color: "#dc2626",
      fontSize: "12px",
      marginTop: "6px",
      marginLeft: "4px"
    },
    passwordToggle: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      color: "#9ca3af",
      cursor: "pointer",
      fontSize: "16px",
      padding: "0",
      transition: "color 0.2s",
      zIndex: 1
    },
    passwordRequirements: {
      background: "#f9fafb",
      borderRadius: "14px",
      padding: "16px",
      marginBottom: "20px",
      border: "1px solid #e5e7eb"
    },
    requirementsTitle: {
      fontSize: "14px",
      color: "#1f2937",
      marginBottom: "8px",
      fontWeight: "600"
    },
    requirementList: {
      listStyle: "none",
      padding: "0",
      margin: "0"
    },
    requirementItem: {
      fontSize: "12px",
      color: "#6b7280",
      marginBottom: "4px",
      display: "flex",
      alignItems: "center"
    },
    requirementMet: {
      color: "#059669"
    },
    requirementIcon: {
      marginRight: "8px",
      fontSize: "12px"
    },
    errorBox: {
      background: "#fee2e2",
      border: "1px solid #fecaca",
      borderRadius: "14px",
      padding: "14px",
      marginBottom: "24px"
    },
    submitButton: {
      width: "100%",
      background: "linear-gradient(to right, #1e3c72, #2a5298)",
      color: "white",
      fontWeight: "600",
      padding: "14px",
      borderRadius: "14px",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      transform: "scale(1)",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(30, 60, 114, 0.3)"
    },
    submitButtonDisabled: {
      opacity: "0.6",
      cursor: "not-allowed"
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px"
    },
    loginLink: {
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280"
    },
    link: {
      color: "#1e3c72",
      textDecoration: "none",
      fontWeight: "600",
      transition: "color 0.2s"
    },
    terms: {
      textAlign: "center",
      fontSize: "12px",
      color: "#9ca3af",
      marginTop: "24px"
    }
  };

  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header with chemical branding - White background */}
          <div style={styles.header}>
           <div style={styles.headerContent}>
              <h1 style={styles.title}>🧪 Elay Trading</h1>
              <p style={styles.subtitle}>Start Your Trading Journey</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>👤</div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.name ? styles.inputError : styles.inputNormal),
                    ':focus': styles.inputFocus
                  }}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p style={styles.errorText}>{errors.name}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>✉️</div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : styles.inputNormal),
                    ':focus': styles.inputFocus
                  }}
                  placeholder="you@company.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p style={styles.errorText}>{errors.email}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>🔒</div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    paddingRight: "44px",
                    ...(errors.password ? styles.inputError : styles.inputNormal),
                    ':focus': styles.inputFocus
                  }}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseOver={(e) => e.target.style.color = "#1e3c72"}
                  onMouseOut={(e) => e.target.style.color = "#9ca3af"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p style={styles.errorText}>{errors.password}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>✅</div>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.confirmPassword ? styles.inputError : styles.inputNormal),
                    ':focus': styles.inputFocus
                  }}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p style={styles.errorText}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div style={styles.passwordRequirements}>
              <p style={styles.requirementsTitle}>Password must contain:</p>
              <ul style={styles.requirementList}>
                <li style={{
                  ...styles.requirementItem,
                  ...(form.password.length >= 8 ? styles.requirementMet : {})
                }}>
                  <span style={styles.requirementIcon}>
                    {form.password.length >= 8 ? '✓' : '○'}
                  </span>
                  At least 8 characters
                </li>
                <li style={{
                  ...styles.requirementItem,
                  ...(/(?=.*[A-Z])/.test(form.password) ? styles.requirementMet : {})
                }}>
                  <span style={styles.requirementIcon}>
                    {/(?=.*[A-Z])/.test(form.password) ? '✓' : '○'}
                  </span>
                  1 uppercase letter
                </li>
                <li style={{
                  ...styles.requirementItem,
                  ...(/(?=.*[!@#$%^&*])/.test(form.password) ? styles.requirementMet : {})
                }}>
                  <span style={styles.requirementIcon}>
                    {/(?=.*[!@#$%^&*])/.test(form.password) ? '✓' : '○'}
                  </span>
                  1 special character
                </li>
              </ul>
            </div>

            {errors.submit && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonDisabled : {}),
                ':hover': !isLoading ? {
                  background: "linear-gradient(to right, #2a5298, #1e3c72)",
                  transform: "scale(1.02)",
                  boxShadow: "0 6px 16px rgba(30, 60, 114, 0.4)"
                } : {}
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.background = "linear-gradient(to right, #2a5298, #1e3c72)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(30, 60, 114, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "linear-gradient(to right, #1e3c72, #2a5298)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 60, 114, 0.3)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  Creating Account...
                </>
              ) : (
                "🧪 Create Account"
              )}
            </button>

            <p style={styles.loginLink}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={styles.link}
                onMouseOver={(e) => e.target.style.color = "#2a5298"}
                onMouseOut={(e) => e.target.style.color = "#1e3c72"}
              >
                Sign In
              </Link>
            </p>
            
            {/* Terms & Conditions */}
            <p style={styles.terms}>
              By signing up, you agree to our{" "}
              <a href="#" style={{...styles.link, fontSize: "12px"}}
                 onMouseOver={(e) => e.target.style.color = "#2a5298"}
                 onMouseOut={(e) => e.target.style.color = "#1e3c72"}>
                Terms
              </a>{" "}
              and{" "}
              <a href="#" style={{...styles.link, fontSize: "12px"}}
                 onMouseOver={(e) => e.target.style.color = "#2a5298"}
                 onMouseOut={(e) => e.target.style.color = "#1e3c72"}>
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}