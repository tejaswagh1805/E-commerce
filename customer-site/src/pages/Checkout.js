import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [sameAsBilling, setSameAsBilling] = useState(true);

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
    };

    const placeOrder = async () => {

        if (!form.name || !form.email || !form.mobile) {
            alert("Please fill required fields");
            return;
        }

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

        const res = await fetch("http://172.16.60.17:5000/place-order", {
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

                            <input className="form-control mb-3"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />

                            <input className="form-control mb-3"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                placeholder="Mobile"
                            />

                            <textarea className="form-control mb-3"
                                name="billingAddress"
                                value={form.billingAddress}
                                onChange={handleChange}
                                placeholder="Full Address"
                            />

                            <div className="row">
                                <div className="col">
                                    <input className="form-control mb-3"
                                        name="billingCity"
                                        placeholder="City"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <input className="form-control mb-3"
                                        name="billingState"
                                        placeholder="State"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <input className="form-control mb-3"
                                        name="billingPincode"
                                        placeholder="Pincode"
                                        onChange={handleChange}
                                    />
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

                                    <div className="row">
                                        <div className="col">
                                            <input className="form-control mb-3"
                                                name="shippingCity"
                                                placeholder="City"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <input className="form-control mb-3"
                                                name="shippingState"
                                                placeholder="State"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <input className="form-control mb-3"
                                                name="shippingPincode"
                                                placeholder="Pincode"
                                                onChange={handleChange}
                                            />
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

                                    <input
                                        className="form-control mb-3"
                                        name="cardName"
                                        placeholder="Name on Card"
                                        value={form.cardName}
                                        onChange={handleChange}
                                    />

                                    <div className="row">
                                        <div className="col">
                                            <input
                                                className="form-control"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={form.expiry}
                                                onChange={handleChange}
                                            />
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
