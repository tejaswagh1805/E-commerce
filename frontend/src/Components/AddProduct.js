import React from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [company, setCompany] = React.useState("");
    const [error, setError] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const navigate = useNavigate();

    const addProduct = async (e) => {
        e.preventDefault();

        if (!name || !price || !category || !company) {
            setError(true);
            return;
        }

        const userId = JSON.parse(localStorage.getItem('user'))._id;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("company", company);
        formData.append("userId", userId);
        formData.append("image", image);

        const result = await fetch("http://172.16.60.17:5000/add-product", {
            method: 'post',
            body: formData,
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
        });

        const data = await result.json();

        if (result.ok) {
            navigate("/");
        } else {
            alert("Something went wrong");
        }
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

                <div className="mb-4">
                    <label className="form-label fw-semibold">Product Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            className="product-preview"
                        />
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
