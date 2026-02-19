import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

const SingleProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [activeImage, setActiveImage] = useState(0);
    const [showDrawer, setShowDrawer] = useState(false);

    const { addToCart } = useContext(CartContext);

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

        setShowDrawer(true); // 🔥 OPEN DRAWER
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
            <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
                <div className="container py-5">

                    <div className="row align-items-center">

                        {/* IMAGE SECTION */}
                        <div className="col-md-6 mb-4">
                            <div className="bg-white p-4 shadow-sm rounded-4 text-center">

                                <img
                                    src={`http://localhost:5000/uploads/${product.images?.[activeImage]}`}
                                    alt={product.name}
                                    style={{
                                        maxHeight: "400px",
                                        objectFit: "contain",
                                        width: "100%"
                                    }}
                                />

                                {/* THUMBNAILS */}
                                {product.images?.length > 1 && (
                                    <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                                        {product.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={`http://localhost:5000/uploads/${img}`}
                                                alt="thumb"
                                                onClick={() => setActiveImage(index)}
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    objectFit: "contain",
                                                    borderRadius: "10px",
                                                    cursor: "pointer",
                                                    border: activeImage === index
                                                        ? "2px solid #000"
                                                        : "2px solid #eee",
                                                    padding: "5px",
                                                    background: "#fff"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="col-md-6">
                            <div className="bg-white p-4 shadow-sm rounded-4">

                                <small className="text-muted">
                                    {product.category}
                                </small>

                                <h2 className="fw-bold mt-2">
                                    {product.name}
                                </h2>

                                <h3 className="fw-bold mt-3">
                                    ₹{product.price}
                                </h3>

                                <p className="mt-3 text-muted">
                                    Premium quality product crafted with excellence.
                                </p>

                                {/* Quantity */}
                                <div className="d-flex align-items-center gap-3 mt-4">
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    >
                                        −
                                    </button>

                                    <span className="fw-bold fs-5">
                                        {quantity}
                                    </span>

                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="btn w-100 mt-4 text-white"
                                    style={{
                                        background: "linear-gradient(135deg, #000, #434343)",
                                        borderRadius: "30px",
                                        padding: "12px"
                                    }}
                                    onClick={handleAddToCart}
                                >
                                    🛒 Add to Cart
                                </button>

                            </div>
                        </div>

                    </div>

                    {/* ================= TABS SECTION ================= */}
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
                                    Reviews (2)
                                </button>
                            </li>
                        </ul>

                        {activeTab === "description" && (
                            <p>
                                {product.description ||
                                    "High-quality product designed for performance."}
                            </p>
                        )}

                        {activeTab === "reviews" && (
                            <>
                                <div className="mb-3">
                                    <strong>⭐️⭐️⭐️⭐️⭐️ John Doe</strong>
                                    <p className="text-muted">
                                        Amazing quality and fast delivery.
                                    </p>
                                </div>

                                <div>
                                    <strong>⭐️⭐️⭐️⭐️ Sarah</strong>
                                    <p className="text-muted">
                                        Worth every penny.
                                    </p>
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
                                            className="bg-white p-3 shadow-sm rounded-4 h-100"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigate(`/product/${item._id}`)}
                                        >
                                            <img
                                                src={`http://localhost:5000/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                className="img-fluid mb-2"
                                                style={{
                                                    height: "150px",
                                                    objectFit: "contain"
                                                }}
                                            />

                                            <h6 className="fw-semibold">
                                                {item.name}
                                            </h6>

                                            <p className="fw-bold">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* 🔥 CART DRAWER */}
            <CartDrawer
                show={showDrawer}
                onClose={() => setShowDrawer(false)}
            />
        </>
    );
};

export default SingleProduct;
