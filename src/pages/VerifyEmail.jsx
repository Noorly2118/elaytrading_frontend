import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../services/api";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from registration page
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to signup
      navigate("/signup");
    }
  }, [location, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setCode(newCode);
      
      // Focus last input
      const lastInput = document.getElementById(`code-${Math.min(pastedCode.length, 5)}`);
      if (lastInput) lastInput.focus();
    } else {
      // Handle single digit
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setErrors({ submit: "Please enter all 6 digits" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await verifyEmail({
        email,
        code: verificationCode
      });

      // Show success and redirect to login
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "✅ Email verified successfully! You can now login." 
          }
        });
      }, 1500);

    } catch (error) {
      if (error.response?.data?.expired) {
        setErrors({ 
          submit: "Code expired. Please request a new one.",
          expired: true 
        });
      } else {
        setErrors({ 
          submit: error.response?.data?.message || "Invalid verification code" 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setErrors({});

    try {
      await resendVerificationCode(email);
      setTimeLeft(600);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      
      // Focus first input
      const firstInput = document.getElementById("code-0");
      if (firstInput) firstInput.focus();
      
    } catch (error) {
      setErrors({ 
        resend: error.response?.data?.message || "Failed to resend code" 
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Styles (same as your signup/login)
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      padding: "32px 16px",
      fontFamily: "'Inter', sans-serif",
      marginTop: "50px",
    },
    container: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
      width: "100%",
      maxWidth: "480px",
      border: "1px solid rgba(255, 255, 255, 0.5)",
    },
    header: {
      padding: "32px 32px 16px 32px",
      textAlign: "center",
    },
    title: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#1e3c72",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: "#4b5563",
    },
    form: {
      padding: "16px 32px 32px 32px",
    },
    instruction: {
      background: "#f3f4f6",
      padding: "16px",
      borderRadius: "12px",
      marginBottom: "24px",
      color: "#1f2937",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    codeContainer: {
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      marginBottom: "24px",
    },
    codeInput: {
      width: "56px",
      height: "64px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "28px",
      fontWeight: "600",
      textAlign: "center",
      color: "#1e3c72",
      outline: "none",
      transition: "all 0.2s",
    },
    codeInputFocus: {
      borderColor: "#1e3c72",
      boxShadow: "0 0 0 3px rgba(30, 60, 114, 0.1)",
    },
    timer: {
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "16px",
    },
    timerWarning: {
      color: "#dc2626",
      fontWeight: "600",
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
      marginBottom: "16px",
    },
    submitButtonDisabled: {
      opacity: "0.6",
      cursor: "not-allowed",
    },
    resendButton: {
      width: "100%",
      background: "transparent",
      color: "#1e3c72",
      fontWeight: "600",
      padding: "12px",
      borderRadius: "14px",
      border: "2px solid #1e3c72",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    resendButtonDisabled: {
      opacity: "0.6",
      cursor: "not-allowed",
      borderColor: "#9ca3af",
      color: "#9ca3af",
    },
    errorBox: {
      background: "#fee2e2",
      border: "1px solid #fecaca",
      borderRadius: "12px",
      padding: "12px",
      marginBottom: "16px",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "14px",
      textAlign: "center",
    },
    successBox: {
      background: "#dcfce7",
      border: "1px solid #86efac",
      borderRadius: "12px",
      padding: "12px",
      marginBottom: "16px",
      color: "#166534",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🧪 Elay Trading</h1>
          <p style={styles.subtitle}>Verify Your Email</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.instruction}>
            <strong style={{ display: "block", marginBottom: "8px", color: "#1e3c72" }}>
              📧 Verification Code Sent
            </strong>
            We've sent a 6-digit verification code to<br />
            <strong style={{ color: "#1e3c72" }}>{email}</strong>
          </div>

          <div style={styles.codeContainer}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  ...styles.codeInput,
                  ...(document.activeElement?.id === `code-${index}` 
                    ? styles.codeInputFocus 
                    : {})
                }}
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div style={styles.timer}>
            {!canResend ? (
              <>
                Code expires in{" "}
                <span style={timeLeft < 60 ? styles.timerWarning : {}}>
                  {formatTime(timeLeft)}
                </span>
              </>
            ) : (
              <span style={{ color: "#dc2626" }}>Code expired</span>
            )}
          </div>

          {errors.submit && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{errors.submit}</p>
              {errors.expired && (
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    ...styles.resendButton,
                    marginTop: "12px",
                    background: "#1e3c72",
                    color: "white",
                    border: "none",
                  }}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Sending..." : "Request New Code"}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || code.join("").length !== 6}
            style={{
              ...styles.submitButton,
              ...(isLoading || code.join("").length !== 6 
                ? styles.submitButtonDisabled 
                : {})
            }}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || (!canResend && timeLeft > 0)}
            style={{
              ...styles.resendButton,
              ...(resendLoading || (!canResend && timeLeft > 0)
                ? styles.resendButtonDisabled
                : {})
            }}
          >
            {resendLoading ? "Sending..." : "Resend Verification Code"}
          </button>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#6b7280" }}>
            Wrong email?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              style={{
                background: "none",
                border: "none",
                color: "#1e3c72",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register again
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}