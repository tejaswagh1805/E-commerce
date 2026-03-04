import React from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';

const AddProduct = () => {

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [company, setCompany] = React.useState("");
    const [images, setImages] = React.useState([]);
    const [stock, setStock] = React.useState("100");
    const [discount, setDiscount] = React.useState("0");
    const [sizes, setSizes] = React.useState([]);
    const [colors, setColors] = React.useState([]);
    const [description, setDescription] = React.useState("");
    const [brand, setBrand] = React.useState("");
    const [sku, setSku] = React.useState("");
    const [customSize, setCustomSize] = React.useState("");
    const [customColor, setCustomColor] = React.useState("");
    
    const navigate = useNavigate();

    const addProduct = async (e) => {
        e.preventDefault();

        const storedData = JSON.parse(localStorage.getItem("user"));
        if (!storedData) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("company", company);
        formData.append("userId", storedData.user._id);
        formData.append("stock", stock);
        formData.append("discount", discount);
        formData.append("description", description);
        formData.append("brand", brand);
        formData.append("sku", sku);
        
        sizes.forEach(size => formData.append("sizes", size));
        colors.forEach(color => formData.append("colors", color));

        images.forEach((file) => {
            formData.append("images", file);
        });

        const result = await fetch(`${API_URL}/add-product`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${storedData.auth}`
            },
            body: formData
        });

        if (result.ok) navigate("/");
    };

    const handleSizeToggle = (size) => {
        setSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleColorToggle = (color) => {
        setColors(prev => 
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const addCustomSize = () => {
        if (customSize.trim() && !sizes.includes(customSize.trim())) {
            setSizes([...sizes, customSize.trim()]);
            setCustomSize("");
        }
    };

    const addCustomColor = () => {
        if (customColor.trim() && !colors.includes(customColor.trim())) {
            setColors([...colors, customColor.trim()]);
            setCustomColor("");
        }
    };

    const removeSize = (size) => {
        setSizes(sizes.filter(s => s !== size));
    };

    const removeColor = (color) => {
        setColors(colors.filter(c => c !== color));
    };

    const categories = [
        "Electronics", "Fashion", "Footwear", "Home & Kitchen", 
        "Beauty & Personal Care", "Sports & Fitness", "Books", 
        "Toys & Games", "Mobile & Accessories", "Computers & Laptops"
    ];

    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11", "12"];
    const availableColors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Gray", "Navy"];

    return (
        <div className="product-wrapper">
            <div className="product-card animate-fade">

                <div className="text-center mb-4">
                    <h3 className="fw-bold">Add New Product</h3>
                    <p className="text-muted">Fill in the details to create a product</p>
                </div>

                <form onSubmit={addProduct}>

                    <div className="floating-group">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder=" "
                        />
                        <label>Product Name</label>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="floating-group">
                                <input
                                    type="number"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder=" "
                                />
                                <label>Price (₹)</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="floating-group">
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder=" "
                                />
                                <label>Discount (%)</label>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="floating-group">
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value=""></option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <label>Category</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="floating-group">
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder=" "
                                />
                                <label>Stock Quantity</label>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="floating-group">
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    placeholder=" "
                                />
                                <label>Brand</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="floating-group">
                                <input
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder=" "
                                />
                                <label>SKU</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "14px", marginBottom: "8px" }}>Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ borderRadius: "0", border: "1px solid #000", fontSize: "14px" }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "14px", marginBottom: "8px" }}>Available Sizes</label>
                        <div className="d-flex gap-2 flex-wrap mb-2">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`btn btn-sm ${sizes.includes(size) ? 'btn-dark' : 'btn-outline-dark'}`}
                                    onClick={() => handleSizeToggle(size)}
                                    style={{ 
                                        borderRadius: "0", 
                                        minWidth: "50px",
                                        fontSize: "13px",
                                        padding: "6px 12px"
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <div className="d-flex gap-2 mt-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Add custom size (e.g., 64GB, 42)"
                                value={customSize}
                                onChange={(e) => setCustomSize(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                                style={{ borderRadius: "0", maxWidth: "250px", fontSize: "13px", border: "1px solid #000" }}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-dark"
                                onClick={addCustomSize}
                                style={{ borderRadius: "0", fontSize: "13px" }}
                            >
                                Add
                            </button>
                        </div>
                        {sizes.length > 0 && (
                            <div className="mt-2">
                                <small className="text-muted" style={{ fontSize: "12px" }}>Selected: </small>
                                {sizes.map(size => (
                                    <span key={size} className="badge bg-dark me-1" style={{ borderRadius: "0", fontSize: "12px" }}>
                                        {size}
                                        <button
                                            type="button"
                                            className="btn-close btn-close-white ms-1"
                                            style={{ fontSize: "8px" }}
                                            onClick={() => removeSize(size)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "14px", marginBottom: "8px" }}>Available Colors</label>
                        <div className="d-flex gap-2 flex-wrap mb-2">
                            {availableColors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`btn btn-sm ${colors.includes(color) ? 'btn-dark' : 'btn-outline-dark'}`}
                                    onClick={() => handleColorToggle(color)}
                                    style={{ 
                                        borderRadius: "0",
                                        fontSize: "13px",
                                        padding: "6px 12px"
                                    }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                        <div className="d-flex gap-2 mt-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Add custom color (e.g., Rose Gold)"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                                style={{ borderRadius: "0", maxWidth: "250px", fontSize: "13px", border: "1px solid #000" }}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-dark"
                                onClick={addCustomColor}
                                style={{ borderRadius: "0", fontSize: "13px" }}
                            >
                                Add
                            </button>
                        </div>
                        {colors.length > 0 && (
                            <div className="mt-2">
                                <small className="text-muted" style={{ fontSize: "12px" }}>Selected: </small>
                                {colors.map(color => (
                                    <span key={color} className="badge bg-dark me-1" style={{ borderRadius: "0", fontSize: "12px" }}>
                                        {color}
                                        <button
                                            type="button"
                                            className="btn-close btn-close-white ms-1"
                                            style={{ fontSize: "8px" }}
                                            onClick={() => removeColor(color)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "14px", marginBottom: "8px" }}>
                            Product Images
                        </label>

                        <input
                            type="file"
                            multiple
                            className="form-control"
                            onChange={(e) =>
                                setImages(Array.from(e.target.files))
                            }
                            style={{ borderRadius: "0", border: "1px solid #000", fontSize: "14px" }}
                        />

                        {images.length > 0 && (
                            <div className="image-preview-container mt-3">
                                {images.map((file, index) => {
                                    const previewUrl = URL.createObjectURL(file);

                                    return (
                                        <img
                                            key={index}
                                            src={previewUrl}
                                            alt="preview"
                                            className="product-preview"
                                            onLoad={() =>
                                                URL.revokeObjectURL(previewUrl)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <button className="btn-submit">
                        Add Product
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;
