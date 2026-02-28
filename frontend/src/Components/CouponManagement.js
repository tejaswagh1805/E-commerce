import { useEffect, useState } from "react";
import axios from "axios";

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        code: "",
        discount: "",
        type: "percentage",
        minPurchase: 0,
        maxDiscount: "",
        expiryDate: "",
        usageLimit: ""
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            const res = await axios.get("http://localhost:5000/admin/coupons", {
                headers: { Authorization: `Bearer ${user.auth}` }
            });
            setCoupons(res.data);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            await axios.post("http://localhost:5000/admin/coupon", form, {
                headers: { Authorization: `Bearer ${user.auth}` }
            });
            alert("Coupon created successfully!");
            setShowForm(false);
            setForm({
                code: "",
                discount: "",
                type: "percentage",
                minPurchase: 0,
                maxDiscount: "",
                expiryDate: "",
                usageLimit: ""
            });
            fetchCoupons();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to create coupon");
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">🎫 Coupon Management</h3>
                <button 
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancel" : "+ Create Coupon"}
                </button>
            </div>

            {showForm && (
                <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Coupon Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.code}
                                        onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-semibold">Discount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.discount}
                                        onChange={(e) => setForm({...form, discount: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-semibold">Type</label>
                                    <select
                                        className="form-select"
                                        value={form.type}
                                        onChange={(e) => setForm({...form, type: e.target.value})}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed (₹)</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-semibold">Min Purchase (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.minPurchase}
                                        onChange={(e) => setForm({...form, minPurchase: e.target.value})}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-semibold">Max Discount (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.maxDiscount}
                                        onChange={(e) => setForm({...form, maxDiscount: e.target.value})}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-semibold">Usage Limit</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.usageLimit}
                                        onChange={(e) => setForm({...form, usageLimit: e.target.value})}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.expiryDate}
                                        onChange={(e) => setForm({...form, expiryDate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-dark rounded-pill px-4">
                                Create Coupon
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Type</th>
                                <th>Min Purchase</th>
                                <th>Expiry</th>
                                <th>Used</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td className="fw-bold">{coupon.code}</td>
                                    <td>{coupon.discount}{coupon.type === "percentage" ? "%" : "₹"}</td>
                                    <td>{coupon.type}</td>
                                    <td>₹{coupon.minPurchase}</td>
                                    <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                    <td>{coupon.usedCount} / {coupon.usageLimit || "∞"}</td>
                                    <td>
                                        <span className={`badge ${coupon.isActive ? "bg-success" : "bg-danger"}`}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CouponManagement;
