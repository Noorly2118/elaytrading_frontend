import axios from "axios";

const adminApi = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
});

// Attach token
adminApi.interceptors.request.use((config) => {
  const raw = localStorage.getItem("adminInfo");


  let token = null;

  if (raw) {
    try {
      const adminInfo = JSON.parse(raw);
      token = adminInfo?.token;
    } catch (e) {
      console.log("Failed to parse adminInfo");
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// Auto logout on 401
adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminInfo");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default adminApi;