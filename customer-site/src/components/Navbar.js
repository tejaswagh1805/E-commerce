import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import logo from "../assets/e-commm.png";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("storage", checkUser);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      localStorage.removeItem(`cart_${user._id}`);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

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
    <nav 
      className="navbar navbar-expand-lg navbar-light sticky-top" 
      style={{ 
        background: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: scrolled ? "1px solid #e5e5e5" : "none",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.05)" : "none",
        transition: "all 0.3s ease",
        padding: "20px 0"
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            alt="MyStore Logo"
            style={{ 
              maxHeight: "40px",
              objectFit: "contain"
            }}
          />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-4">
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/"
                style={{
                  color: "#000",
                  fontWeight: "500",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#666"}
                onMouseLeave={(e) => e.target.style.color = "#000"}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/shop"
                style={{
                  color: "#000",
                  fontWeight: "500",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#666"}
                onMouseLeave={(e) => e.target.style.color = "#000"}
              >
                Shop
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/orders"
                    style={{
                      color: "#000",
                      fontWeight: "500",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      transition: "0.3s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#666"}
                    onMouseLeave={(e) => e.target.style.color = "#000"}
                  >
                    Orders
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            {user && (
              <li className="nav-item">
                <Link 
                  to="/wishlist"
                  style={{
                    color: "#000",
                    fontSize: "20px",
                    textDecoration: "none",
                    transition: "0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#666"}
                  onMouseLeave={(e) => e.target.style.color = "#000"}
                  title="Wishlist"
                >
                  ♡
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link 
                to="/cart" 
                onClick={handleCartClick}
                style={{
                  color: "#000",
                  fontSize: "20px",
                  textDecoration: "none",
                  position: "relative",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#666"}
                onMouseLeave={(e) => e.target.style.color = "#000"}
                title="Cart"
              >
                🛒
                {cart.length > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    background: "#000",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "600"
                  }}>
                    {cart.length}
                  </span>
                )}
              </Link>
            </li>

            {!user ? (
              <li className="nav-item">
                <Link 
                  to="/login"
                  style={{
                    color: "#000",
                    fontSize: "20px",
                    textDecoration: "none",
                    transition: "0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#666"}
                  onMouseLeave={(e) => e.target.style.color = "#000"}
                  title="Login"
                >
                  👤
                </Link>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn border-0 p-0 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{
                    background: "transparent",
                    color: "#000",
                    fontSize: "20px"
                  }}
                  title="Account"
                >
                  👤
                </button>

                <ul className="dropdown-menu dropdown-menu-end" style={{
                  border: "1px solid #e5e5e5",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderRadius: "0",
                  minWidth: "180px"
                }}>
                  <li style={{ 
                    padding: "10px 20px", 
                    borderBottom: "1px solid #e5e5e5",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#000"
                  }}>
                    {user.name}
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/profile" 
                      style={{
                        fontSize: "13px",
                        padding: "10px 20px",
                        color: "#666"
                      }}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" style={{ margin: "0" }} />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{
                        fontSize: "13px",
                        padding: "10px 20px",
                        color: "#666"
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
