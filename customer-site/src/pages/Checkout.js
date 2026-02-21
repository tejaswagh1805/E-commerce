import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",

        // Billing
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingPincode: "",
        billingCountry: "India",

        // Shipping
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingPincode: "",
        shippingCountry: "India",

        paymentMethod: "COD",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        setForm(prev => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || ""
        }));
    }, []);

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        // remove error when typing
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        let newErrors = {};

        // Name
        if (!form.name.trim()) {
            newErrors.name = "Full name is required";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        // Mobile (exact 10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!form.mobile) {
            newErrors.mobile = "Mobile is required";
        } else if (!mobileRegex.test(form.mobile)) {
            newErrors.mobile = "Mobile must be exactly 10 digits";
        }

        // Billing address
        if (!form.billingAddress.trim())
            newErrors.billingAddress = "Billing address required";

        if (!form.billingCity.trim())
            newErrors.billingCity = "City required";

        if (!form.billingState.trim())
            newErrors.billingState = "State required";

        // Pincode (6 digits only)
        const pincodeRegex = /^[0-9]{6}$/;

        if (!form.billingPincode) {
            newErrors.billingPincode = "Pincode required";
        } else if (!pincodeRegex.test(form.billingPincode)) {
            newErrors.billingPincode = "Pincode must be exactly 6 digits";
        }

        // Shipping validation
        if (!sameAsBilling) {

            if (!form.shippingAddress.trim())
                newErrors.shippingAddress = "Shipping address required";

            if (!form.shippingCity.trim())
                newErrors.shippingCity = "City required";

            if (!form.shippingState.trim())
                newErrors.shippingState = "State required";

            if (!pincodeRegex.test(form.shippingPincode))
                newErrors.shippingPincode = "Pincode must be 6 digits";
        }

        // Card validation
        if (form.paymentMethod === "Card") {

            const cardRegex = /^[0-9]{16}$/;
            const cvvRegex = /^[0-9]{3}$/;

            if (!cardRegex.test(form.cardNumber))
                newErrors.cardNumber = "Card must be 16 digits";

            if (!form.cardName.trim())
                newErrors.cardName = "Name on card required";

            if (!form.expiry.trim())
                newErrors.expiry = "Expiry required";

            if (!cvvRegex.test(form.cvv))
                newErrors.cvv = "CVV must be 3 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const placeOrder = async () => {
        if (!validate()) return;

        const shippingData = sameAsBilling
            ? {
                address: form.billingAddress,
                city: form.billingCity,
                state: form.billingState,
                pincode: form.billingPincode,
                country: form.billingCountry
            }
            : {
                address: form.shippingAddress,
                city: form.shippingCity,
                state: form.shippingState,
                pincode: form.shippingPincode,
                country: form.shippingCountry
            };

        const res = await fetch("http://localhost:5000/place-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user._id,
                customerName: form.name,
                email: form.email,
                mobile: form.mobile,

                billingAddress: {
                    address: form.billingAddress,
                    city: form.billingCity,
                    state: form.billingState,
                    pincode: form.billingPincode,
                    country: form.billingCountry
                },

                shippingAddress: shippingData,  // 🔥 THIS IS CORRECT FOR YOUR CODE

                paymentMethod: form.paymentMethod,
                products: cart,
                totalAmount: total
            })
        });

        const data = await res.json();
        clearCart();
        navigate("/thank-you", { state: data });
    };

    return (
        <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
            <div className="container py-5">

                <h2 className="fw-bold mb-4">🧾 Secure Checkout</h2>

                <div className="row">

                    <div className="col-md-8">

                        {/* BILLING */}
                        <div className="bg-white p-4 shadow-sm rounded-4 mb-4">
                            <h5 className="fw-bold mb-3">Billing Details</h5>

                            <input className="form-control mb-3"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                            <small className="text-danger">{errors.name}</small>

                            <input className="form-control mb-3"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            <small className="text-danger">{errors.email}</small>

                            <input className="form-control mb-3"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                placeholder="Mobile"
                            />
                            <small className="text-danger">{errors.mobile}</small>

                            <textarea className="form-control mb-3"
                                name="billingAddress"
                                value={form.billingAddress}
                                onChange={handleChange}
                                placeholder="Full Address"
                            />
                            <small className="text-danger">{errors.billingAddress}</small>

                            <div className="row">
                                <div className="col">
                                    <input className="form-control mb-3"
                                        name="billingCity"
                                        placeholder="City"
                                        onChange={handleChange}
                                    />
                                    <small className="text-danger">{errors.billingCity}</small>
                                </div>
                                <div className="col">
                                    <input className="form-control mb-3"
                                        name="billingState"
                                        placeholder="State"
                                        onChange={handleChange}
                                    />
                                    <small className="text-danger">{errors.billingState}</small>
                                </div>
                                <div className="col">
                                    <input className="form-control mb-3"
                                        name="billingPincode"
                                        placeholder="Pincode"
                                        onChange={handleChange}
                                    />
                                    <small className="text-danger">{errors.billingPincode}</small>
                                </div>
                            </div>
                        </div>

                        {/* SHIPPING */}
                        <div className="bg-white p-4 shadow-sm rounded-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold">Shipping Address</h5>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={sameAsBilling}
                                        onChange={() => setSameAsBilling(!sameAsBilling)}
                                    />
                                    <label className="ms-2">Same as Billing</label>
                                </div>
                            </div>

                            {!sameAsBilling && (
                                <>
                                    <textarea className="form-control mb-3"
                                        name="shippingAddress"
                                        placeholder="Shipping Address"
                                        onChange={handleChange}
                                    />
                                    <small className="text-danger">{errors.shippingAddress}</small>

                                    <div className="row">
                                        <div className="col">
                                            <input className="form-control mb-3"
                                                name="shippingCity"
                                                placeholder="City"
                                                onChange={handleChange}
                                            />
                                            <small className="text-danger">{errors.shippingCity}</small>
                                        </div>
                                        <div className="col">
                                            <input className="form-control mb-3"
                                                name="shippingState"
                                                placeholder="State"
                                                onChange={handleChange}
                                            />
                                            <small className="text-danger">{errors.shippingState}</small>
                                        </div>
                                        <div className="col">
                                            <input className="form-control mb-3"
                                                name="shippingPincode"
                                                placeholder="Pincode"
                                                onChange={handleChange}
                                            />
                                            <small className="text-danger">{errors.shippingPincode}</small>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* PAYMENT */}
                        <div className="bg-white p-4 shadow-sm rounded-4">
                            <h5 className="fw-bold mb-3">Payment Method</h5>

                            <div className="form-check mb-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={form.paymentMethod === "COD"}
                                    onChange={handleChange}
                                />
                                <label className="ms-2">Cash on Delivery</label>
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Card"
                                    checked={form.paymentMethod === "Card"}
                                    onChange={handleChange}
                                />
                                <label className="ms-2">Credit / Debit Card</label>
                            </div>

                            {/* 🔥 CARD DETAILS SECTION */}
                            {form.paymentMethod === "Card" && (
                                <div className="mt-3 p-3 border rounded-3 bg-light">

                                    <input
                                        className="form-control mb-3"
                                        name="cardNumber"
                                        placeholder="Card Number"
                                        maxLength="16"
                                        value={form.cardNumber}
                                        onChange={handleChange}
                                    />
                                    <small className="text-danger">{errors.cardNumber}</small>

                                    <input
                                        className="form-control mb-3"
                                        name="cardName"
                                        placeholder="Name on Card"
                                        value={form.cardName}
                                        onChange={handleChange}
                                    />
                                    <small className="text-danger">{errors.cardName}</small>

                                    <div className="row">
                                        <div className="col">
                                            <input
                                                className="form-control"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={form.expiry}
                                                onChange={handleChange}
                                            />
                                            <small className="text-danger">{errors.expiry}</small>
                                        </div>

                                        <div className="col">
                                            <input
                                                className="form-control"
                                                name="cvv"
                                                placeholder="CVV"
                                                maxLength="3"
                                                value={form.cvv}
                                                onChange={handleChange}
                                            />
                                            <small className="text-danger">{errors.cvv}</small>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="col-md-4">

                        <div className="bg-white shadow rounded-4 p-4">
                            <h5 className="fw-bold mb-4">🛒 Order Summary</h5>

                            {cart.map(item => (
                                <div key={item._id}
                                    className="d-flex justify-content-between mb-3">
                                    <span>{item.name} × {item.quantity}</span>
                                    <strong>₹{item.price * item.quantity}</strong>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <button
                                className="btn w-100 mt-3 text-white"
                                style={{
                                    background: "linear-gradient(135deg,#000,#434343)",
                                    borderRadius: "30px",
                                    padding: "12px"
                                }}
                                onClick={placeOrder}
                            >
                                🔒 Confirm Order
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Checkout;
