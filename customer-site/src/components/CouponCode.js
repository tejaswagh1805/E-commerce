import { useState } from "react";
import axios from "axios";

const CouponCode = ({ totalAmount, onCouponApplied }) => {
    const [couponCode, setCouponCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [applied, setApplied] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setMessage("Please enter a coupon code");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://localhost:5000/coupon/validate", {
                code: couponCode,
                totalAmount
            });

            setMessage(`✅ Coupon applied! You saved ₹${res.data.discount}`);
            setApplied(true);
            onCouponApplied(res.data);
        } catch (error) {
            setMessage(error.response?.data?.error || "Invalid coupon code");
            setApplied(false);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setMessage("");
        setApplied(false);
        onCouponApplied(null);
    };

    return (
        <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
                <h6 className="fw-bold mb-3">🎫 Have a Coupon Code?</h6>
                
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={applied}
                    />
                    
                    {!applied ? (
                        <button
                            className="btn btn-dark rounded-pill px-4"
                            onClick={handleApplyCoupon}
                            disabled={loading}
                        >
                            {loading ? "Applying..." : "Apply"}
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline-danger rounded-pill px-3"
                            onClick={handleRemoveCoupon}
                        >
                            Remove
                        </button>
                    )}
                </div>

                {message && (
                    <div className={`mt-2 small ${applied ? "text-success" : "text-danger"}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponCode;
