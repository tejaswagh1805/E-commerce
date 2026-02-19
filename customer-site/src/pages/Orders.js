import React, { useEffect, useState } from "react";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await fetch(
            `http://172.16.60.17:5000/customer-orders/${user._id}`
        );
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
    };

    const getStatusColor = (status) => {
        const map = {
            Pending: "#ffb703",
            Completed: "#2ecc71",
            Cancelled: "#e63946",
            Refunded: "#6c757d"
        };
        return map[status] || "#999";
    };

    const getProgressStep = (status) => {
        switch (status) {
            case "Pending":
                return 1;
            case "Completed":
                return 3;
            case "Cancelled":
            case "Refunded":
                return 0;
            default:
                return 2;
        }
    };

    // ✅ REAL PDF DOWNLOAD FUNCTION
    const downloadInvoice = async (order) => {
        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://172.16.60.17:5000/invoice/${order._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                alert("Failed to download invoice");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${order.orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

        } catch (error) {
            console.error("Invoice error:", error);
            alert("Invoice download failed");
        }
    };

    return (
        <div style={{ background: "#ffffff", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div className="mb-5">
                    <h2 className="fw-bold">My Orders</h2>
                    <p className="text-muted">
                        Track and manage your purchases
                    </p>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-5">
                        <h5>No Orders Found</h5>
                    </div>
                )}

                {orders.map(order => {

                    const progress = getProgressStep(order.status);

                    return (
                        <div
                            key={order._id}
                            className="mb-4 p-4 rounded-4"
                            style={{
                                background: "#fff",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                            }}
                        >

                            {/* ORDER HEADER */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="fw-bold mb-1">
                                        Order ID: {order.orderId}
                                    </h6>
                                    <small className="text-muted">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </small>
                                </div>

                                <div
                                    style={{
                                        background: getStatusColor(order.status),
                                        color: "#fff",
                                        padding: "6px 18px",
                                        borderRadius: "50px",
                                        fontSize: "0.85rem",
                                        fontWeight: "600"
                                    }}
                                >
                                    {order.status}
                                </div>
                            </div>

                            {/* PROGRESS TRACKER */}
                            <div className="mt-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center">

                                    {["Ordered", "Shipped", "Delivered"].map((step, i) => (
                                        <div key={i} className="text-center flex-fill">

                                            <div
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    margin: "0 auto",
                                                    borderRadius: "50%",
                                                    background:
                                                        progress > i
                                                            ? "#4f46e5"
                                                            : "#e5e7eb",
                                                    transition: "0.3s"
                                                }}
                                            />

                                            <small className="text-muted d-block mt-1">
                                                {step}
                                            </small>

                                        </div>
                                    ))}

                                </div>
                            </div>

                            <hr />

                            {/* PRODUCTS */}
                            {order.products.map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex justify-content-between align-items-center mb-4"
                                >
                                    <div className="d-flex align-items-center gap-4">

                                        <div
                                            style={{
                                                background: "#f8f9fa",
                                                padding: "12px",
                                                borderRadius: "12px"
                                            }}
                                        >
                                            <img
                                                src={`http://172.16.60.17:5000/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <div className="fw-semibold">
                                                {item.name}
                                            </div>
                                            <small className="text-muted">
                                                Qty: {item.quantity}
                                            </small>
                                        </div>

                                    </div>

                                    <div className="fw-bold fs-5">
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}

                            <hr />

                            {/* TOTAL + INVOICE */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold fs-5">
                                    Total: ₹{order.totalAmount}
                                </div>

                                <button
                                    className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                    onClick={() => downloadInvoice(order)}
                                >
                                    Download Invoice
                                </button>
                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default Orders;
