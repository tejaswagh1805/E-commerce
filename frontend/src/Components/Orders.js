import React, { useEffect, useState } from "react";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(null);

    const ordersPerPage = 10;

    const statusColors = {
        All: "dark",
        Pending: "warning",
        Completed: "success",
        Cancelled: "danger",
        Refunded: "secondary"
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));

            const response = await fetch("http://172.16.60.17:5000/orders", {
                headers: {
                    Authorization: `Bearer ${auth.auth}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setOrders(data);
            }

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));

            await fetch(`http://172.16.60.17:5000/order/${id}`, {
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

            {/* HEADER */}
            <div className="mb-5 p-4 rounded-4 text-white"
                style={{ background: "linear-gradient(90deg, #1e3c72, #2a5298)" }}
            >
                <h2 className="fw-bold mb-1">Orders Dashboard</h2>
                <p className="mb-0 opacity-75">
                    Monitor and manage customer transactions
                </p>
            </div>

            {/* SUMMARY CARDS */}
            <div className="row mb-4 g-3">
                {["Pending", "Completed", "Cancelled", "Refunded"].map((status) => (
                    <div className="col-md-3" key={status}>
                        <div className={`p-4 rounded-4 shadow-sm text-white bg-${statusColors[status]}`}>
                            <h6 className="mb-2">{status} Orders</h6>
                            <h3 className="fw-bold">{countByStatus(status)}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTER */}
            <div className="d-flex gap-3 flex-wrap mb-4">
                {["All", "Pending", "Completed", "Cancelled", "Refunded"].map(
                    (status) => (
                        <button
                            key={status}
                            className={`btn rounded-pill px-4 fw-semibold ${activeTab === status
                                ? `btn-${statusColors[status]}`
                                : `btn-outline-${statusColors[status]}`
                                }`}
                            onClick={() => {
                                setActiveTab(status);
                                setCurrentPage(1);
                            }}
                        >
                            {status}
                        </button>
                    )
                )}
            </div>

            {/* TABLE */}
            <div className="card shadow-lg border-0 rounded-4">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
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
                                        <td className="fw-bold">₹{order.totalAmount}</td>

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

                                    {/* EXPANDED DETAILS */}
                                    {expanded === order._id && (
                                        <tr>
                                            <td colSpan="6">
                                                <div
                                                    className="p-4 rounded-4"
                                                    style={{
                                                        background: "#ffffff",
                                                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                                                        border: "1px solid #f1f1f1"
                                                    }}
                                                >

                                                    {/* ================= CUSTOMER HEADER ================= */}
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <h5 className="fw-bold mb-0">
                                                            🧾 Order Details
                                                        </h5>
                                                        <span
                                                            className="px-3 py-2 rounded-pill text-white"
                                                            style={{
                                                                background:
                                                                    order.status === "Delivered"
                                                                        ? "#28a745"
                                                                        : order.status === "Pending"
                                                                            ? "#ffc107"
                                                                            : order.status === "Cancelled"
                                                                                ? "#dc3545"
                                                                                : "#6c757d",
                                                                fontSize: "0.8rem",
                                                                fontWeight: "600"
                                                            }}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    {/* ================= CUSTOMER INFO ================= */}
                                                    <div className="row g-4 mb-4">

                                                        <div className="col-md-4">
                                                            <div className="p-3 rounded-3 bg-light h-100">
                                                                <small className="text-muted d-block mb-1">
                                                                    Customer Email
                                                                </small>
                                                                <div className="fw-semibold">
                                                                    {order.email}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className="p-3 rounded-3 bg-light h-100">
                                                                <small className="text-muted d-block mb-1">
                                                                    Mobile
                                                                </small>
                                                                <div className="fw-semibold">
                                                                    {order.mobile}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className="p-3 rounded-3 bg-light h-100">
                                                                <small className="text-muted d-block mb-1">
                                                                    Payment Method
                                                                </small>
                                                                <div className="fw-semibold">
                                                                    {order.paymentMethod}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* ================= ADDRESSES ================= */}
                                                    <div className="row g-4 mb-4">

                                                        <div className="col-md-6">
                                                            <div className="p-3 rounded-3 border h-100">
                                                                <h6 className="fw-bold mb-2">
                                                                    📍 Billing Address
                                                                </h6>
                                                                <div className="text-muted">
                                                                    {formatAddress(order.billingAddress)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="p-3 rounded-3 border h-100">
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

                                                    {/* ================= PRODUCTS ================= */}
                                                    <h6 className="fw-bold mb-3">
                                                        🛍 Ordered Products
                                                    </h6>

                                                    {order.products.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3"
                                                            style={{
                                                                background: "#f8f9fa",
                                                                border: "1px solid #eee",
                                                                transition: "0.2s"
                                                            }}
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

                                                    {/* ================= TOTAL ================= */}
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
