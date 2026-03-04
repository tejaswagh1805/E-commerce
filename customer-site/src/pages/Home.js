import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Newsletter from "../components/Newsletter";

const Home = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const createSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/shop-products");
            const data = await res.json();
            setProducts(data.slice(0, 6));
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const exists = cart.find(item => item._id === product._id);

        if (!exists) {
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product added to cart 🛒");
        } else {
            alert("Product already in cart");
        }
    };

    return (
        <div style={{ backgroundColor: "#fff" }}>

            {/* ================= HERO SECTION ================= */}
            <section style={{ 
                minHeight: "85vh", 
                display: "flex", 
                alignItems: "center",
                background: "#fff",
                borderBottom: "1px solid #e5e5e5"
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 style={{ 
                                fontSize: "3.5rem", 
                                fontWeight: "300",
                                color: "#000",
                                letterSpacing: "-1px",
                                lineHeight: "1.2",
                                marginBottom: "30px"
                            }}>
                                Premium Quality<br/>
                                <span style={{ fontWeight: "700" }}>For Your Baby</span>
                            </h1>
                            <p style={{ 
                                fontSize: "1.1rem", 
                                color: "#666",
                                marginBottom: "40px",
                                lineHeight: "1.8"
                            }}>
                                Discover our curated collection of safe, certified, and premium baby products designed for modern parents.
                            </p>
                            <div className="d-flex gap-3">
                                <Link
                                    to="/shop"
                                    className="btn btn-lg"
                                    style={{
                                        background: "#000",
                                        color: "#fff",
                                        border: "none",
                                        padding: "15px 40px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        fontSize: "14px"
                                    }}
                                >
                                    Shop Now
                                </Link>
                                <Link
                                    to="/shop"
                                    className="btn btn-lg"
                                    style={{
                                        background: "#fff",
                                        color: "#000",
                                        border: "2px solid #000",
                                        padding: "15px 40px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        fontSize: "14px"
                                    }}
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            {products[0] && (
                                <img
                                    src={`http://localhost:5000/uploads/${products[0].images?.[0]}`}
                                    alt="Hero Product"
                                    style={{
                                        maxHeight: "500px",
                                        objectFit: "contain",
                                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-5" style={{ background: "#fafafa" }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4 text-center">
                            <div style={{ fontSize: "2.5rem", marginBottom: "20px" }}>🚚</div>
                            <h5 style={{ fontWeight: "600", color: "#000", marginBottom: "10px" }}>Free Shipping</h5>
                            <p style={{ color: "#666", fontSize: "14px" }}>On orders over ₹999</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div style={{ fontSize: "2.5rem", marginBottom: "20px" }}>✅</div>
                            <h5 style={{ fontWeight: "600", color: "#000", marginBottom: "10px" }}>100% Safe</h5>
                            <p style={{ color: "#666", fontSize: "14px" }}>Certified products</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div style={{ fontSize: "2.5rem", marginBottom: "20px" }}>⭐</div>
                            <h5 style={{ fontWeight: "600", color: "#000", marginBottom: "10px" }}>Premium Quality</h5>
                            <p style={{ color: "#666", fontSize: "14px" }}>Trusted brands</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PRODUCTS GRID ================= */}
            <section className="py-5" style={{ background: "#fff" }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{ 
                            fontSize: "2.5rem", 
                            fontWeight: "300",
                            color: "#000",
                            marginBottom: "15px"
                        }}>
                            Featured <span style={{ fontWeight: "700" }}>Products</span>
                        </h2>
                        <p style={{ color: "#666", fontSize: "1rem" }}>
                            Handpicked collection for your little ones
                        </p>
                    </div>

                    <div className="row g-4">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <div className="col-md-4" key={item._id}>
                                    <div
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #e5e5e5",
                                            padding: "20px",
                                            transition: "0.3s",
                                            cursor: "pointer"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {item.discount > 0 && (
                                            <div style={{
                                                position: "absolute",
                                                top: "20px",
                                                right: "20px",
                                                background: "#000",
                                                color: "#fff",
                                                padding: "5px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}>
                                                -{item.discount}%
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                height: "250px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: "20px"
                                            }}
                                            onClick={() => navigate(`/product/${createSlug(item.name)}`)}
                                        >
                                            <img
                                                src={`http://localhost:5000/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                style={{
                                                    maxHeight: "100%",
                                                    maxWidth: "100%",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </div>

                                        <div style={{ textAlign: "center" }}>
                                            <small style={{ 
                                                color: "#999", 
                                                textTransform: "uppercase",
                                                fontSize: "11px",
                                                letterSpacing: "1px"
                                            }}>
                                                {item.category}
                                            </small>

                                            <h6 style={{ 
                                                fontWeight: "600", 
                                                margin: "10px 0",
                                                color: "#000"
                                            }}>
                                                {item.name}
                                            </h6>

                                            <div style={{ marginBottom: "15px" }}>
                                                <span style={{ 
                                                    fontSize: "1.2rem", 
                                                    fontWeight: "700",
                                                    color: "#000"
                                                }}>
                                                    ₹{item.price}
                                                </span>
                                                {item.discount > 0 && (
                                                    <span style={{ 
                                                        color: "#999", 
                                                        textDecoration: "line-through",
                                                        marginLeft: "10px",
                                                        fontSize: "0.9rem"
                                                    }}>
                                                        ₹{(Number(item.price) / (1 - item.discount / 100)).toFixed(0)}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                style={{
                                                    width: "100%",
                                                    background: "#000",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "12px",
                                                    fontWeight: "600",
                                                    textTransform: "uppercase",
                                                    fontSize: "13px",
                                                    letterSpacing: "1px",
                                                    transition: "0.3s"
                                                }}
                                                onClick={() => addToCart(item)}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "#000"}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Loading products...</p>
                        )}
                    </div>

                    <div className="text-center mt-5">
                        <Link
                            to="/shop"
                            className="btn btn-lg"
                            style={{
                                background: "#fff",
                                color: "#000",
                                border: "2px solid #000",
                                padding: "15px 50px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                fontSize: "14px"
                            }}
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= NEWSLETTER ================= */}
            <Newsletter />

            {/* ================= CTA SECTION ================= */}
            <section
                style={{
                    background: "#000",
                    color: "#fff",
                    padding: "80px 0"
                }}
            >
                <div className="container text-center">
                    <h2 style={{ 
                        fontSize: "2.5rem", 
                        fontWeight: "300",
                        marginBottom: "20px"
                    }}>
                        Ready to <span style={{ fontWeight: "700" }}>Get Started?</span>
                    </h2>
                    <p style={{ 
                        fontSize: "1.1rem", 
                        color: "#ccc",
                        marginBottom: "40px"
                    }}>
                        Shop the best products for your baby today
                    </p>
                    <Link
                        to="/shop"
                        className="btn btn-lg"
                        style={{
                            background: "#fff",
                            color: "#000",
                            border: "none",
                            padding: "15px 50px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontSize: "14px"
                        }}
                    >
                        Explore Collection
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
