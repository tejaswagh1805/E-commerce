import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import ProductReviews from "../components/ProductReviews";
import Recommendations from "../components/Recommendations";
import RecentlyViewed from "../components/RecentlyViewed";
import axios from "axios";

const SingleProduct = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [activeImage, setActiveImage] = useState(0);
    const [showDrawer, setShowDrawer] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // Helper function to create URL-friendly slug
    const createSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        fetchProduct();
        saveToRecentlyViewed();
    }, [slug]);

    const fetchProduct = async () => {
        const res = await fetch(`http://localhost:5000/shop-products`);
        const allProducts = await res.json();
        
        // Find product by matching slug
        const data = allProducts.find(p => createSlug(p.name) === slug);
        
        if (!data) {
            navigate('/shop');
            return;
        }
        
        setProduct(data);
        setActiveImage(0);
        
        if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
        }

        const related = allProducts.filter(
            item => item.category === data.category && item._id !== data._id
        );

        setRelatedProducts(related.slice(0, 4));
    };

    const saveToRecentlyViewed = async () => {
        const res = await fetch(`http://localhost:5000/shop-products`);
        const allProducts = await res.json();
        const data = allProducts.find(p => createSlug(p.name) === slug);
        
        if (!data) return;
        
        let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        viewed = viewed.filter(p => p._id !== data._id);
        viewed.unshift(data);
        viewed = viewed.slice(0, 10);
        localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    };

    const toggleWishlist = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        
        if (!user || !token) {
            alert("Please login to add to wishlist");
            navigate("/login");
            return;
        }

        try {
            if (inWishlist) {
                await axios.delete(`http://localhost:5000/wishlist/remove/${product._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInWishlist(false);
                alert("Removed from wishlist");
            } else {
                await axios.post(
                    "http://localhost:5000/wishlist/add",
                    { productId: product._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setInWishlist(true);
                alert("Added to wishlist ❤️");
            }
        } catch (error) {
            console.error("Wishlist error:", error);
        }
    };

    const handleAddToCart = () => {
        // Validate size selection if product has sizes
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert("Please select a size");
            return;
        }
        
        // Validate color selection if product has colors
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert("Please select a color");
            return;
        }
        
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedSize, selectedColor);
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
            <div style={{ background: "#fff", minHeight: "100vh" }}>
                <div className="container py-4">

                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" style={{ color: "#ff6b9d", textDecoration: "none" }}>Home</a></li>
                            <li className="breadcrumb-item"><a href="/shop" style={{ color: "#ff6b9d", textDecoration: "none" }}>Shop</a></li>
                            <li className="breadcrumb-item active">{product.name}</li>
                        </ol>
                    </nav>

                    {/* ================= PRODUCT SECTION ================= */}
                    <div className="row g-4">

                        {/* IMAGE GALLERY */}
                        <div className="col-lg-5">
                            <div className="bg-white p-3" style={{ border: "1px solid #f0f0f0", borderRadius: "12px" }}>

                                <div style={{ background: "#fafafa", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                                    <img
                                        src={`http://localhost:5000/uploads/${product.images?.[activeImage]}`}
                                        alt={product.name}
                                        className="img-fluid"
                                        style={{
                                            maxHeight: "450px",
                                            objectFit: "contain",
                                            width: "100%"
                                        }}
                                    />
                                </div>

                                {product.images?.length > 1 && (
                                    <div className="d-flex gap-2 mt-3 justify-content-center">
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
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    border: activeImage === index ? "2px solid #ff6b9d" : "1px solid #e0e0e0",
                                                    padding: "5px",
                                                    background: "#fafafa"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* DETAILS / BUY BOX */}
                        <div className="col-lg-7">
                            <div className="ps-lg-4">

                                {product.brand && (
                                    <div className="mb-2">
                                        <span style={{ color: "#ff6b9d", fontWeight: "600", fontSize: "14px" }}>{product.brand}</span>
                                    </div>
                                )}

                                <h1 className="fw-bold" style={{ fontSize: "24px", marginBottom: "12px" }}>{product.name}</h1>

                                <div className="mb-2">
                                    <span className="badge" style={{ background: "#f0f0f0", color: "#666", fontWeight: "500", padding: "6px 12px" }}>
                                        {product.category}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    {product.rating > 0 ? (
                                        <>
                                            <div className="d-flex align-items-center" style={{ background: "#388e3c", color: "#fff", padding: "4px 10px", borderRadius: "4px", fontSize: "14px" }}>
                                                <span>{product.rating.toFixed(1)}</span>
                                                <span className="ms-1">★</span>
                                            </div>
                                            <span style={{ color: "#878787", fontSize: "14px" }}>
                                                {product.reviews?.length || 0} Ratings
                                            </span>
                                        </>
                                    ) : (
                                        <span style={{ color: "#878787", fontSize: "14px" }}>No ratings yet</span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <h2 className="fw-bold mb-0" style={{ fontSize: "28px", color: "#212121" }}>
                                            ₹{product.price}
                                        </h2>
                                        {product.discount > 0 && (
                                            <>
                                                <span style={{ color: "#878787", textDecoration: "line-through", fontSize: "18px" }}>
                                                    ₹{(Number(product.price) / (1 - product.discount / 100)).toFixed(0)}
                                                </span>
                                                <span style={{ color: "#388e3c", fontWeight: "600", fontSize: "16px" }}>
                                                    {product.discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <p style={{ color: "#878787", fontSize: "13px", marginBottom: "0" }}>inclusive of all taxes</p>
                                </div>

                                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginBottom: "16px" }}>

                                {/* Size Selection */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="fw-semibold mb-2" style={{ fontSize: "14px", color: "#212121" }}>SELECT SIZE</h6>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    className="btn"
                                                    style={{
                                                        minWidth: "50px",
                                                        padding: "8px 16px",
                                                        border: selectedSize === size ? "2px solid #ff6b9d" : "1px solid #d4d5d9",
                                                        borderRadius: "50px",
                                                        background: selectedSize === size ? "#fff5f8" : "#fff",
                                                        color: selectedSize === size ? "#ff6b9d" : "#282c3f",
                                                        fontWeight: "600",
                                                        fontSize: "14px"
                                                    }}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="fw-semibold mb-2" style={{ fontSize: "14px", color: "#212121" }}>SELECT COLOR</h6>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    className="btn"
                                                    style={{
                                                        padding: "8px 16px",
                                                        border: selectedColor === color ? "2px solid #ff6b9d" : "1px solid #d4d5d9",
                                                        borderRadius: "50px",
                                                        background: selectedColor === color ? "#fff5f8" : "#fff",
                                                        color: selectedColor === color ? "#ff6b9d" : "#282c3f",
                                                        fontWeight: "600",
                                                        fontSize: "14px",
                                                        minWidth: "80px"
                                                    }}
                                                    onClick={() => setSelectedColor(color)}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="mb-3" style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                                        <h6 className="fw-semibold mb-2" style={{ fontSize: "14px", color: "#212121" }}>PRODUCT DETAILS</h6>
                                        <p style={{ color: "#282c3f", fontSize: "14px", lineHeight: "1.6" }}>{product.description}</p>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="mb-3" style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <span style={{ fontSize: "18px" }}>🚚</span>
                                                <span style={{ fontSize: "13px", color: "#282c3f" }}>Free Delivery</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <span style={{ fontSize: "18px" }}>🔄</span>
                                                <span style={{ fontSize: "13px", color: "#282c3f" }}>Easy Returns</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <span style={{ fontSize: "18px" }}>🔒</span>
                                                <span style={{ fontSize: "13px", color: "#282c3f" }}>Secure Payment</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <span style={{ fontSize: "18px" }}>✅</span>
                                                <span style={{ fontSize: "13px", color: "#282c3f" }}>Quality Assured</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity & Buttons */}
                                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "20px" }}>
                                    
                                    {/* Stock Status */}
                                    {product.stock > 0 ? (
                                        <div className="mb-3">
                                            <span style={{ color: "#03a685", fontWeight: "600", fontSize: "14px" }}>
                                                ✓ In Stock ({product.stock} available)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                            <span style={{ color: "#ff5722", fontWeight: "600", fontSize: "14px" }}>
                                                ✗ Out of Stock
                                            </span>
                                        </div>
                                    )}

                                    {/* Quantity Selector */}
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#212121" }}>Quantity:</span>
                                        <div className="d-flex align-items-center" style={{ border: "1px solid #d4d5d9", borderRadius: "4px" }}>
                                            <button
                                                className="btn"
                                                style={{ border: "none", padding: "6px 12px", fontSize: "18px", color: "#282c3f" }}
                                                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                            >−</button>
                                            <span style={{ padding: "0 16px", fontWeight: "600", fontSize: "16px" }}>{quantity}</span>
                                            <button
                                                className="btn"
                                                style={{ border: "none", padding: "6px 12px", fontSize: "18px", color: "#282c3f" }}
                                                onClick={() => setQuantity(quantity + 1)}
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2 mb-3">
                                        <button
                                            className="btn flex-grow-1"
                                            style={{
                                                background: "#ff6b9d",
                                                color: "#fff",
                                                border: "none",
                                                padding: "14px 24px",
                                                borderRadius: "4px",
                                                fontWeight: "700",
                                                fontSize: "14px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px"
                                            }}
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
                                        </button>

                                        <button
                                            className="btn"
                                            onClick={toggleWishlist}
                                            style={{
                                                width: "50px",
                                                background: inWishlist ? "#ff6b9d" : "#fff",
                                                color: inWishlist ? "#fff" : "#282c3f",
                                                border: "1px solid #d4d5d9",
                                                borderRadius: "4px",
                                                fontSize: "20px",
                                                padding: "0"
                                            }}
                                        >
                                            {inWishlist ? "❤️" : "🤍"}
                                        </button>
                                    </div>

                                    <button
                                        className="btn w-100"
                                        style={{
                                            background: "#fff",
                                            color: "#ff6b9d",
                                            border: "2px solid #ff6b9d",
                                            padding: "14px 24px",
                                            borderRadius: "4px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px"
                                        }}
                                        onClick={handleBuyNow}
                                        disabled={product.stock === 0}
                                    >
                                        ⚡ Buy Now
                                    </button>

                                </div>

                            </div>
                        </div>

                    </div>

                    {/* ================= TABS ================= */}
                    <div className="mt-4 bg-white" style={{ border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px" }}>
                        <ul className="nav nav-tabs border-0 mb-3">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "description" ? "" : ""}`}
                                    style={{
                                        border: "none",
                                        borderBottom: activeTab === "description" ? "3px solid #ff6b9d" : "3px solid transparent",
                                        color: activeTab === "description" ? "#ff6b9d" : "#878787",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "12px 24px",
                                        background: "transparent"
                                    }}
                                    onClick={() => setActiveTab("description")}
                                >
                                    DESCRIPTION
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "reviews" ? "" : ""}`}
                                    style={{
                                        border: "none",
                                        borderBottom: activeTab === "reviews" ? "3px solid #ff6b9d" : "3px solid transparent",
                                        color: activeTab === "reviews" ? "#ff6b9d" : "#878787",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "12px 24px",
                                        background: "transparent"
                                    }}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    REVIEWS ({product.reviews?.length || 0})
                                </button>
                            </li>
                        </ul>

                        {activeTab === "description" && (
                            <div style={{ padding: "16px 0" }}>
                                <p style={{ color: "#282c3f", fontSize: "14px", lineHeight: "1.8" }}>
                                    {product.description || "High-quality premium product designed for performance and durability."}
                                </p>
                                {product.brand && (
                                    <div className="mt-3">
                                        <strong style={{ fontSize: "14px", color: "#212121" }}>Brand: </strong>
                                        <span style={{ fontSize: "14px", color: "#282c3f" }}>{product.brand}</span>
                                    </div>
                                )}
                                {product.sku && (
                                    <div className="mt-2">
                                        <strong style={{ fontSize: "14px", color: "#212121" }}>SKU: </strong>
                                        <span style={{ fontSize: "14px", color: "#282c3f" }}>{product.sku}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <ProductReviews 
                                productId={product._id} 
                                reviews={product.reviews || []} 
                                onReviewAdded={fetchProduct}
                            />
                        )}
                    </div>

                    {/* ================= RELATED PRODUCTS ================= */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-4">
                            <h5 className="fw-bold mb-3" style={{ fontSize: "18px", color: "#212121" }}>Similar Products</h5>
                            <div className="row g-3">
                                {relatedProducts.map(item => (
                                    <div key={item._id} className="col-6 col-md-3">
                                        <div
                                            className="bg-white h-100"
                                            style={{
                                                cursor: "pointer",
                                                transition: "0.3s",
                                                border: "1px solid #f0f0f0",
                                                borderRadius: "12px",
                                                padding: "12px"
                                            }}
                                            onClick={() => navigate(`/product/${createSlug(item.name)}`)}
                                        >
                                            <div style={{ background: "#fafafa", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                                                <img
                                                    src={`http://localhost:5000/uploads/${item.images?.[0]}`}
                                                    alt={item.name}
                                                    className="img-fluid"
                                                    style={{ height: "140px", objectFit: "contain" }}
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <h6 className="fw-semibold" style={{ fontSize: "13px", color: "#282c3f", marginBottom: "4px" }}>{item.name}</h6>
                                                <p className="fw-bold mb-0" style={{ fontSize: "15px", color: "#212121" }}>₹{item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= RECOMMENDATIONS ================= */}
                    <Recommendations category={product.category} currentProductId={product._id} />

                    {/* ================= RECENTLY VIEWED ================= */}
                    <RecentlyViewed currentProductId={product._id} />

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