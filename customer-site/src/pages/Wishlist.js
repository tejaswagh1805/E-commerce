import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        
        if (!user || !token) {
            navigate("/login");
            return;
        }

        try {
            const res = await axios.get("http://localhost:5000/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWishlist(res.data.products || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`http://localhost:5000/wishlist/remove/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWishlist(wishlist.filter(item => item.productId?._id !== productId));
            alert("Removed from wishlist");
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const exists = cart.find(item => item._id === product._id);

        if (!exists) {
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Added to cart 🛒");
        } else {
            alert("Already in cart");
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
                <h2 className="fw-bold mb-4">❤️ My Wishlist</h2>

                {wishlist.length === 0 ? (
                    <div className="text-center py-5">
                        <h4>Your wishlist is empty</h4>
                        <button 
                            className="btn mt-3 px-4"
                            style={{
                                background: "#000",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                padding: "12px 24px"
                            }}
                            onClick={() => navigate("/shop")}
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {wishlist.map((item) => {
                            const product = item.productId;
                            if (!product) return null;
                            
                            return (
                            <div key={product._id} className="col-md-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div 
                                        style={{ 
                                            height: "200px", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <img
                                            src={`http://localhost:5000/uploads/${product.images?.[0] || ''}`}
                                            alt={product.name}
                                            style={{
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                objectFit: "contain"
                                            }}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <small className="text-muted">{product.category}</small>
                                        <h6 className="fw-bold mt-1">{product.name}</h6>
                                        <p className="fw-semibold">₹{product.price}</p>
                                        
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn flex-grow-1"
                                                style={{
                                                    background: "#000",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    fontWeight: "600",
                                                    padding: "10px",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onClick={() => addToCart(product)}
                                                onMouseOver={(e) => e.currentTarget.style.background = "#333"}
                                                onMouseOut={(e) => e.currentTarget.style.background = "#000"}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="btn"
                                                style={{
                                                    background: "#fff",
                                                    color: "#000",
                                                    border: "2px solid #000",
                                                    borderRadius: "8px",
                                                    width: "45px",
                                                    height: "45px",
                                                    padding: "0",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "600",
                                                    fontSize: "18px",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onClick={() => removeFromWishlist(product._id)}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = "#f8f9fa";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = "#fff";
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
