import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function EmailVerification() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from registration
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/verify-email", { email, otp });
      
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Email verified successfully! Please login." }
        });
      }, 1500);
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || "Invalid verification code" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await api.post("/resend-verification", { email });
      setTimeLeft(600);
      setCanResend(false);
      setErrors({});
    } catch (error) {
      setErrors({ 
        resend: error.response?.data?.message || "Failed to resend code" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>🧪 Elay Trading</h1>
            <p style={styles.subtitle}>Verify Your Email</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <p style={styles.instruction}>
            We've sent a verification code to <strong>{email}</strong>
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Code</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={styles.input}
                placeholder="Enter 6-digit code"
                disabled={isLoading}
              />
            </div>
          </div>

          {!canResend && (
            <p style={styles.timer}>
              Code expires in: {formatTime(timeLeft)}
            </p>
          )}

          {errors.submit && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            style={{
              ...styles.submitButton,
              ...(isLoading || otp.length !== 6 ? styles.submitButtonDisabled : {})
            }}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              style={styles.resendButton}
            >
              Resend Code
            </button>
          ) : (
            <p style={styles.resendText}>
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                style={styles.resendLink}
              >
                Resend
              </button>
            </p>
          )}

          {errors.resend && (
            <p style={styles.errorText}>{errors.resend}</p>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  // Add your styles here (similar to signup/login)
};
