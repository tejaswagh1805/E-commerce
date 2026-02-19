import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [mobile, setMobile] = useState("");
    const [image, setImage] = useState(null);


    useEffect(() => {
        // You can add any authentication check logic here if needed
        const auth = localStorage.getItem("user");

        if (auth) {
            navigate("/");
        }
    }, []);

    const collectData = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("mobile", mobile);

        if (image) {
            formData.append("image", image);
        }

        const response = await fetch("http://localhost:5000/admin-register", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            navigate("/login");
        } else {
            alert(result.error || "Registration failed");
        }
    };



    return (
        <div className="signup-wrapper">

            <div className="signup-card animate-slide">

                <div className="text-center mb-4">
                    <h2 className="fw-bold gradient-text">Create Account</h2>
                    <p className="text-muted">Join us and start your journey 🚀</p>
                </div>

                <form onSubmit={collectData}>

                    <div className="floating-group">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>Full Name</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email Address</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="text"
                            required
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                        <label>Mobile Number</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>
                    </div>

                    <div className="mb-3 text-center">
                        <label className="upload-label">Upload Profile Image</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="image-preview"
                            />
                        )}
                    </div>

                    <button type="submit" className="btn btn-modern">
                        Create Account
                    </button>

                    <div className="text-center mt-3">
                        <small>
                            Already have an account?
                            <a href="/login" className="ms-1">Login</a>
                        </small>
                    </div>

                </form>
            </div>
        </div>
    );

};

export default SignUp;
