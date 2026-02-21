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
  const [errors, setErrors] = useState({});

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};

    // Strong professional email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    const mobileRegex = /^[0-9]{10}$/;

    // Name
    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Mobile
    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Image
    if (!image) {
      newErrors.image = "Profile image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("mobile", mobile);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed");
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid #eee",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <h2 className="text-center fw-bold mb-4">Create Your Account</h2>

        <form onSubmit={handleRegister}>
          {/* NAME */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              className="form-control rounded-pill px-4"
              style={{ height: "48px" }}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
            />
            <small className="text-danger">{errors.name}</small>
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email Address"
              className="form-control rounded-pill px-4"
              style={{ height: "48px" }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
            />
            <small className="text-danger">{errors.email}</small>
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control rounded-pill px-4"
              style={{ height: "48px" }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
            />
            <small className="text-danger">{errors.password}</small>
          </div>

          {/* MOBILE */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Mobile Number"
              maxLength="10"
              className="form-control rounded-pill px-4"
              style={{ height: "48px" }}
              value={mobile}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setMobile(onlyNumbers);
                setErrors({ ...errors, mobile: "" });
              }}
            />
            <small className="text-danger">{errors.mobile}</small>
          </div>

          {/* IMAGE */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              className="form-control rounded-3"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setErrors({ ...errors, image: "" });
              }}
            />
            <small className="text-danger">{errors.image}</small>
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-pill"
            style={{
              height: "48px",
              background: "#000",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "0.3s",
            }}
          >
            Register
          </button>
        </form>
      </div>

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
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.08);
                    border-color: #000;
                }

                .btn:hover {
                    transform: translateY(-2px);
                }
                `}
      </style>
    </div>
  );
};

export default Register;
