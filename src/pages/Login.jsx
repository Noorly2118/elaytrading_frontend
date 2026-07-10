import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // ✅ Redirect in useEffect
  useEffect(() => {
    if (!loading && user) {
      toast.success(`Welcome back!`);
      navigate("/shop", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading error if auth is loading for too long
  useEffect(() => {
    if (loading) {
      // Optional: Show loading toast
      toast.loading('Loading...', { id: 'auth-loading' });
    } else {
      toast.dismiss('auth-loading');
    }
  }, [loading]);

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // INPUT HANDLER
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before continuing");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(form.email, form.password);

      if (result.success) {
        // Toast will be shown in useEffect after user is set
        toast.success("Login successful! Redirecting...");
      } else {
        // Error is already shown in AuthContext, but we'll also set it here
        setErrors({ submit: result.error || "Login failed" });
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
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
      padding: "16px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
      marginTop: "60px",
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
      flexDirection: "column"
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
    signupLink: {
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
    },
    beakerIcon: {
      fontSize: "48px",
      marginBottom: "8px",
      color: "#1e3c72"
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
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
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
                  placeholder="your.email@company.com"
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
                  placeholder="Enter your password"
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

            {/* Forgot password link */}
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Link
                to="/forgot-password"
                style={{...styles.link, fontSize: '13px'}}
                onMouseOver={(e) => e.target.style.color = "#2a5298"}
                onMouseOut={(e) => e.target.style.color = "#1e3c72"}
              >
                Forgot password?
              </Link>
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
                  Verifying credentials...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            <p style={styles.signupLink}>
              New to Elay Trading?{" "}
              <Link
                to="/signup"
                style={styles.link}
                onMouseOver={(e) => e.target.style.color = "#2a5298"}
                onMouseOut={(e) => e.target.style.color = "#1e3c72"}
              >
                Create an account
              </Link>
            </p>
            
            <p style={styles.terms}>
              By logging in, you agree to our{" "}
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