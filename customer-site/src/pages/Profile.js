import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        image: null
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!userData || !token) {
            navigate("/login");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/profile/${userData._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setFormData({
                name: res.data.name,
                email: res.data.email,
                mobile: res.data.mobile || "",
                image: null
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        const mobileRegex = /^[0-9]{10}$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Invalid email format";
        }

        if (formData.mobile && !mobileRegex.test(formData.mobile)) {
            newErrors.mobile = "Mobile must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        const token = localStorage.getItem("token");
        const updateData = new FormData();
        
        updateData.append("name", formData.name.trim());
        updateData.append("email", formData.email.trim());
        updateData.append("mobile", formData.mobile);
        
        if (formData.image) {
            updateData.append("image", formData.image);
        }

        try {
            const res = await axios.put(
                `http://localhost:5000/profile/${user._id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert(error.response?.data?.error || "Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "40px 0" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        
                        {/* Profile Header */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                border: "3px solid #000",
                                                background: "#f8f9fa"
                                            }}
                                        >
                                            <img
                                                src={
                                                    user?.image
                                                        ? `http://localhost:5000/uploads/${user.image}`
                                                        : "https://via.placeholder.com/80"
                                                }
                                                alt="Profile"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold mb-1">{user?.name}</h4>
                                            <p className="text-muted mb-0">{user?.email}</p>
                                        </div>
                                    </div>
                                    
                                    {!editMode && (
                                        <button
                                            className="btn"
                                            style={{
                                                background: "#000",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                fontWeight: "600",
                                                padding: "10px 24px"
                                            }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Profile Information</h5>

                                {!editMode ? (
                                    <div>
                                        <div className="mb-4">
                                            <label className="text-muted small mb-1">Full Name</label>
                                            <p className="fw-semibold mb-0">{user?.name}</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="text-muted small mb-1">Email Address</label>
                                            <p className="fw-semibold mb-0">{user?.email}</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="text-muted small mb-1">Mobile Number</label>
                                            <p className="fw-semibold mb-0">{user?.mobile || "Not provided"}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUpdate}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{
                                                    border: "2px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                    padding: "12px 16px"
                                                }}
                                                value={formData.name}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, name: e.target.value });
                                                    setErrors({ ...errors, name: "" });
                                                }}
                                            />
                                            <small className="text-danger">{errors.name}</small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                style={{
                                                    border: "2px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                    padding: "12px 16px"
                                                }}
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    setErrors({ ...errors, email: "" });
                                                }}
                                            />
                                            <small className="text-danger">{errors.email}</small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Mobile Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                maxLength="10"
                                                style={{
                                                    border: "2px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                    padding: "12px 16px"
                                                }}
                                                value={formData.mobile}
                                                onChange={(e) => {
                                                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                                                    setFormData({ ...formData, mobile: onlyNumbers });
                                                    setErrors({ ...errors, mobile: "" });
                                                }}
                                            />
                                            <small className="text-danger">{errors.mobile}</small>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Profile Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                style={{
                                                    border: "2px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                    padding: "12px 16px"
                                                }}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, image: e.target.files[0] });
                                                }}
                                            />
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn flex-grow-1"
                                                style={{
                                                    background: "#000",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    fontWeight: "600",
                                                    padding: "12px"
                                                }}
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn flex-grow-1"
                                                style={{
                                                    background: "#fff",
                                                    color: "#000",
                                                    border: "2px solid #000",
                                                    borderRadius: "8px",
                                                    fontWeight: "600",
                                                    padding: "12px"
                                                }}
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setFormData({
                                                        name: user.name,
                                                        email: user.email,
                                                        mobile: user.mobile || "",
                                                        image: null
                                                    });
                                                    setErrors({});
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
