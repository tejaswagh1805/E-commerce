import React from "react";
import { useNavigate } from "react-router-dom";

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

        const result = await fetch("http://localhost:5000/add-product", {
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

    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const availableColors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple"];

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
                                <input
                                    type="text"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder=" "
                                />
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
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Available Sizes</label>
                        <div className="d-flex gap-2 flex-wrap">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`btn btn-sm ${sizes.includes(size) ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => handleSizeToggle(size)}
                                    style={{ borderRadius: "8px", minWidth: "50px" }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Available Colors</label>
                        <div className="d-flex gap-2 flex-wrap">
                            {availableColors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`btn btn-sm ${colors.includes(color) ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => handleColorToggle(color)}
                                    style={{ borderRadius: "8px" }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Product Images
                        </label>

                        <input
                            type="file"
                            multiple
                            className="form-control"
                            onChange={(e) =>
                                setImages(Array.from(e.target.files))
                            }
                            style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
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
