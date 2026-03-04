import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const fromCart = location.state?.fromCart || false;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // ✅ VALIDATION ONLY (SAFE)
    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email)
            newErrors.email = "Email is required";
        else if (!emailRegex.test(email))
            newErrors.email = "Invalid email format";

        if (!password)
            newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const result = await axios.post(
                `${API_URL}/login`,
                { email, password }
            );

            // 🔥 ORIGINAL WORKING LOGIC (UNCHANGED)
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("token", result.data.auth);

            window.dispatchEvent(new Event("storage"));

            if (fromCart) {
                navigate("/cart");
            } else {
                navigate("/shop");
            }

        } catch (err) {
            alert("Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}
        >
            <div
                className="shadow"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "#ffffff",
                    borderRadius: "0",
                    padding: "50px",
                    border: "1px solid #e5e5e5",
                    animation: "fadeIn 0.5s ease"
                }}
            >
                <h2 className="text-center fw-bold mb-4" style={{ color: "#000", letterSpacing: "-0.5px" }}>
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div className="mb-3">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="form-control px-4"
                            style={{ 
                                height: "48px",
                                borderRadius: "0",
                                border: "1px solid #ddd"
                            }}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: "" });
                            }}
                        />
                        <small className="text-danger">
                            {errors.email}
                        </small>
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3 position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="form-control px-4"
                            style={{
                                height: "48px",
                                paddingRight: "60px",
                                borderRadius: "0",
                                border: "1px solid #ddd"
                            }}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({ ...errors, password: "" });
                            }}
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#666",
                                fontWeight: "500"
                            }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>

                        <small className="text-danger">
                            {errors.password}
                        </small>
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="btn w-100"
                        style={{
                            height: "48px",
                            background: "#000",
                            color: "#fff",
                            fontWeight: "600",
                            borderRadius: "0",
                            border: "none",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontSize: "14px",
                            transition: "0.3s"
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>

                <p className="text-center mt-4 mb-0" style={{ color: "#666" }}>
                    Don't have an account?{" "}
                    <span
                        style={{
                            fontWeight: "600",
                            cursor: "pointer",
                            color: "#000"
                        }}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </div>

            {/* Smooth Animation + Focus Glow */}
            <style>
                {`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .form-control:focus {
                    box-shadow: none;
                    border-color: #000 !important;
                    outline: none;
                }

                .btn:hover {
                    background: #333 !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                }
                `}
            </style>
        </div>
    );
};

export default Login;