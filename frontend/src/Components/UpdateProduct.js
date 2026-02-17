import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [company, setCompany] = React.useState("");
    const params = useParams();
    const navigate = useNavigate();
    const [image, setImage] = React.useState(null);

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        let result = await fetch(`http://172.16.60.17:5000/product/${params.id}`, {
            headers: { authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}` }
        });
        result = await result.json();
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
        setImage(result.image);
    }

    const updateProduct = async () => {

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("company", company);

        if (image) {
            formData.append("image", image);
        }

        const result = await fetch(`http://172.16.60.17:5000/product/${params.id}`, {
            method: 'put',
            body: formData,
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
        });

        const data = await result.json();
        console.log(data);
        navigate('/');
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
                    <label className="form-label fw-semibold">Update Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

{image && (
    <img
        src={
            typeof image === "string"
                ? `http://172.16.60.17:5000/uploads/${image}`
                : URL.createObjectURL(image)
        }
        alt="preview"
        className="update-preview"
        style={{ width: "120px", marginTop: "10px" }}
    />
)}

               </div>

                <button className="btn-update-product">
                    Update Product
                </button>

            </form>
        </div>
    </div>
);

}

export default UpdateProduct;