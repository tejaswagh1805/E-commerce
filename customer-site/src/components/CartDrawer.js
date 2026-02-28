import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = ({ show, onClose }) => {

    const { cart, removeFromCart } = useContext(CartContext);

    return (
        <>
            {/* Overlay */}
            {show && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 999
                    }}
                />
            )}

            {/* Drawer */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: show ? "0" : "-400px",
                    width: "350px",
                    height: "100%",
                    background: "#fff",
                    boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    transition: "0.3s",
                    padding: "20px",
                    overflowY: "auto"
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Your Cart</h5>
                    <button className="btn btn-sm btn-danger" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    cart.map((item, index) => (
                        <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="mb-3 border-bottom pb-2">
                            <div className="fw-semibold">{item.name}</div>
                            {item.selectedSize && (
                                <div style={{ fontSize: "13px", color: "#666" }}>Size: {item.selectedSize}</div>
                            )}
                            {item.selectedColor && (
                                <div style={{ fontSize: "13px", color: "#666" }}>Color: {item.selectedColor}</div>
                            )}
                            <div>₹{item.price}</div>
                            <div>Qty: {item.quantity}</div>
                            <button
                                className="btn btn-sm btn-outline-danger mt-1"
                                onClick={() => removeFromCart(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}

                {cart.length > 0 && (
                    <Link
                        to="/cart"
                        className="btn btn-dark w-100 mt-3"
                        onClick={onClose}
                    >
                        Go to Cart Page
                    </Link>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
