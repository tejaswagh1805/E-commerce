import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");

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
