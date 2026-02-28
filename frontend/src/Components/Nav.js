import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import logo from "../assets/e-commm.png";

const Nav = () => {

    const auth = localStorage.getItem("user");
    const parsed = auth ? JSON.parse(auth) : null;
    const user = parsed ? parsed.user : null;

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom sticky-top px-3">
            <div className="container-fluid align-items-center">

                <Link to="/" className="navbar-brand d-flex align-items-center py-0">
                    <img
                        src={logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxHeight: "40px" }}
                    />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse align-items-center" id="mainNavbar">

                    {user && (
                        <ul className="navbar-nav me-auto align-items-center gap-2">
                            <li className="nav-item"><NavLink to="/" className="nav-link nav-animated">Dashboard</NavLink></li>
                            <li className="nav-item">
                                <NavLink to="/products" className="nav-link nav-animated">Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/add-product" className="nav-link nav-animated">Add Product</NavLink>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">
                                    Orders
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/coupons">
                                    Coupons
                                </Link>
                            </li>
                        </ul>
                    )}

                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="btn profile-btn dropdown-toggle d-flex align-items-center"
                                    data-bs-toggle="dropdown"
                                >
                                    <img
                                        src={
                                            user.image
                                                ? `http://localhost:5000/uploads/${user.image}`
                                                : "https://via.placeholder.com/40"
                                        }
                                        alt="Profile"
                                        className="rounded-circle me-2"
                                        width="38"
                                        height="38"
                                    />
                                    {user.name}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4">
                                    <li>
                                        <NavLink to="/profile" className="dropdown-item">
                                            Profile
                                        </NavLink>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger fw-semibold" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item me-2">
                                    <NavLink to="/login" className="btn btn-gradient rounded-pill px-4">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signup" className="btn btn-gradient rounded-pill px-4">
                                        Sign Up
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                </div>
            </div>
        </nav>
    );
};

export default Nav;
