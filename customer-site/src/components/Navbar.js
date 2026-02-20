import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import logo from "../assets/e-commm.png";

const Navbar = () => {

    const { cart } = useContext(CartContext);
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const navigate = useNavigate();

    // 🔥 Listen for login changes
    useEffect(() => {
        const checkUser = () => {
            setUser(JSON.parse(localStorage.getItem("user")));
        };

        window.addEventListener("storage", checkUser);

        return () => {
            window.removeEventListener("storage", checkUser);
        };
    }, []);

    const handleLogout = () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            localStorage.removeItem(`cart_${user._id}`);
        }

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // 🔥 Force CartContext to reload
        window.dispatchEvent(new Event("storage"));

        setUser(null);
        navigate("/");
    };

    const handleCartClick = (e) => {
        if (!user) {
            e.preventDefault();
            navigate("/login", { state: { fromCart: true } });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
            <div className="container">

                <Link to="/" className="navbar-brand d-flex align-items-center py-0">
                    <img
                        src={logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxHeight: "40px" }}
                    />
                </Link>

                <ul className="navbar-nav ms-auto gap-3 align-items-center">

                    <li className="nav-item">
                        <Link className="nav-link" to="/shop">
                            Shop
                        </Link>
                    </li>

                    <li className="nav-item position-relative">
                        <Link
                            className="nav-link"
                            to="/cart"
                            onClick={handleCartClick}
                        >
                            Cart
                            {cart.length > 0 && (
                                <span className="badge bg-dark ms-1">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    </li>

                    {user && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders">
                                Orders
                            </Link>
                        </li>
                    )}

                    {!user ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="btn btn-outline-dark" to="/register">
                                    Register
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item dropdown">
                            <button
                                className="btn btn-dark dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                Hi, {user.name}
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to={`/profile/${user._id}`}
                                    >
                                        Profile
                                    </Link>
                                </li>

                                <li><hr className="dropdown-divider" /></li>

                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    )}

                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
