import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/");
        }
    }, []);
    const handleLogin = async (e) => {
        e.preventDefault();

        let result = await fetch(`${API_URL}/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        result = await result.json();

        if (result.auth) {

            // ✅ STORE FULL RESPONSE (IMPORTANT)
            localStorage.setItem("user", JSON.stringify(result));

            navigate("/");

        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="login-wrapper">

            <div className="login-card animate-fade">

                <div className="text-center mb-4">
                    <h3 className="fw-bold">Welcome Back</h3>
                    <p className="text-muted">Login to continue</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="floating-group">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email Address</label>
                    </div>

                    <div className="floating-group password-group">
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>
                    </div>

                    <button className="btn-login">
                        Login
                    </button>

                </form>

                <div className="text-center mt-3">
                    <small>
                        Don’t have an account?
                        <a href="/signup" className="ms-1">Sign Up</a>
                    </small>
                </div>

            </div>
        </div>
    );

}

export default Login;