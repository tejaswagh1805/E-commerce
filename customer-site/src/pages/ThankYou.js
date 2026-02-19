import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ThankYou = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state;

    useEffect(() => {
        if (!order) {
            navigate("/");
        }
    }, []);

    return (
        <div style={{ background: "#ffffff", minHeight: "100vh" }}>
            <div className="container py-5">

                <div className="row justify-content-center">
                    <div className="col-lg-7">

                        <div
                            className="text-center p-5 rounded-4"
                            style={{
                                background: "#fff",
                                boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                            }}
                        >

                            {/* SUCCESS ICON */}
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    margin: "0 auto 20px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg,#4ade80,#22c55e)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "40px",
                                    color: "#fff",
                                    animation: "pop 0.5s ease"
                                }}
                            >
                                ✓
                            </div>

                            <h2 className="fw-bold mb-3">
                                Order Placed Successfully!
                            </h2>

                            <p className="text-muted mb-4">
                                Thank you for your purchase. Your order has been
                                confirmed and will be processed shortly.
                            </p>

                            {/* ORDER INFO CARD */}
                            <div
                                className="p-4 rounded-3 mb-4"
                                style={{
                                    background: "#f8f9fa",
                                    border: "1px solid #eee"
                                }}
                            >
                                <div className="fw-semibold mb-2">
                                    Order ID
                                </div>

                                <div
                                    style={{
                                        fontSize: "1.3rem",
                                        fontWeight: "700",
                                        color: "#4f46e5"
                                    }}
                                >
                                    {order?.orderId || order?._id}
                                </div>

                                <div className="mt-3 text-muted">
                                    Total Amount: ₹{order?.totalAmount}
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="d-flex justify-content-center gap-3">

                                <button
                                    className="btn btn-outline-primary px-4 rounded-pill"
                                    onClick={() => navigate("/orders")}
                                >
                                    Track Order
                                </button>

                                <button
                                    className="btn btn-primary px-4 rounded-pill"
                                    onClick={() => navigate("/shop")}
                                >
                                    Continue Shopping
                                </button>

                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* Animation Style */}
            <style>
                {`
                @keyframes pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                `}
            </style>

        </div>
    );
};

export default ThankYou;
