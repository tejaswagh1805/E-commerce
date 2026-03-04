import { useState } from "react";

const MockPaymentModal = ({ show, onClose, amount, onSuccess, customerDetails }) => {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [processing, setProcessing] = useState(false);

    if (!show) return null;

    const handlePayment = async () => {
        setProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            const mockPaymentData = {
                payment_order_id: "mock_order_" + Date.now(),
                payment_id: "mock_pay_" + Date.now(),
                signature: "mock_signature_" + Math.random().toString(36).substring(7)
            };
            
            onSuccess(mockPaymentData);
            setProcessing(false);
        }, 2000);
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "0",
                width: "90%",
                maxWidth: "500px",
                padding: "0",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
            }}>
                {/* Header */}
                <div style={{
                    background: "#000",
                    color: "#fff",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                        💳 Mock Payment Gateway
                    </h5>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: "24px",
                            cursor: "pointer"
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "30px" }}>
                    {/* Amount */}
                    <div style={{
                        background: "#f5f5f5",
                        padding: "20px",
                        marginBottom: "20px",
                        border: "1px solid #e0e0e0"
                    }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                            Amount to Pay
                        </div>
                        <div style={{ fontSize: "32px", fontWeight: "700", color: "#000" }}>
                            ₹{amount}
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div style={{ marginBottom: "20px", fontSize: "14px" }}>
                        <div style={{ marginBottom: "8px" }}>
                            <strong>Name:</strong> {customerDetails.name}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                            <strong>Email:</strong> {customerDetails.email}
                        </div>
                        <div>
                            <strong>Mobile:</strong> {customerDetails.mobile}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div style={{ marginBottom: "25px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "15px" }}>
                            Select Payment Method
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px",
                                border: paymentMethod === "card" ? "2px solid #000" : "1px solid #ddd",
                                cursor: "pointer",
                                background: paymentMethod === "card" ? "#f9f9f9" : "#fff"
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ marginRight: "10px" }}
                                />
                                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                                    💳 Credit/Debit Card
                                </span>
                            </label>

                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px",
                                border: paymentMethod === "upi" ? "2px solid #000" : "1px solid #ddd",
                                cursor: "pointer",
                                background: paymentMethod === "upi" ? "#f9f9f9" : "#fff"
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="upi"
                                    checked={paymentMethod === "upi"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ marginRight: "10px" }}
                                />
                                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                                    📱 UPI
                                </span>
                            </label>

                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px",
                                border: paymentMethod === "netbanking" ? "2px solid #000" : "1px solid #ddd",
                                cursor: "pointer",
                                background: paymentMethod === "netbanking" ? "#f9f9f9" : "#fff"
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="netbanking"
                                    checked={paymentMethod === "netbanking"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ marginRight: "10px" }}
                                />
                                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                                    🏦 Net Banking
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{
                        background: "#fff3cd",
                        border: "1px solid #ffc107",
                        padding: "12px",
                        marginBottom: "20px",
                        fontSize: "13px",
                        color: "#856404"
                    }}>
                        ℹ️ This is a mock payment gateway. No real money will be charged.
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        style={{
                            width: "100%",
                            background: "#000",
                            color: "#fff",
                            border: "none",
                            padding: "16px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: processing ? "not-allowed" : "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            opacity: processing ? 0.7 : 1
                        }}
                    >
                        {processing ? "Processing Payment..." : `Pay ₹${amount}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockPaymentModal;
