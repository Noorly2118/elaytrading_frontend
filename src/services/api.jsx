import axios from "axios";

// -------------------------
// Axios Instance
// -------------------------
const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   
});

api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("Axios Base URL:", api.defaults.baseURL);
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

// -------------------------
// Request Interceptor (Attach Token)
// -------------------------
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------
// Response Interceptor (Global Error Handling)
// -------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ======================================================
// AUTH API
// ======================================================
export const registerUser = (userData) =>
  api.post("/auth/register", userData).then((res) => res.data);

export const loginUser = (credentials) =>
  api.post("/auth/login", credentials).then((res) => res.data);

export const verifyEmail = (data) =>
  api.post("/auth/verify-email", data).then((res) => res.data);

export const resendVerificationCode = (email) =>
  api.post("/auth/resend-verification", { email }).then((res) => res.data);

export const checkAuthStatus = () =>
  api.get("/auth-status").then((res) => res.data);

// ======================================================
// CART API
// ======================================================
export const getCart = () =>
  api.get("/cart").then((res) => res.data);

export const addToCart = (productId, quantity = 1) =>
  api.post("/cart/add", { productId, quantity }).then((res) => res.data);

export const updateCartItem = (productId, quantity) =>
  api.put("/cart/update", { productId, quantity }).then((res) => res.data);

export const removeFromCart = (productId) =>
  api.delete(`/cart/remove/${productId}`).then((res) => res.data);

export const clearCart = () =>
  api.delete("/cart/clear").then((res) => res.data);

// ======================================================
// PRODUCT API
// ======================================================
export const getProducts = () =>
  api.get("/products").then((res) => res.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);

export const addProduct = (product) =>
  api.post("/products", product).then((res) => res.data);

export const updateProduct = (id, product) =>
  api.put(`/products/${id}`, product).then((res) => res.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((res) => res.data);

// -------------------------
// Export Axios Instance
// -------------------------
export default api;