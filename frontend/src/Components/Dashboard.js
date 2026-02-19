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

    /* ================= FETCH REAL ORDERS ================= */

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

            if (Array.isArray(data)) {
                setOrders(data);
            }

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    /* ================= DYNAMIC SUMMARY ================= */

    const totalRevenue = orders
        .filter(o => o.status === "Completed")
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const totalOrders = orders.length;

    const summary = {
        income: totalRevenue,
        orders: totalOrders,
        activity: totalOrders * 6, // simple activity logic
        revenue: totalRevenue
    };

    /* ================= ORDER STATUS PIE DATA ================= */

    const orderStatusData = [
        { name: "Completed", value: orders.filter(o => o.status === "Completed").length },
        { name: "Pending", value: orders.filter(o => o.status === "Pending").length },
        { name: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length },
        { name: "Refunded", value: orders.filter(o => o.status === "Refunded").length }
    ];

    const COLORS = ["#28a745", "#ffc107", "#dc3545", "#6c757d"];

    /* ================= MONTHLY REVENUE ================= */

    const revenueData = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ].map((month, index) => {
        const monthRevenue = orders
            .filter(o => new Date(o.createdAt).getMonth() === index)
            .reduce((acc, curr) => acc + curr.totalAmount, 0);

        return { month, revenue: monthRevenue };
    });

    /* ================= SALES COUNT ================= */

    const salesData = revenueData.map(item => ({
        month: item.month,
        sales: orders.filter(o =>
            new Date(o.createdAt).toLocaleString('default', { month: 'short' }) === item.month
        ).length
    }));

    /* ================= LATEST ORDERS ================= */

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
            Cancelled: "danger",
            Refunded: "secondary"
        };
        return `badge bg-${map[status]} rounded-pill px-3 py-2`;
    };

    return (
        <div className="container py-5">

            <h3 className="fw-bold mb-4">E-Commerce Dashboard</h3>

            {/* ================= SUMMARY CARDS ================= */}
            <div className="row g-4 mb-4">

                <div className="col-md-3">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="text-muted">Income</h6>
                        <h3 className="fw-bold">₹{summary.income}</h3>
                        <small className="text-success">Live Data</small>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="text-muted">Orders</h6>
                        <h3 className="fw-bold">{summary.orders}</h3>
                        <small className="text-muted">Total Orders</small>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="text-muted">Activity</h6>
                        <h3 className="fw-bold">{summary.activity}</h3>
                        <small className="text-muted">User Activity</small>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="text-muted">Revenue</h6>
                        <h3 className="fw-bold">₹{summary.revenue}</h3>
                        <small className="text-muted">Completed Orders</small>
                    </div>
                </div>

            </div>

            {/* ================= MAIN CHART ROW ================= */}
            <div className="row g-4 mb-4">

                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="fw-bold mb-3">Total Revenue</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4e73df"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="fw-bold mb-3">Order Status</h6>
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

            {/* ================= SALES + LATEST ORDERS ================= */}
            <div className="row g-4">

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="fw-bold mb-3">Sales / Revenue</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#4e73df" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h6 className="fw-bold mb-3">Latest Orders</h6>

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
                                            <td className="fw-bold">₹{order.total}</td>
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
