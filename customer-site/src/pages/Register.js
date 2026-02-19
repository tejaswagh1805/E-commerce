import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [image, setImage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("mobile", mobile);
        formData.append("image", image);

        try {

            const result = await axios.post(
                "http://172.16.60.17:5000/register",
                formData
            );

            alert("Registration Successful");
            navigate("/login");

        } catch (err) {
            alert("Registration Failed");
            console.log(err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Customer Registration</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    className="form-control mb-3"
                    onChange={(e) => setName(e.target.value)}
                    required
                />

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

                <input
                    type="text"
                    placeholder="Mobile"
                    className="form-control mb-3"
                    onChange={(e) => setMobile(e.target.value)}
                />

                <input
                    type="file"
                    className="form-control mb-3"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <button className="btn btn-primary">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
