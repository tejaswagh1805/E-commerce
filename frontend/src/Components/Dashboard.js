import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const Dashboard = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));

            const response = await fetch("http://localhost:5000/orders", {
                headers: {
                    Authorization: `Bearer ${auth.auth}`
                }
            });

            const data = await response.json();

            if (Array.isArray(data)) {
                setOrders(data);
            }

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    const totalRevenue = orders
        .filter(o => o.status === "Completed")
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const totalOrders = orders.length;

    const summary = {
        income: totalRevenue,
        orders: totalOrders,
        activity: totalOrders * 6,
        revenue: totalRevenue
    };

    const orderStatusData = [
        { name: "Completed", value: orders.filter(o => o.status === "Completed" || o.status === "Delivered").length },
        { name: "Pending", value: orders.filter(o => o.status === "Pending").length },
        { name: "Shipped", value: orders.filter(o => o.status === "Shipped" || o.status === "Confirmed" || o.status === "OutForDelivery").length },
        { name: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length },
        { name: "Refunded", value: orders.filter(o => o.status === "Refunded").length }
    ].filter(item => item.value > 0);

    const COLORS = ["#28a745", "#ffc107", "#17a2b8", "#dc3545", "#6c757d"];

    const revenueData = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ].map((month, index) => {
        const monthRevenue = orders
            .filter(o => new Date(o.createdAt).getMonth() === index)
            .reduce((acc, curr) => acc + curr.totalAmount, 0);

        return { month, revenue: monthRevenue };
    });

    const salesData = revenueData.map(item => ({
        month: item.month,
        sales: orders.filter(o =>
            new Date(o.createdAt).toLocaleString('default', { month: 'short' }) === item.month
        ).length
    }));

    const latestOrders = orders
        .slice(0, 5)
        .map(o => ({
            id: o.orderId,
            customer: o.customerName,
            total: o.totalAmount,
            status: o.status
        }));

    const getBadge = (status) => {
        const map = {
            Pending: "warning",
            Completed: "success",
            Delivered: "success",
            Confirmed: "info",
            Shipped: "info",
            OutForDelivery: "primary",
            Cancelled: "danger",
            Refunded: "secondary"
        };
        return `badge bg-${map[status] || 'secondary'} rounded-pill px-3 py-2`;
    };

    return (
        <div className="container py-5">

            <h3 className="fw-bold mb-4">📊 E-Commerce Dashboard</h3>

            <div className="row g-4 mb-4">

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-4" style={{ background: "#fff5f8" }}>
                        <h6 className="text-muted mb-2">💰 Income</h6>
                        <h3 className="fw-bold" style={{ color: "#ff6b9d" }}>₹{summary.income}</h3>
                        <small className="text-success">✓ Live Data</small>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-4" style={{ background: "#f0f9ff" }}>
                        <h6 className="text-muted mb-2">📦 Orders</h6>
                        <h3 className="fw-bold" style={{ color: "#0ea5e9" }}>{summary.orders}</h3>
                        <small className="text-muted">Total Orders</small>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-4" style={{ background: "#f0fdf4" }}>
                        <h6 className="text-muted mb-2">⚡ Activity</h6>
                        <h3 className="fw-bold" style={{ color: "#10b981" }}>{summary.activity}</h3>
                        <small className="text-muted">User Activity</small>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-4" style={{ background: "#fef3c7" }}>
                        <h6 className="text-muted mb-2">💎 Revenue</h6>
                        <h3 className="fw-bold" style={{ color: "#f59e0b" }}>₹{summary.revenue}</h3>
                        <small className="text-muted">Completed Orders</small>
                    </div>
                </div>

            </div>

            <div className="row g-4 mb-4">

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 p-4">
                        <h6 className="fw-bold mb-3">📈 Total Revenue</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#ff6b9d"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-3 p-4">
                        <h6 className="fw-bold mb-3">🎯 Order Status</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={orderStatusData} dataKey="value" outerRadius={100}>
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <div className="row g-4">

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-3 p-4">
                        <h6 className="fw-bold mb-3">📊 Sales Overview</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#ff6b9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 p-4">
                        <h6 className="fw-bold mb-3">🛒 Latest Orders</h6>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="fw-semibold">#{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td className="fw-bold" style={{ color: "#ff6b9d" }}>₹{order.total}</td>
                                            <td>
                                                <span className={getBadge(order.status)}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
