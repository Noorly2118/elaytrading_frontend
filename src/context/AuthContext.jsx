// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");

    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);

        if (parsed?.token && parsed?.email) {
          setUser(parsed);
          setToken(parsed.token);
        } else {
          localStorage.removeItem("userInfo");
          toast.error("Invalid session data. Please login again.");
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
        localStorage.removeItem("userInfo");
        toast.error("Session data corrupted. Please login again.");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Validate inputs before making API call
    if (!email || !password) {
      toast.error("Please provide both email and password");
      return { success: false, error: "Email and password are required" };
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      // Validate response data
      if (!data.token || !data.user) {
        toast.error("Invalid response from server");
        return { success: false, error: "Invalid response from server" };
      }

      const userInfo = {
        ...data.user,
        token: data.token,
      };

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("token", data.token);
      
      // Update state
      setUser(userInfo);
      setToken(data.token);
      setAuthError(null);

      toast.success(`Welcome back, ${data.user.name || 'User'}!`);
      return { success: true, user: userInfo };

    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error scenarios
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
        
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.response.status === 404) {
          errorMessage = "User not found. Please check your email.";
        } else if (error.response.status === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message || "An unexpected error occurred";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      
      // Reset state
      setUser(null);
      setToken(null);
      setAuthError(null);
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout. Please try again.");
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    authError,
    clearError,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};