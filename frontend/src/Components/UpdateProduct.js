import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const [stock, setStock] = useState("");
    const [discount, setDiscount] = useState("");
    const [brand, setBrand] = useState("");
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const [existingImages, setExistingImages] = useState([]); // from DB
    const [newImages, setNewImages] = useState([]); // newly selected

    const params = useParams();
    const navigate = useNavigate();

    const storedData = JSON.parse(localStorage.getItem("user"));
    const token = storedData ? storedData.auth : null;

    useEffect(() => {
        if (token) {
            getProductDetails();
        }
    }, []);

    const getProductDetails = async () => {

        try {

            let result = await fetch(
                `http://localhost:5000/product/${params.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            result = await result.json();

            if (result) {
                setName(result.name || "");
                setPrice(result.price || "");
                setCategory(result.category || "");
                setCompany(result.company || "");
                setStock(result.stock || "");
                setDiscount(result.discount || "");
                setBrand(result.brand || "");
                setSku(result.sku || "");
                setDescription(result.description || "");
                setSizes(result.sizes || []);
                setColors(result.colors || []);

                // ✅ IMPORTANT FIX
                setExistingImages(result.images || []);
            }

        } catch (error) {
            console.log("Fetch Error:", error);
        }
    };

    const updateProduct = async () => {

        try {

            if (!storedData) return;

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("company", company);
            formData.append("stock", stock);
            formData.append("discount", discount);
            formData.append("brand", brand);
            formData.append("sku", sku);
            formData.append("description", description);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("colors", JSON.stringify(colors));

            // ✅ Send new images only
            newImages.forEach((file) => {
                formData.append("images", file);
            });

            const result = await fetch(
                `http://localhost:5000/product/${params.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${storedData.auth}`
                    },
                    body: formData
                }
            );

            if (result.ok) {
                navigate("/");
            }

        } catch (error) {
            console.log("Update Error:", error);
        }
    };

    return (
        <div className="update-wrapper">
            <div className="update-card animate-fade">

                <div className="text-center mb-4">
                    <h3 className="fw-bold">Update Product</h3>
                    <p className="text-muted">Modify product details below</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); updateProduct(); }}>

                    <div className="floating-group">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>Product Name</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <label>Price (₹)</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="text"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <label>Category</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                        <label>Company</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                        <label>Stock Quantity</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                        <label>Discount (%)</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                        <label>Brand</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="text"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                        />
                        <label>SKU</label>
                    </div>

                    <div className="floating-group">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            style={{ resize: "vertical" }}
                        />
                        <label>Description</label>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Sizes</label>
                        <div className="d-flex gap-2 flex-wrap">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`btn btn-sm ${sizes.includes(size) ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => {
                                        if (sizes.includes(size)) {
                                            setSizes(sizes.filter(s => s !== size));
                                        } else {
                                            setSizes([...sizes, size]);
                                        }
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Colors</label>
                        <div className="d-flex gap-2 flex-wrap">
                            {["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Gray", "Maroon"].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`btn btn-sm ${colors.includes(color) ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => {
                                        if (colors.includes(color)) {
                                            setColors(colors.filter(c => c !== color));
                                        } else {
                                            setColors([...colors, color]);
                                        }
                                    }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Update Images
                        </label>

                        <input
                            type="file"
                            multiple
                            className="form-control"
                            onChange={(e) =>
                                setNewImages(Array.from(e.target.files))
                            }
                        />

                        {/* ✅ EXISTING IMAGES FROM DATABASE */}
                        {existingImages.length > 0 && (
                            <div className="mt-3">
                                {existingImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:5000/uploads/${img}`}
                                        alt="existing"
                                        className="update-preview"
                                        style={{ width: "120px", marginRight: "10px" }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* ✅ NEW SELECTED IMAGES PREVIEW */}
                        {newImages.length > 0 && (
                            <div className="mt-3">
                                {newImages.map((file, index) => {
                                    const previewUrl = URL.createObjectURL(file);
                                    return (
                                        <img
                                            key={index}
                                            src={previewUrl}
                                            alt="preview"
                                            className="update-preview"
                                            style={{ width: "120px", marginRight: "10px" }}
                                            onLoad={() =>
                                                URL.revokeObjectURL(previewUrl)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <button className="btn-update-product">
                        Update Product
                    </button>

                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
