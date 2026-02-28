import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleProduct = () => {

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const { id } = useParams();

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
        const storedData = JSON.parse(localStorage.getItem("user"));
        if (!storedData) return;

        const result = await fetch(
            `http://localhost:5000/product/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${storedData.auth}`
                }
            }
        );

        const data = await result.json();
        setProduct(data);

        if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
        }
        
        if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
        
        if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
        }
    };

    if (!product) return <h4 className="text-center mt-5">Loading...</h4>;

    // Clean price - extract only the first valid number
    const cleanPrice = String(product.price).match(/^\d+/)?.[0] || product.price;
    const discountedPrice = product.discount > 0 
        ? (Number(cleanPrice) - (Number(cleanPrice) * Number(product.discount) / 100)).toFixed(2)
        : Number(cleanPrice).toFixed(2);

    return (
        <div className="container py-4">

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><a href="/" style={{ color: "#ff6b9d", textDecoration: "none" }}>Home</a></li>
                    <li className="breadcrumb-item"><a href="/products" style={{ color: "#ff6b9d", textDecoration: "none" }}>{product.category}</a></li>
                    <li className="breadcrumb-item active">{product.name}</li>
                </ol>
            </nav>

            <div className="row">

                {/* LEFT - IMAGE GALLERY */}
                <div className="col-lg-5 mb-4">

                    <div className="card border-0 shadow-sm rounded-3 p-3 mb-3">
                        <img
                            src={`http://localhost:5000/uploads/${selectedImage}`}
                            alt="product"
                            className="img-fluid"
                            style={{
                                maxHeight: "500px",
                                objectFit: "contain",
                                width: "100%"
                            }}
                        />
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="d-flex gap-2 flex-wrap">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000/uploads/${img}`}
                                    alt="thumb"
                                    onClick={() => setSelectedImage(img)}
                                    className="img-thumbnail"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        border: selectedImage === img ? "2px solid #ff6b9d" : "1px solid #ddd"
                                    }}
                                />
                            ))}
                        </div>
                    )}

                </div>

                {/* RIGHT - PRODUCT DETAILS */}
                <div className="col-lg-7">

                    <div className="mb-2">
                        {product.brand && (
                            <span className="badge bg-light text-dark border me-2">{product.brand}</span>
                        )}
                        {product.sku && (
                            <span className="text-muted small">SKU: {product.sku}</span>
                        )}
                    </div>

                    <h2 className="fw-bold mb-3">{product.name}</h2>

                    {/* Rating */}
                    <div className="d-flex align-items-center mb-3">
                        <div className="text-warning me-2">
                            {"★".repeat(Math.floor(product.rating || 4))}
                            {"☆".repeat(5 - Math.floor(product.rating || 4))}
                        </div>
                        <span className="text-muted small">({product.reviews?.length || 0} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <h3 className="fw-bold d-inline" style={{ color: "#ff6b9d" }}>
                            ₹{discountedPrice}
                        </h3>
                        {product.discount > 0 && (
                            <>
                                <span className="text-muted text-decoration-line-through ms-3">₹{Number(cleanPrice).toFixed(2)}</span>
                                <span className="badge bg-success ms-2">{product.discount}% OFF</span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="mb-4">
                            <h6 className="fw-semibold mb-2">Product Description</h6>
                            <p className="text-muted">{product.description}</p>
                        </div>
                    )}

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-semibold mb-2">Select Size</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`btn ${selectedSize === size ? 'btn-dark' : 'btn-outline-secondary'}`}
                                        style={{
                                            minWidth: "50px",
                                            borderRadius: "8px"
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
                        <div className="mb-4">
                            <h6 className="fw-semibold mb-2">Select Color</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`btn ${selectedColor === color ? 'btn-dark' : 'btn-outline-secondary'}`}
                                        style={{
                                            borderRadius: "8px",
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

                    {/* Stock Status */}
                    {product.stock !== undefined && (
                        <div className="mb-3">
                            {product.stock > 0 ? (
                                <span className="badge bg-success">✓ In Stock ({product.stock} available)</span>
                            ) : (
                                <span className="badge bg-danger">✗ Out of Stock</span>
                            )}
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="mb-4">
                        <h6 className="fw-semibold mb-2">Quantity</h6>
                        <div className="d-flex align-items-center gap-3">
                            <div className="btn-group" role="group">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                    style={{ width: "40px" }}
                                >
                                    −
                                </button>
                                <button className="btn btn-outline-secondary" style={{ width: "60px", pointerEvents: "none" }}>
                                    {quantity}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ width: "40px" }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-3 mb-4">
                        <button 
                            className="btn btn-lg fw-bold flex-grow-1"
                            style={{
                                background: "#ff6b9d",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px"
                            }}
                        >
                            🛒 Add to Cart
                        </button>
                        <button 
                            className="btn btn-lg btn-outline-secondary"
                            style={{ borderRadius: "8px" }}
                        >
                            ❤️
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="card border-0 bg-light p-3 rounded-3">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <span className="me-2">🚚</span>
                                    <small className="text-muted">Free Delivery</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <span className="me-2">🔄</span>
                                    <small className="text-muted">Easy Returns</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <span className="me-2">✓</span>
                                    <small className="text-muted">Quality Assured</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <span className="me-2">💳</span>
                                    <small className="text-muted">Secure Payment</small>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Product Details Tabs */}
            <div className="mt-5">
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#details">Product Details</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#reviews">Reviews ({product.reviews?.length || 0})</a>
                    </li>
                </ul>

                <div className="tab-content p-4 border border-top-0 rounded-bottom">
                    <div id="details" className="tab-pane fade show active">
                        <h6 className="fw-semibold mb-3">Specifications</h6>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="text-muted" style={{ width: "200px" }}>Brand</td>
                                    <td className="fw-semibold">{product.brand || product.company || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Category</td>
                                    <td className="fw-semibold">{product.category}</td>
                                </tr>
                                {product.sku && (
                                    <tr>
                                        <td className="text-muted">SKU</td>
                                        <td className="fw-semibold">{product.sku}</td>
                                    </tr>
                                )}
                                {product.sizes && product.sizes.length > 0 && (
                                    <tr>
                                        <td className="text-muted">Available Sizes</td>
                                        <td className="fw-semibold">{product.sizes.join(", ")}</td>
                                    </tr>
                                )}
                                {product.colors && product.colors.length > 0 && (
                                    <tr>
                                        <td className="text-muted">Available Colors</td>
                                        <td className="fw-semibold">{product.colors.join(", ")}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div id="reviews" className="tab-pane fade">
                        <h6 className="fw-semibold mb-3">Customer Reviews</h6>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, idx) => (
                                <div key={idx} className="mb-3 pb-3 border-bottom">
                                    <div className="d-flex justify-content-between mb-2">
                                        <strong>{review.userName}</strong>
                                        <div className="text-warning">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SingleProduct;
