import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import logo from "../assets/e-commm.png";

const Nav = () => {

    const auth = localStorage.getItem("user");
    const user = auth ? JSON.parse(auth) : null;
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm px-3">
            <div className="container-fluid align-items-center">

                <Link to="/" className="navbar-brand d-flex align-items-center py-0">
                    <img
                        src={logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxHeight: "36px" }}
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
                        <ul className="navbar-nav me-auto align-items-center">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/add-product" className="nav-link">Add Product</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/profile" className="nav-link">Profile</NavLink>
                            </li>
                        </ul>
                    )}

                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                                    data-bs-toggle="dropdown"
                                >
                                    <img
                                        src={
                                            user.image
                                                ? `http://172.16.60.17:5000/uploads/${user.image}`
                                                : "https://via.placeholder.com/40"
                                        }
                                        alt="Profile"
                                        className="rounded-circle me-2"
                                        width="35"
                                        height="35"
                                        style={{ objectFit: "cover" }}
                                    />
                                    {user.name}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                    <li>
                                        <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/login" className="btn btn-outline-primary me-2">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signup" className="btn btn-primary">
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
