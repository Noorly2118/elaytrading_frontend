import { Link } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const CartSidebar = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    totalPrice: contextTotalPrice,
    totalItems,
    loading,
    error,
    refreshCart 
  } = useCart();
  
  const [updatingId, setUpdatingId] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Use context total price or calculate fallback
  const totalPrice = contextTotalPrice || cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    // Don't allow quantity less than 1
    if (newQuantity < 1) return;
    
    // Check stock limit before updating
    const item = cart.find(i => i._id === productId);
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    
    setUpdatingId(productId);
    const success = await updateQuantity(productId, newQuantity);
    setUpdatingId(null);
    
    if (!success) {
      toast.error("Failed to update quantity");
    } else {
      toast.success("Quantity updated");
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowConfirm(false);
    toast.success("Cart cleared successfully");
  };

  const handleRemoveClick = (productId) => {
    setRemoveTarget(productId);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (removeTarget) {
      setUpdatingId(removeTarget);
      await removeFromCart(removeTarget);
      setUpdatingId(null);
      toast.success("Item removed from cart");
    }
    setShowRemoveModal(false);
    setRemoveTarget(null);
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setRemoveTarget(null);
  };

  // Show error from context
  if (error && !localError) {
    toast.error(error);
  }
 
  return (
    <>
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      {/* Remove Item Confirmation Modal */}
      <div className={`modal fade ${showRemoveModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showRemoveModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Remove Item</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={cancelRemove}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove this item from your cart?</p>
              <p className="text-danger fw-bold mb-0">⚠️ This action cannot be undone</p>
            </div>
            <div className="modal-footer border-0">
              <button 
                className="btn btn-light" 
                onClick={cancelRemove}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmRemove}
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      </div>
      {showRemoveModal && <div className="modal-backdrop fade show"></div>}

      {/* Clear Cart Confirmation Modal */}
      <div className={`modal fade ${showConfirm ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showConfirm ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Clear Cart</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowConfirm(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>This will remove all items from your cart.</p>
              <p className="text-danger fw-bold mb-0">⚠️ This action cannot be undone</p>
            </div>
            <div className="modal-footer border-0">
              <button 
                className="btn btn-light" 
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleClearCart}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirm && <div className="modal-backdrop fade show"></div>}

      {/* OVERLAY */}
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      {/* SIDEBAR */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        
        {/* HEADER */}
        <div className="cart-header">
          <h5>Your Cart ({totalItems} items)</h5>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* ERROR DISPLAY - Now shows inline for better UX */}
        {(error || localError) && (
          <div className="error-message">
            {error || localError}
            <button 
              className="error-close" 
              onClick={() => {
                setLocalError(null);
                if (refreshCart) refreshCart();
              }}
            >
              ✖
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className="cart-content">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading cart...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty 🛒</p>
              <Link to="/shop" onClick={onClose} className="shop-now-btn">
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img 
                    src={item.image || "https://via.placeholder.com/70"} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/70';
                    }}
                  />

                  <div className="cart-details">
                    <h6>{item.name}</h6>
                    <p className="item-price">${(item.price || 0).toFixed(2)}</p>
                    
                    {item.stock && item.stock < 10 && (
                      <small className="stock-warning">
                        ⚠️ Only {item.stock} left!
                      </small>
                    )}

                    <div className="cart-actions">
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                        disabled={updatingId === item._id || item.quantity <= 1}
                      >
                        {updatingId === item._id ? '...' : '-'}
                      </button>
                      <span className="qty">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                        disabled={updatingId === item._id || (item.stock && item.quantity >= item.stock)}
                      >
                        {updatingId === item._id ? '...' : '+'}
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveClick(item._id)}
                      disabled={updatingId === item._id}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* FOOTER - Only show if cart has items */}
        {!loading && cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-section">
              <span>Subtotal ({totalItems} items):</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            
            <small className="shipping-note">
              * Shipping calculated at checkout
            </small>

            <Link 
              to="/cart" 
              onClick={onClose} 
              className="view-cart-btn"
            >
              View Full Cart
            </Link>

            <Link 
              to="/checkout" 
              onClick={onClose} 
              className="checkout-btn"
            >
              Proceed to Checkout
            </Link>

            <button 
              className="clear-cart-btn" 
              onClick={() => setShowConfirm(true)}
            >
              🗑️ Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* CSS */}
      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
        }

        .cart-sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 380px;
          height: 100%;
          background: #fff;
          box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
          transition: 0.3s ease-in-out;
          z-index: 999;
          display: flex;
          flex-direction: column;
        }

        .cart-sidebar.open {
          right: 0;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px;
          border-bottom: 1px solid #eee;
          background: #fff;
        }

        .cart-header h5 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          color: #666;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #ff4444;
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: 10px 15px;
          margin: 10px;
          border-radius: 8px;
          font-size: 13px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-close {
          background: none;
          border: none;
          color: #c00;
          cursor: pointer;
          font-size: 14px;
        }

        .cart-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #1da8f0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-cart {
          text-align: center;
          padding: 50px 20px;
          color: #888;
        }

        .empty-cart p {
          margin-bottom: 20px;
          font-size: 16px;
        }

        .shop-now-btn {
          display: inline-block;
          background: #1da8f0;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .shop-now-btn:hover {
          background: #0e8bd9;
          color: white;
        }

        .cart-item {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item img {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-details {
          flex: 1;
        }

        .cart-details h6 {
          margin: 0 0 5px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .item-price {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #1da8f0;
          font-weight: 600;
        }

        .stock-warning {
          display: block;
          color: #ff9800;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .cart-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .qty-btn {
          padding: 4px 12px;
          border: 1px solid #ddd;
          background: #f9f9f9;
          cursor: pointer;
          border-radius: 6px;
          font-weight: bold;
          transition: all 0.2s;
        }

        .qty-btn:hover:not(:disabled) {
          background: #1da8f0;
          border-color: #1da8f0;
          color: white;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qty {
          min-width: 30px;
          text-align: center;
          font-weight: 500;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ff4444;
          font-size: 12px;
          cursor: pointer;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .remove-btn:hover:not(:disabled) {
          color: #cc0000;
          text-decoration: underline;
        }

        .remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-footer {
          padding: 18px;
          border-top: 1px solid #eee;
          background: #fafafa;
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .total-section strong {
          font-size: 20px;
          color: #1da8f0;
        }

        .shipping-note {
          display: block;
          text-align: center;
          color: #888;
          font-size: 11px;
          margin-bottom: 15px;
        }

        .view-cart-btn {
          display: block;
          text-align: center;
          background: #fff;
          color: #1da8f0;
          border: 2px solid #1da8f0;
          padding: 10px;
          border-radius: 8px;
          text-decoration: none;
          margin-bottom: 10px;
          transition: all 0.2s;
        }

        .view-cart-btn:hover {
          background: #1da8f0;
          color: white;
        }

        .checkout-btn {
          display: block;
          text-align: center;
          background: #00446e;
          color: white;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 10px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .checkout-btn:hover {
          background: #003354;
          color: white;
        }

        .clear-cart-btn {
          display: block;
          text-align: center;
          background: transparent;
          color: #ff4444;
          border: 2px solid #ff4444;
          padding: 10px;
          border-radius: 8px;
          text-decoration: none;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 600;
        }

        .clear-cart-btn:hover:not(:disabled) {
          background: #ff4444;
          color: white;
        }

        .clear-cart-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal styles */
        .modal-content {
          border: none;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .modal-header {
          padding: 1.25rem 1.5rem;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
        }

        .btn-close:focus {
          box-shadow: none;
        }

        .btn-light {
          background: #f1f3f5;
          border: none;
          padding: 10px 24px;
          font-weight: 500;
        }

        .btn-light:hover {
          background: #e9ecef;
        }

        .btn-danger {
          padding: 10px 24px;
          font-weight: 500;
        }

        /* Scrollbar styling */
        .cart-content::-webkit-scrollbar {
          width: 6px;
        }

        .cart-content::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .cart-content::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .cart-content::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .cart-sidebar {
            width: 100%;
            right: -100%;
          }
        }
      `}</style>
    </>
  );
};

export default CartSidebar;