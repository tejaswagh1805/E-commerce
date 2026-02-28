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

        const carouselElement = document.getElementById("premiumCarousel");

        if (carouselElement && window.bootstrap) {
            new window.bootstrap.Carousel(carouselElement, {
                interval: 3000,
                ride: "carousel",
                pause: false,
                wrap: true
            });
        }

    }, []);


    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/shop-products");
            const data = await res.json();

            // Show only first 3 products
            setProducts(data.slice(0, 3));
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

            {/* ================= TOP BANNER ================= */}
            <div style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)", padding: "8px 0" }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center text-white">
                        <small>🎉 Free Shipping on Orders Above ₹999</small>
                        <small>📞 Customer Care: 1800-123-4567</small>
                    </div>
                </div>
            </div>

            {/* ================= PREMIUM PRODUCT SLIDER ================= */}
            <section className="py-4" style={{ background: "#FFF5F7" }}>
                <div className="container">

                    <div
                        id="premiumCarousel"
                        className="carousel slide carousel-fade"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner rounded-4 shadow-sm">

                            {products.map((item, index) => (
                                <div
                                    key={item._id}
                                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                                >
                                    <div
                                        className="d-flex align-items-center justify-content-between p-5"
                                        style={{
                                            background: "linear-gradient(135deg, #FFE5EC, #FFF)",
                                            borderRadius: "25px",
                                            minHeight: "380px",
                                            border: "3px solid #FFB6C1"
                                        }}
                                    >

                                        {/* LEFT CONTENT */}
                                        <div style={{ maxWidth: "500px" }}>
                                            <small className="text-muted fw-semibold">
                                                {item.category}
                                            </small>

                                            <h2
                                                className="fw-bold mt-2"
                                                style={{
                                                    fontSize: "2.5rem",
                                                    background: "linear-gradient(90deg, #000, #666)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent"
                                                }}
                                            >
                                                {item.name}
                                            </h2>

                                            <p className="text-secondary mt-3">
                                                Experience premium quality and timeless elegance.
                                            </p>

                                            <h4 className="fw-bold mt-3">
                                                ₹{item.price}
                                            </h4>

                                            <div className="mt-4 d-flex gap-3">
                                                <button
                                                    className="btn px-4 py-2 rounded-pill"
                                                    style={{
                                                        background: "#FF6B9D",
                                                        color: "#fff",
                                                        border: "none",
                                                        fontWeight: "600"
                                                    }}
                                                    onClick={() => navigate(`/product/${createSlug(item.name)}`)}
                                                >
                                                    View Product
                                                </button>

                                                <button
                                                    className="btn px-4 py-2 rounded-pill border"
                                                    style={{
                                                        borderColor: "#FF6B9D",
                                                        color: "#FF6B9D",
                                                        background: "#fff",
                                                        fontWeight: "600"
                                                    }}
                                                    onClick={() => addToCart(item)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>

                                        {/* RIGHT IMAGE */}
                                        <div
                                            className="text-center"
                                            style={{
                                                flex: 1
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:5000/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                style={{
                                                    maxHeight: "280px",
                                                    objectFit: "contain",
                                                    filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
                                                    transition: "0.4s"
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Controls */}
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#premiumCarousel"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon"></span>
                        </button>

                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#premiumCarousel"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>

                </div>
            </section>


            {/* ================= FEATURES ================= */}
            <section className="py-5" style={{ background: "#FFF" }}>
                <div className="container">

                    <div className="text-center mb-5">
                        <h2 className="fw-bold" style={{ color: "#FF6B9D" }}>Why Parents Love Us 👶</h2>
                        <p className="text-muted">Safe, Quality Products for Your Little Ones</p>
                    </div>

                    <div className="row g-4">

                        <div className="col-md-4">
                            <div
                                className="p-4 text-center h-100"
                                style={{
                                    borderRadius: "20px",
                                    background: "linear-gradient(135deg, #FFE5EC, #FFF)",
                                    border: "2px solid #FFB6C1"
                                }}
                            >
                                <div className="mb-3" style={{ fontSize: "3rem" }}>🚚</div>
                                <h5 className="fw-bold" style={{ color: "#FF6B9D" }}>Fast Delivery</h5>
                                <p className="text-muted">
                                    Quick delivery for your baby's needs.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="p-4 text-center h-100"
                                style={{
                                    borderRadius: "20px",
                                    background: "linear-gradient(135deg, #E0F7FA, #FFF)",
                                    border: "2px solid #80DEEA"
                                }}
                            >
                                <div className="mb-3" style={{ fontSize: "3rem" }}>✅</div>
                                <h5 className="fw-bold" style={{ color: "#00ACC1" }}>100% Safe</h5>
                                <p className="text-muted">
                                    Certified & tested baby products.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="p-4 text-center h-100"
                                style={{
                                    borderRadius: "20px",
                                    background: "linear-gradient(135deg, #FFF9C4, #FFF)",
                                    border: "2px solid #FFD54F"
                                }}
                            >
                                <div className="mb-3" style={{ fontSize: "3rem" }}>⭐</div>
                                <h5 className="fw-bold" style={{ color: "#FFA000" }}>Premium Quality</h5>
                                <p className="text-muted">
                                    Trusted brands for your baby.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ================= TRENDING PRODUCTS ================= */}
            <section className="py-5" style={{ background: "#FFF5F7" }}>
                <div className="container text-center">

                    <h2 className="fw-bold mb-4" style={{ color: "#FF6B9D" }}>Trending Baby Products 🎀</h2>

                    <div className="row g-4">
                        {products.length > 0 ? (
                            products.slice(0, 3).map((item) => (
                                <div className="col-md-4" key={item._id}>

                                    <div
                                        className="bg-white p-3 h-100"
                                        style={{
                                            borderRadius: "16px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                            position: "relative"
                                        }}
                                    >

                                        {/* Discount Badge */}
                                        {item.discount > 0 && (
                                            <div style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                                background: "#ff6b9d",
                                                color: "#fff",
                                                padding: "4px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                zIndex: 1
                                            }}>
                                                {item.discount}% OFF
                                            </div>
                                        )}

                                        {/* IMAGE CONTAINER (Same as Shop) */}
                                        <div
                                            style={{
                                                height: "180px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer"
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

                                        <small className="text-muted">
                                            {item.category}
                                        </small>

                                        <h6 className="fw-bold mt-1">
                                            {item.name}
                                        </h6>

                                        <div className="d-flex align-items-center gap-2">
                                            <p className="fw-semibold mb-0">
                                                ₹{item.price}
                                            </p>
                                            {item.discount > 0 && (
                                                <p className="text-muted text-decoration-line-through mb-0" style={{ fontSize: "14px" }}>
                                                    ₹{(Number(item.price) / (1 - item.discount / 100)).toFixed(0)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="d-flex gap-2 justify-content-center mt-3">
                                            <button
                                                className="btn px-3"
                                                style={{
                                                    background: "#fff",
                                                    color: "#FF6B9D",
                                                    border: "2px solid #FF6B9D",
                                                    borderRadius: "20px",
                                                    fontWeight: "600",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onClick={() => navigate(`/product/${createSlug(item.name)}`)}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = "#FFF5F7";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = "#fff";
                                                }}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="btn px-3"
                                                style={{
                                                    background: "#FF6B9D",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "20px",
                                                    fontWeight: "600",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onClick={() => addToCart(item)}
                                                onMouseOver={(e) => e.currentTarget.style.background = "#E55A8A"}
                                                onMouseOut={(e) => e.currentTarget.style.background = "#FF6B9D"}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            ))
                        ) : (
                            <p>Loading products...</p>
                        )}
                    </div>

                </div>
            </section>

            {/* ================= NEWSLETTER ================= */}
            <Newsletter />

            {/* ================= CTA ================= */}
            <section
                className="py-5 text-center"
                style={{
                    background: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)",
                    color: "#fff"
                }}
            >
                <div className="container">

                    <h2 className="fw-bold mb-3">
                        🎉 Shop the Best for Your Baby!
                    </h2>

                    <Link
                        to="/shop"
                        className="btn btn-lg px-5 rounded-pill shadow"
                        style={{
                            background: "#fff",
                            color: "#FF6B9D",
                            border: "none",
                            fontWeight: "600"
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
