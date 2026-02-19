import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {

    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/login", { state: { fromCart: true } });
        }
    }, [navigate]);

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
            <div className="container py-5">

                <h2 className="fw-bold mb-4">🛒 Your Cart</h2>

                {cart.length === 0 ? (
                    <div className="text-center mt-5">
                        <h5>Your cart is empty</h5>
                        <button
                            className="btn btn-dark mt-3"
                            onClick={() => navigate("/shop")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="row">

                        {/* LEFT SIDE - ITEMS */}
                        <div className="col-md-8">

                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="card mb-4 border-0 shadow-sm"
                                    style={{
                                        borderRadius: "16px"
                                    }}
                                >
                                    <div className="card-body d-flex justify-content-between align-items-center">

                                        <div className="d-flex align-items-center gap-4">

                                            <img
                                                src={`http://172.16.60.17:5000/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                style={{
                                                    width: "90px",
                                                    height: "90px",
                                                    objectFit: "contain",
                                                    borderRadius: "10px",
                                                    background: "#fff"
                                                }}
                                            />

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    {item.name}
                                                </h6>
                                                <p className="mb-1 text-muted">
                                                    ₹{item.price}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="d-flex align-items-center gap-2 mt-2">

                                                    <button
                                                        className="btn btn-outline-dark btn-sm"
                                                        onClick={() => updateQuantity(item._id, "dec")}
                                                    >
                                                        −
                                                    </button>

                                                    <span className="fw-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        className="btn btn-outline-dark btn-sm"
                                                        onClick={() => updateQuantity(item._id, "inc")}
                                                    >
                                                        +
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <h6 className="fw-bold">
                                                ₹{item.price * item.quantity}
                                            </h6>

                                            <button
                                                className="btn btn-sm btn-outline-danger mt-2"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* RIGHT SIDE - SUMMARY */}
                        <div className="col-md-4">

                            <div
                                className="card shadow-sm border-0"
                                style={{
                                    borderRadius: "16px",
                                    position: "sticky",
                                    top: "100px"
                                }}
                            >
                                <div className="card-body">

                                    <h5 className="fw-bold mb-4">
                                        Order Summary
                                    </h5>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Shipping</span>
                                        <span className="text-success">Free</span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between fw-bold mb-3">
                                        <span>Total</span>
                                        <span>₹{totalPrice}</span>
                                    </div>

                                    <button
                                        className="btn w-100 text-white"
                                        style={{
                                            background: "linear-gradient(135deg, #000, #434343)",
                                            borderRadius: "30px",
                                            padding: "10px"
                                        }}
                                        onClick={() => navigate("/checkout")}
                                    >
                                        Proceed to Checkout
                                    </button>

                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default Cart;
