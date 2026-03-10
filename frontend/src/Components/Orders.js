import React, { useEffect, useState } from "react";
import { API_URL } from '../config';

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(null);

    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));

            if (!auth || !auth.auth) {
                console.error("No auth token found");
                alert("Please login again");
                return;
            }

            console.log("Fetching orders...");
            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${auth.auth}`
                }
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                alert(`Error: ${errorData.error || 'Failed to fetch orders'}`);
                return;
            }

            const data = await response.json();
            console.log("Orders received:", data.length);
            setOrders(data);

        } catch (error) {
            console.error("Error fetching orders:", error);
            alert("Failed to connect to server. Please check if backend is running.");
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));

            await fetch(`${API_URL}/order/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.auth}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            fetchOrders();

        } catch (error) {
            console.error("Status update failed:", error);
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return "N/A";

        return (
            <>
                {addr.address}<br />
                {addr.city}, {addr.state} - {addr.pincode}<br />
                {addr.country}
            </>
        );
    };

    const filteredOrders =
        activeTab === "All"
            ? orders
            : orders.filter((o) => o.status === activeTab);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

    const countByStatus = (status) =>
        orders.filter((o) => o.status === status).length;

    return (
        <div className="container py-5">

            <div className="mb-4">
                <h2 className="fw-bold">📊 Orders Dashboard</h2>
                <p className="text-muted">Monitor and manage customer transactions</p>
            </div>

            <div className="row mb-4 g-3">
                {[
                    { status: "Pending", color: "#fef3c7", textColor: "#f59e0b" },
                    { status: "Confirmed", color: "#dbeafe", textColor: "#3b82f6" },
                    { status: "Delivered", color: "#d1fae5", textColor: "#10b981" },
                    { status: "Cancelled", color: "#fee2e2", textColor: "#ef4444" }
                ].map((item, idx) => {
                    return (
                        <div className="col-md-3" key={item.status}>
                            <div className="card border-0 shadow-sm rounded-3 p-4" style={{ background: item.color }}>
                                <h6 className="mb-2" style={{ color: item.textColor }}>{item.status} Orders</h6>
                                <h3 className="fw-bold" style={{ color: item.textColor }}>{countByStatus(item.status)}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="d-flex gap-3 flex-wrap mb-4">
                {["All", "Pending", "Confirmed", "Shipped", "OutForDelivery", "Delivered", "Cancelled"].map(
                    (status) => (
                        <button
                            key={status}
                            className={`btn rounded-pill px-4 fw-semibold ${activeTab === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={activeTab === status ? { background: "#000", border: "none" } : {}}
                            onClick={() => {
                                setActiveTab(status);
                                setCurrentPage(1);
                            }}
                        >
                            {status === "OutForDelivery" ? "Out for Delivery" : status}
                        </button>
                    )
                )}
            </div>

            <div className="card border-0 shadow-sm rounded-3">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Payment</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentOrders.map((order) => (
                                <React.Fragment key={order._id}>

                                    <tr>
                                        <td className="fw-semibold">#{order.orderId}</td>
                                        <td>{order.customerName}</td>
                                        <td>
                                            {order.paymentMethod === "Online" ? (
                                                <span className={`badge ${order.paymentStatus === "Completed" ? "bg-success" : "bg-warning"}`}>
                                                    {order.paymentStatus === "Completed" ? "✅ Paid" : "⏳ Pending"}
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">COD</span>
                                            )}
                                        </td>
                                        <td className="fw-bold" style={{ color: "#000" }}>₹{order.totalAmount}</td>

                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={order.status}
                                                onChange={(e) =>
                                                    updateStatus(order._id, e.target.value)
                                                }
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="OutForDelivery">Out For Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Refunded">Refunded</option>
                                            </select>
                                        </td>

                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() =>
                                                    setExpanded(
                                                        expanded === order._id ? null : order._id
                                                    )
                                                }
                                            >
                                                {expanded === order._id ? "Hide" : "View"}
                                            </button>
                                        </td>
                                    </tr>

                                    {expanded === order._id && (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="p-4 rounded-3" style={{ background: "#f8f9fa" }}>

                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <h5 className="fw-bold mb-0">
                                                            🧾 Order Details
                                                        </h5>
                                                        <span className="badge bg-primary px-3 py-2">
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div className="row g-4 mb-4">

                                                        <div className="col-md-4">
                                                            <div className="p-3 rounded-3 bg-white">
                                                                <small className="text-muted d-block mb-1">
                                                                    Customer Email
                                                                </small>
                                                                <div className="fw-semibold">
                                                                    {order.email}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className="p-3 rounded-3 bg-white">
                                                                <small className="text-muted d-block mb-1">
                                                                    Mobile
                                                                </small>
                                                                <div className="fw-semibold">
                                                                    {order.mobile}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className="p-3 rounded-3 bg-white">
                                                                <small className="text-muted d-block mb-1">
                                                                    Payment Method
                                                                </small>
                                                                <div className="fw-semibold">
                                                                    {order.paymentMethod}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* Payment Status Section */}
                                                    {order.paymentMethod === "Online" && (
                                                        <div className="mb-4">
                                                            <div className="p-4 rounded-3" style={{
                                                                background: order.paymentStatus === "Completed" ? "#d1fae5" : "#fef3c7",
                                                                border: `2px solid ${order.paymentStatus === "Completed" ? "#10b981" : "#f59e0b"}`
                                                            }}>
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div>
                                                                        <h6 className="fw-bold mb-2" style={{
                                                                            color: order.paymentStatus === "Completed" ? "#10b981" : "#f59e0b"
                                                                        }}>
                                                                            💳 Payment Status
                                                                        </h6>
                                                                        <div className="fw-bold fs-5" style={{
                                                                            color: order.paymentStatus === "Completed" ? "#10b981" : "#f59e0b"
                                                                        }}>
                                                                            {order.paymentStatus === "Completed" ? "✅ Payment Received" : "⏳ Payment Pending"}
                                                                        </div>
                                                                        {order.razorpayPaymentId && (
                                                                            <small className="text-muted d-block mt-2">
                                                                                Payment ID: {order.razorpayPaymentId}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                    {order.paymentStatus === "Completed" && (
                                                                        <div className="text-end">
                                                                            <div className="badge bg-success px-3 py-2 fs-6">
                                                                                PAID
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Order Tracking Timeline */}
                                                    <div className="mb-4">
                                                        <h6 className="fw-bold mb-4">📦 Order Tracking</h6>
                                                        <div className="position-relative">
                                                            {[
                                                                { status: "Pending", icon: "🕐", label: "Order Placed" },
                                                                { status: "Confirmed", icon: "✅", label: "Order Confirmed" },
                                                                { status: "Shipped", icon: "📦", label: "Shipped" },
                                                                { status: "OutForDelivery", icon: "🚚", label: "Out for Delivery" },
                                                                { status: "Delivered", icon: "🎉", label: "Delivered" }
                                                            ].map((step, idx) => {
                                                                const statusOrder = ["Pending", "Confirmed", "Shipped", "OutForDelivery", "Delivered"];
                                                                const currentIndex = statusOrder.indexOf(order.status);
                                                                const stepIndex = statusOrder.indexOf(step.status);
                                                                const isCompleted = stepIndex <= currentIndex;
                                                                const isCurrent = step.status === order.status;

                                                                return (
                                                                    <div key={step.status} className="d-flex align-items-start mb-4 position-relative">
                                                                        {/* Vertical Line */}
                                                                        {idx !== 4 && (
                                                                            <div style={{
                                                                                position: "absolute",
                                                                                left: "19px",
                                                                                top: "40px",
                                                                                width: "2px",
                                                                                height: "50px",
                                                                                background: isCompleted ? "#10b981" : "#e5e7eb"
                                                                            }} />
                                                                        )}
                                                                        
                                                                        {/* Icon Circle */}
                                                                        <div style={{
                                                                            width: "40px",
                                                                            height: "40px",
                                                                            borderRadius: "50%",
                                                                            background: isCompleted ? "#10b981" : "#f3f4f6",
                                                                            border: isCurrent ? "3px solid #000" : "none",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            fontSize: "18px",
                                                                            flexShrink: 0,
                                                                            boxShadow: isCurrent ? "0 0 0 4px rgba(0,0,0,0.1)" : "none"
                                                                        }}>
                                                                            {isCompleted ? "✓" : step.icon}
                                                                        </div>
                                                                        
                                                                        {/* Text */}
                                                                        <div className="ms-3">
                                                                            <div className="fw-bold" style={{
                                                                                color: isCompleted ? "#000" : "#9ca3af",
                                                                                fontSize: "15px"
                                                                            }}>
                                                                                {step.label}
                                                                            </div>
                                                                            {isCurrent && (
                                                                                <div className="badge bg-success mt-1" style={{ fontSize: "11px" }}>
                                                                                    Current Status
                                                                                </div>
                                                                            )}
                                                                            {isCompleted && !isCurrent && (
                                                                                <small className="text-muted">Completed</small>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="row g-4 mb-4">

                                                        <div className="col-md-6">
                                                            <div className="p-3 rounded-3 border bg-white">
                                                                <h6 className="fw-bold mb-2">
                                                                    📍 Billing Address
                                                                </h6>
                                                                <div className="text-muted">
                                                                    {formatAddress(order.billingAddress)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="p-3 rounded-3 border bg-white">
                                                                <h6 className="fw-bold mb-2">
                                                                    🚚 Shipping Address
                                                                </h6>
                                                                <div className="text-muted">
                                                                    {formatAddress(order.shippingAddress)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <hr />

                                                    <h6 className="fw-bold mb-3">
                                                        🛍 Ordered Products
                                                    </h6>

                                                    {order.products.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3 bg-white"
                                                        >
                                                            <div>
                                                                <div className="fw-semibold">
                                                                    {item.name}
                                                                </div>
                                                                <small className="text-muted">
                                                                    Quantity: {item.quantity}
                                                                </small>
                                                            </div>

                                                            <div className="fw-bold fs-5">
                                                                ₹{item.price * item.quantity}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <hr />

                                                    <div className="d-flex justify-content-end">
                                                        <div className="text-end">
                                                            <div className="text-muted">
                                                                Order Total
                                                            </div>
                                                            <div className="fw-bold fs-4">
                                                                ₹{order.totalAmount}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Orders;
