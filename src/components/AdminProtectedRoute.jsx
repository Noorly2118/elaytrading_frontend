import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const adminInfo = localStorage.getItem("adminInfo");

  

  if (!adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}