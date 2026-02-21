import React from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [company, setCompany] = React.useState("");
    const [error, setError] = React.useState(false);
    const [images, setImages] = React.useState([]);
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
                        <label>Company / Brand</label>
                    </div>

                    {/* ✅ MULTIPLE IMAGE UPLOAD */}
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
                        />

                        {/* ✅ SAFE PREVIEW */}
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