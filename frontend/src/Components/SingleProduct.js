import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleProduct = () => {

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);

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
    };

    if (!product) return <h4 className="text-center mt-5">Loading...</h4>;

    return (
        <div className="container py-5">

            {/* Breadcrumb */}
            <div className="mb-4 small text-muted">
                Home / {product.category} /{" "}
                <span className="text-dark">{product.name}</span>
            </div>

            <div className="row align-items-start">

                {/* LEFT - IMAGE SECTION */}
                <div className="col-lg-6 mb-4">

                    <div className="border rounded-4 p-3 text-center">

                        <img
                            src={`http://localhost:5000/uploads/${selectedImage}`}
                            alt="product"
                            className="img-fluid"
                            style={{
                                maxHeight: "450px",
                                objectFit: "contain"
                            }}
                        />

                    </div>

                    {/* Thumbnail Row */}
                    {product.images && product.images.length > 1 && (
                        <div className="d-flex gap-3 mt-3 flex-wrap">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000/uploads/${img}`}
                                    alt="thumb"
                                    onClick={() => setSelectedImage(img)}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "12px",
                                        border:
                                            selectedImage === img
                                                ? "2px solid #000"
                                                : "1px solid #ddd"
                                    }}
                                />
                            ))}
                        </div>
                    )}

                </div>

                {/* RIGHT - DETAILS */}
                <div className="col-lg-6">

                    <h2 className="fw-bold mb-3">{product.name}</h2>

                    <div className="mb-2 text-muted">
                        Category:{" "}
                        <span className="text-primary fw-semibold">
                            {product.category}
                        </span>
                    </div>

                    <h3 className="fw-bold text-success mb-3">
                        ₹ {product.price}
                    </h3>

                    <p className="text-secondary mb-4">
                        High-quality product crafted with premium materials.
                        Designed for durability and everyday comfort.
                    </p>

                    {/* Quantity + Button */}
                    <div className="d-flex align-items-center gap-3 mb-4">

                        <div className="d-flex border rounded">

                            <button
                                className="btn"
                                onClick={() =>
                                    setQuantity(quantity > 1 ? quantity - 1 : 1)
                                }
                            >
                                −
                            </button>

                            <span className="px-3 d-flex align-items-center">
                                {quantity}
                            </span>

                            <button
                                className="btn"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>

                        </div>

                        <button className="btn btn-dark px-4 rounded-pill">
                            Add to Cart
                        </button>

                    </div>

                    {/* Extra Actions */}
                    <div className="d-flex gap-3">
                        <button className="btn btn-outline-secondary btn-sm">
                            ❤️ Wishlist
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                            🔄 Compare
                        </button>
                    </div>

                </div>

            </div>

            {/* Description Section */}
            <div className="mt-5 pt-4 border-top">
                <h5 className="fw-semibold mb-3">Product Description</h5>
                <p className="text-muted">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer posuere erat a ante. Donec id elit non mi porta
                    gravida at eget metus.
                </p>
            </div>

        </div>
    );
};

export default SingleProduct;
