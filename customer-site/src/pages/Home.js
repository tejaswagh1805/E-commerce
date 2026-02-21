import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

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
        <div style={{ backgroundColor: "#f8f9fa" }}>

            {/* ================= PREMIUM PRODUCT SLIDER ================= */}
            <section className="py-4 bg-white">
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
                                            background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
                                            borderRadius: "25px",
                                            minHeight: "380px"
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
                                                        background: "#000",
                                                        color: "#fff"
                                                    }}
                                                    onClick={() => navigate(`/product/${item._id}`)}
                                                >
                                                    View Product
                                                </button>

                                                <button
                                                    className="btn px-4 py-2 rounded-pill border"
                                                    style={{
                                                        borderColor: "#000",
                                                        color: "#000"
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
            <section className="py-5">
                <div className="container">

                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Why Choose Us</h2>
                        <p className="text-muted">We deliver excellence in every order</p>
                    </div>

                    <div className="row g-4">

                        <div className="col-md-4">
                            <div
                                className="p-4 bg-white text-center h-100"
                                style={{
                                    borderRadius: "20px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div className="mb-3" style={{ fontSize: "2rem" }}>🚚</div>
                                <h5 className="fw-bold">Fast Delivery</h5>
                                <p className="text-muted">
                                    Lightning fast shipping across India.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="p-4 bg-white text-center h-100"
                                style={{
                                    borderRadius: "20px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div className="mb-3" style={{ fontSize: "2rem" }}>🔐</div>
                                <h5 className="fw-bold">Secure Payments</h5>
                                <p className="text-muted">
                                    Encrypted & safe checkout system.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="p-4 bg-white text-center h-100"
                                style={{
                                    borderRadius: "20px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div className="mb-3" style={{ fontSize: "2rem" }}>⭐</div>
                                <h5 className="fw-bold">Premium Quality</h5>
                                <p className="text-muted">
                                    Handpicked products from trusted brands.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ================= TRENDING PRODUCTS ================= */}
            <section className="py-5 bg-white">
                <div className="container text-center">

                    <h2 className="fw-bold mb-4">Trending Products</h2>

                    <div className="row g-4">
                        {products.length > 0 ? (
                            products.slice(0, 3).map((item) => (
                                <div className="col-md-4" key={item._id}>

                                    <div
                                        className="bg-white p-3 h-100"
                                        style={{
                                            borderRadius: "16px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                        }}
                                    >

                                        {/* IMAGE CONTAINER (Same as Shop) */}
                                        <div
                                            style={{
                                                height: "180px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => navigate(`/product/${item._id}`)}
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

                                        <p className="fw-semibold mb-3">
                                            ₹{item.price}
                                        </p>

                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-outline-dark rounded-pill px-3"
                                                onClick={() => navigate(`/product/${item._id}`)}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="btn btn-dark rounded-pill px-3"
                                                onClick={() => addToCart(item)}
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

            {/* ================= CTA ================= */}
            <section
                className="py-5 text-center"
                style={{
                    background: "#ffffff"
                }}
            >
                <div className="container">

                    <h2 className="fw-bold mb-3">
                        Ready to Upgrade Your Shopping?
                    </h2>

                    <Link
                        to="/shop"
                        className="btn btn-dark btn-lg px-5 rounded-pill shadow"
                    >
                        Explore Collection
                    </Link>

                </div>
            </section>

        </div>
    );
};

export default Home;
