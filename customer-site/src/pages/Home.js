import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://172.16.60.17:5000/shop-products");
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

            {/* ================= HERO SECTION ================= */}
            <section
                className="d-flex align-items-center"
                style={{
                    minHeight: "90vh",
                    background: "#ffffff"
                }}
            >
                <div className="container text-center">

                    <h1
                        className="fw-bold"
                        style={{
                            fontSize: "3.2rem",
                            background: "linear-gradient(90deg, #000, #555)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        Discover Premium Shopping Experience
                    </h1>

                    <p
                        className="mt-4 mb-4 text-secondary"
                        style={{
                            maxWidth: "600px",
                            margin: "0 auto",
                            fontSize: "1.1rem"
                        }}
                    >
                        Elegant products, seamless checkout, and fast delivery —
                        crafted for modern shoppers.
                    </p>

                    <Link
                        to="/shop"
                        className="btn btn-lg px-5 py-3 fw-semibold shadow"
                        style={{
                            borderRadius: "50px",
                            background: "linear-gradient(90deg, #000, #444)",
                            color: "#fff",
                            border: "none",
                            transition: "0.3s"
                        }}
                    >
                        Start Shopping →
                    </Link>

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
                                                src={`http://172.16.60.17:5000/uploads/${item.images?.[0]}`}
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
