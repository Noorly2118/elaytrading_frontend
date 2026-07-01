import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";
import { Lock, Mail, LogIn, Shield, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await adminApi.post(
        "/admin/login",
        { email, password }
      );

      localStorage.setItem("adminInfo", JSON.stringify(data));
      console.log("ADMIN LOGIN SUCCESS");
console.log(data);

localStorage.setItem("adminInfo", JSON.stringify(data));

console.log("Stored:", localStorage.getItem("adminInfo"));

navigate("/admin");
      navigate("/admin");
    } catch (error) {
      alert("Invalid credentials");
      setIsLoading(false);
      
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #01446F 0%, #012a44 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* Login Container */
        .login-container {
          width: 100%;
          max-width: 420px;
          animation: fadeIn 0.5s ease;
          margin: 70px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Login Card */
        .login-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .shield-icon {
          width: 60px;
          height: 60px;
          background: #01446F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .login-header h2 {
          font-size: 26px;
          color: #1f2937;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .login-header p {
          color: #6b7280;
          font-size: 14px;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Input Groups */
        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .input-group input {
          width: 100%;
          padding: 12px 42px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s;
          background: white;
          font-family: inherit;
        }

        .input-group input:focus {
          outline: none;
          border-color: #01446F;
          box-shadow: 0 0 0 3px rgba(1, 68, 111, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #9ca3af;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #01446F;
        }

        /* Login Button */
        .login-btn {
          background: #01446F;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
          margin-top: 10px;
          font-family: inherit;
        }

        .login-btn:hover:not(:disabled) {
          background: #012a44;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(1, 68, 111, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Loading Spinner */
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

        /* Footer */
        .login-footer {
          text-align: center;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .login-footer a {
          color: #01446F;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.3s;
        }

        .login-footer a:hover {
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-card {
            padding: 30px 25px;
          }

          .login-header h2 {
            font-size: 24px;
          }

          .shield-icon {
            width: 55px;
            height: 55px;
          }
        }
      `}</style>

      <div className="admin-login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="shield-icon">
                <Shield size={30} color="white" />
              </div>
              <h2>Admin Login</h2>
              <p>Enter your credentials to access dashboard</p>
            </div>

            <form onSubmit={submitHandler} className="login-form">
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <a href="/">← Back to Homepage</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;