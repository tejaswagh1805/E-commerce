import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [activeImage, setActiveImage] = useState(0);
    const [showDrawer, setShowDrawer] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        const res = await fetch(`http://localhost:5000/shop-product/${id}`);
        const data = await res.json();
        setProduct(data);
        setActiveImage(0);

        const allProductsRes = await fetch(`http://localhost:5000/shop-products`);
        const allProducts = await allProductsRes.json();

        const related = allProducts.filter(
            item => item.category === data.category && item._id !== data._id
        );

        setRelatedProducts(related.slice(0, 4));
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setShowDrawer(true);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate("/checkout");
    };

    if (!product) {
        return (
            <div className="container py-5 text-center">
                <h5>Loading Product...</h5>
            </div>
        );
    }

    return (
        <>
            <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
                <div className="container py-5">

                    {/* ================= PRODUCT SECTION ================= */}
                    <div className="row g-5">

                        {/* IMAGE GALLERY */}
                        <div className="col-lg-6">
                            <div className="bg-white p-4 rounded-4 shadow-sm">

                                <div
                                    style={{
                                        overflow: "hidden",
                                        borderRadius: "20px"
                                    }}
                                >
                                    <img
                                        src={`http://localhost:5000/uploads/${product.images?.[activeImage]}`}
                                        alt={product.name}
                                        className="img-fluid"
                                        style={{
                                            transition: "0.4s",
                                            cursor: "zoom-in"
                                        }}
                                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                                        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                                    />
                                </div>

                                {product.images?.length > 1 && (
                                    <div className="d-flex gap-3 mt-4 flex-wrap">
                                        {product.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={`http://localhost:5000/uploads/${img}`}
                                                alt="thumb"
                                                onClick={() => setActiveImage(index)}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "contain",
                                                    borderRadius: "15px",
                                                    cursor: "pointer",
                                                    border: activeImage === index
                                                        ? "2px solid #000"
                                                        : "2px solid #eee",
                                                    padding: "6px",
                                                    background: "#fff"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* DETAILS / BUY BOX */}
                        <div className="col-lg-6">
                            <div
                                className="bg-white p-4 rounded-4 shadow-sm"
                                style={{ position: "sticky", top: "100px" }}
                            >

                                <small className="text-uppercase text-muted fw-semibold">
                                    {product.category}
                                </small>

                                <h2 className="fw-bold mt-2">{product.name}</h2>

                                {/* Rating */}
                                <div className="mb-2 text-warning">
                                    ⭐⭐⭐⭐☆ <span className="text-muted">(245 ratings)</span>
                                </div>

                                {/* Price */}
                                <h3 className="mt-3">
                                    <span className="text-danger fw-bold">
                                        ₹{product.price}
                                    </span>
                                    <span className="text-muted text-decoration-line-through ms-2">
                                        ₹{product.price + 500}
                                    </span>
                                </h3>

                                <p className="text-success fw-semibold">In Stock</p>

                                <hr />

                                <ul className="text-muted">
                                    <li>Premium Quality Material</li>
                                    <li>1 Year Warranty</li>
                                    <li>Easy Returns</li>
                                    <li>Fast & Secure Delivery</li>
                                </ul>

                                {/* Quantity */}
                                <div className="d-flex align-items-center gap-3 mt-4">
                                    <button
                                        className="btn btn-outline-dark rounded-circle"
                                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    >−</button>

                                    <span className="fw-bold fs-5">{quantity}</span>

                                    <button
                                        className="btn btn-outline-dark rounded-circle"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >+</button>
                                </div>

                                {/* Buttons */}
                                <div className="mt-4 d-flex gap-3">

                                    {/* Add To Cart */}
                                    <button
                                        className="btn add-cart-btn"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart
                                    </button>

                                    {/* Buy Now */}
                                    <button
                                        className="btn buy-now-btn"
                                        onClick={handleBuyNow}
                                    >
                                        Buy Now
                                    </button>

                                </div>

                                <div className="mt-4 p-3 bg-light rounded-3">
                                    <p className="mb-1">🚚 Free Delivery by Tomorrow</p>
                                    <p className="mb-0">🔒 100% Secure Payment</p>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* ================= TABS ================= */}
                    <div className="mt-5 bg-white p-4 shadow-sm rounded-4">
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                                    onClick={() => setActiveTab("description")}
                                >
                                    Description
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    Reviews
                                </button>
                            </li>
                        </ul>

                        {activeTab === "description" && (
                            <p>
                                {product.description ||
                                    "High-quality premium product designed for performance and durability."}
                            </p>
                        )}

                        {activeTab === "reviews" && (
                            <>
                                <div className="mb-3">
                                    <strong>⭐⭐⭐⭐⭐ John</strong>
                                    <p className="text-muted">Amazing product quality.</p>
                                </div>
                                <div>
                                    <strong>⭐⭐⭐⭐ Sarah</strong>
                                    <p className="text-muted">Worth every penny.</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ================= RELATED PRODUCTS ================= */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-5">
                            <h4 className="fw-bold mb-4">Related Products</h4>
                            <div className="row g-4">
                                {relatedProducts.map(item => (
                                    <div key={item._id} className="col-md-3">
                                        <div
                                            className="bg-white p-3 rounded-4 h-100"
                                            style={{
                                                cursor: "pointer",
                                                transition: "0.3s",
                                                boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
                                            }}
                                            onClick={() => navigate(`/product/${item._id}`)}
                                            onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
                                            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                                        >
                                            <img
                                                src={`http://localhost:5000/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                className="img-fluid mb-2"
                                                style={{ height: "150px", objectFit: "contain" }}
                                            />
                                            <h6 className="fw-semibold">{item.name}</h6>
                                            <p className="fw-bold text-danger">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <CartDrawer
                show={showDrawer}
                onClose={() => setShowDrawer(false)}
            />
        </>
    );
};

export default SingleProduct;