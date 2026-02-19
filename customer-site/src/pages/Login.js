import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const fromCart = location.state?.fromCart || false;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await axios.post(
                "http://localhost:5000/login",
                { email, password }
            );

            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("token", result.data.auth);

            // 🔥 Force navbar refresh
            window.dispatchEvent(new Event("storage"));

            // 🔥 Redirect Logic
            if (fromCart) {
                navigate("/cart");
            } else {
                navigate("/shop");
            }

        } catch (err) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">Customer Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="form-control mb-3"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="btn btn-dark w-100">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
