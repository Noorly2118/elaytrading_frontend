import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Format cart data from backend to frontend structure
  const formatCart = useCallback((items = []) => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.map((item) => ({
      _id: item.productId?._id,
      name: item.productId?.name ,
      price: item.productId?.price ,
      image: item.productId?.image,
      quantity: item.quantity ,
      stock: item.productId?.stock ,
    }));
  }, []);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/cart");
      
      if (response.data && response.data.data && response.data.data.items) {
        const formattedCart = formatCart(response.data.data.items);
        setCart(formattedCart);
      } else if (response.data && response.data.items) {
        const formattedCart = formatCart(response.data.items);
        setCart(formattedCart);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch cart");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user, formatCart]);

  // Load cart when user changes or on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      setError("Please login to add items to cart");
      return { success: false, message: "Please login to add items to cart" };
    }

    if (product.stock <= 0) {
      const errorMsg = `Sorry, "${product.name}" is out of stock!`;
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      setError(null);
      const response = await api.post("/cart/add", {
        productId: product._id,
        quantity: quantity,
      });
      
      let cartData;
      if (response.data && response.data.data) {
        cartData = response.data.data;
      } else if (response.data) {
        cartData = response.data;
      }
      
      if (cartData && cartData.items) {
        const formattedCart = formatCart(cartData.items);
        setCart(formattedCart);
        return { success: true, message: "Item added to cart!" };
      }
      return { success: false, message: "Failed to add item to cart" };
    } catch (err) {
      console.error("Add to cart error:", err);
      let errorMessage = "Failed to add item to cart";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // FIXED: Update quantity - now properly handles increment/decrement
  const updateQuantity = async (productId, newQuantity) => {
    if (!user) {
      setError("Please login");
      return false;
    }

    // Validate quantity
    if (newQuantity < 1) {
      return false;
    }

    try {
      setError(null);
      
      // Find current item to check stock
      const currentItem = cart.find((item) => item._id === productId);
      if (currentItem && newQuantity > currentItem.stock) {
        setError(`Only ${currentItem.stock} items available in stock`);
        return false;
      }

      // Send update to backend with the NEW quantity
      const response = await api.put("/cart/update", {
        productId: productId,
        quantity: newQuantity, // Send the actual quantity, not an increment
      });
      
      let cartData;
      if (response.data && response.data.data) {
        cartData = response.data.data;
      } else if (response.data) {
        cartData = response.data;
      }
      
      if (cartData && cartData.items) {
        const formattedCart = formatCart(cartData.items);
        setCart(formattedCart);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update quantity error:", err);
      const errorMessage = err.response?.data?.message || "Failed to update quantity";
      setError(errorMessage);
      return false;
    }
  };

  // FIXED: Remove from cart
  const removeFromCart = async (productId) => {
    if (!user) {
      setError("Please login");
      return false;
    }

    try {
      setError(null);
      const response = await api.delete(`/cart/remove/${productId}`);
      
      let cartData;
      if (response.data && response.data.data) {
        cartData = response.data.data;
      } else if (response.data) {
        cartData = response.data;
      }
      
      if (cartData && cartData.items) {
        const formattedCart = formatCart(cartData.items);
        setCart(formattedCart);
        return true;
      }
      
      // If no cart data returned, refetch
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Remove from cart error:", err);
      const errorMessage = err.response?.data?.message || "Failed to remove item";
      setError(errorMessage);
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return false;

    try {
      setError(null);
      await api.delete("/cart/clear");
      setCart([]);
      return true;
    } catch (err) {
      console.error("Clear cart error:", err);
      const errorMessage = err.response?.data?.message || "Failed to clear cart";
      setError(errorMessage);
      return false;
    }
  };

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const value = {
    cart,
    loading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};