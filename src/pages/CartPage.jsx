import { useCart } from "../../src/context/cartcontext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice,
    loading,
    error,
    refreshCart
  } = useCart();
  
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [localError, setLocalError] = useState(null);

  // Show toast for errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      // Don't clear error here to let context manage it
    }
  }, [error]);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) return;
    
    setUpdatingId(productId);
    const success = await updateQuantity(productId, newQuantity);
    setUpdatingId(null);
    
    if (!success) {
      toast.error('Failed to update quantity');
    } else {
      toast.success('Quantity updated');
    }
  };

  const handleRemoveClick = (productId) => {
    setRemoveTarget(productId);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    if (removeTarget) {
      setUpdatingId(removeTarget);
      await removeFromCart(removeTarget);
      setUpdatingId(null);
      toast.success('Item removed from cart');
    }
    setShowModal(false);
    setRemoveTarget(null);
  };

  const cancelRemove = () => {
    setShowModal(false);
    setRemoveTarget(null);
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowModal(false);
    toast.success('Cart cleared successfully');
  };

  const handleRefreshCart = () => {
    refreshCart();
    toast.success('Cart refreshed');
  };

  // Handle inline validation for stock
  const getStockMessage = (item) => {
    if (item.stock && item.stock < 10) {
      return `⚠️ Only ${item.stock} left in stock!`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    
      {/* Confirmation Modal */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">
                {removeTarget ? 'Remove Item' : 'Clear Cart'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={cancelRemove}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                {removeTarget 
                  ? 'Are you sure you want to remove this item from your cart?'
                  : 'This will remove all items from your cart. This action cannot be undone.'
                }
              </p>
              {!removeTarget && (
                <p className="text-danger fw-bold mb-0">⚠️ This action cannot be undone</p>
              )}
            </div>
            <div className="modal-footer border-0">
              <button 
                className="btn btn-light" 
                onClick={cancelRemove}
              >
                Cancel
              </button>
              <button 
                className={`btn ${removeTarget ? 'btn-danger' : 'btn-danger'}`}
                onClick={removeTarget ? confirmRemove : handleClearCart}
              >
                {removeTarget ? 'Remove Item' : 'Clear Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">🛒 Your Cart</h2>
          <span className="badge bg-primary fs-6">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 mb-4">🛒</div>
            <h4 className="mb-3">Your cart is empty</h4>
            <p className="text-muted mb-4">Looks like you haven't added any items yet.</p>
            <Link to="/shop" className="btn btn-primary btn-lg px-5">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* LEFT: ITEMS */}
            <div className="col-lg-8">
              {cart.map((item) => {
                const stockMessage = getStockMessage(item);
                const isUpdating = updatingId === item._id;
                const isOutOfStock = item.stock && item.stock <= 0;

                return (
                  <div key={item._id} className="cart-card d-flex gap-3 mb-3 p-3">
                    <img 
                      src={item.image || "https://via.placeholder.com/90"} 
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/90';
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">{item.name}</h5>
                          <p className="text-muted mb-2">
                            ${item.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleRemoveClick(item._id)}
                          disabled={isUpdating}
                          aria-label="Remove item"
                        >
                          <span className="fs-5">✕</span>
                        </button>
                      </div>
                      
                      {stockMessage && (
                        <div className="stock-warning mb-2">
                          ⚠️ {stockMessage}
                        </div>
                      )}

                      {isOutOfStock && (
                        <div className="stock-error mb-2">
                          ⛔ Out of stock
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2 mt-2">
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                          disabled={isUpdating || item.quantity <= 1 || isOutOfStock}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="qty-display">{item.quantity}</span>

                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                          disabled={isUpdating || (item.stock && item.quantity >= item.stock) || isOutOfStock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>

                        {isUpdating && (
                          <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
                            <span className="visually-hidden">Updating...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="col-lg-4">
              <div className="summary-card">
                <h4 className="mb-4">Order Summary</h4>

                <div className="summary-row">
                  <span>Items ({totalItems})</span>
                  <span>${totalPrice?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="text-muted">Calculated at checkout</span>
                </div>

                <hr className="my-3" />

                <div className="summary-row total-row">
                  <strong>Total</strong>
                  <strong>${totalPrice?.toFixed(2) || '0.00'}</strong>
                </div>

                <Link to="/checkout" className="btn btn-primary w-100 mt-3">
                  Proceed to Checkout
                </Link>
                
                <Link to="/shop" className="btn btn-outline-primary w-100 mt-2">
                  ← Continue Shopping
                </Link>

                {cart.length > 0 && (
                  <button 
                    className="btn btn-outline-danger w-100 mt-2"
                    onClick={() => setShowModal(true)}
                  >
                    🗑️ Clear Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .cart-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
          }
          
          .cart-card:hover {
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-color: #e0e0e0;
          }

          .cart-item-image {
            width: 90px;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
            flex-shrink: 0;
          }

          .stock-warning {
            color: #f59e0b;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .stock-error {
            color: #ef4444;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .qty-btn {
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            padding: 6px 16px;
            cursor: pointer;
            border-radius: 6px;
            font-weight: 600;
            transition: all 0.2s;
            color: #374151;
            font-size: 1rem;
            line-height: 1.5;
            min-width: 40px;
          }
          
          .qty-btn:hover:not(:disabled) {
            background: #1da8f0;
            border-color: #1da8f0;
            color: white;
          }
          
          .qty-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            background: #f3f4f6;
          }

          .qty-display {
            min-width: 40px;
            text-align: center;
            font-weight: 600;
            font-size: 1.1rem;
            color: #1f2937;
          }

          .summary-card {
            background: #fafafa;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #f0f0f0;
            position: sticky;
            top: 20px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            color: #6b7280;
          }

          .total-row {
            color: #1f2937;
            font-size: 1.1rem;
            padding-top: 8px;
          }

          .btn-outline-danger {
            border-color: #ef4444;
            color: #ef4444;
          }

          .btn-outline-danger:hover {
            background: #ef4444;
            color: white;
          }

          /* Modal overrides */
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

          /* Toast overrides */
          :global(.go3958317564) {
            font-family: inherit;
          }
        `}</style>
      </div>
    </>
  );
};

export default CartPage;