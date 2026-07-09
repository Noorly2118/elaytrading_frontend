import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; 
import { Toaster } from "react-hot-toast";


import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductsDetails from "./pages/ProductDetail";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";

import Cart from "./pages/CartPage";
import CategoryPage from "./pages/Category";
import Contact from "./pages/Contact";

import Products from "./admin/Products";
import AdminLayout from "./admin/AdminLayout";
import Orders from "./admin/Orders";
import Categories from "./admin/Categories";
import AdminDashboard from "./admin/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";


import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrdersPage from "./pages/Myorder";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PublicLayout from "./pages/PublicLayout";
import OrderDetail from "./admin/OrderDetail";
import AdminOrderDetail from "./admin/OrderDetail";
import Payments from "./admin/Payments";
import AdminUsers from "./admin/AdminUsers";
import ScrollToTop from "./components/ScrollToTop";
import AdminMessages from "./admin/AdminMessages";


function App() {
  

  return (
    
    
  <BrowserRouter>
        <Toaster position="top-right" />
        <ScrollToTop/>

  <Routes>

    {/* Public Site */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductsDetails />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:id" element={<OrderSuccess />} />
      <Route path="/myorders" element={<OrdersPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Route>

    {/* Admin Login */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Admin Area */}
    <Route
      path="/admin"
      element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:id" element={<AdminOrderDetail />} />
      <Route path="payments" element={<Payments />} />
      <Route path="users" element={<AdminUsers/>}/>
      <Route path="messages" element={< AdminMessages/>}/>

    </Route>

  </Routes>
</BrowserRouter>
  );
}

export default App;