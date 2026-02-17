import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {

    const [products, setProducts] = React.useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        let result = await fetch("http://172.16.60.17:5000/products", {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        setProducts(result);
    }
    const deleteProduct = async (id) => {
        let result = await fetch(`http://172.16.60.17:5000/product/${id}`, {
            method: 'delete',
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        if (result) {
            getProducts();
        }
    }

    const searchHandle = async (event) => {
        let key = event.target.value;
        if (key) {
            let result = await fetch(`http://172.16.60.17:5000/search/${key}`, {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            if (result) {
                setProducts(result);
            }
        } else {
            getProducts();
        }
    }
    return (
        <div className="container py-5">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Our Products</h2>
                    <p className="text-muted mb-0">
                        {products.length} Products Available
                    </p>
                </div>

                <div className="input-group shadow-sm" style={{ maxWidth: "350px" }}>
                    <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search products..."
                        onChange={searchHandle}
                    />
                </div>
            </div>

            {/* PRODUCT GRID */}
            {products.length > 0 ? (
                <div className="row g-4">
                    {products.map((item) => (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={item._id}>
                            <div className="card product-card border-0 shadow-sm h-100">

                                {/* IMAGE */}
                                <div className="product-img-wrapper">
                                    <img
                                        src={`http://172.16.60.17:5000/uploads/${item.image}`}
                                        alt={item.name}
                                        className="card-img-top product-img"
                                    />
                                </div>

                                <div className="card-body d-flex flex-column">

                                    <small className="text-uppercase text-muted mb-1">
                                        {item.category}
                                    </small>

                                    <h6 className="fw-semibold mb-2 text-truncate">
                                        {item.name}
                                    </h6>

                                    <span className="text-muted small mb-2">
                                        Brand: <strong>{item.company}</strong>
                                    </span>

                                    <div className="mt-auto">
                                        <h5 className="fw-bold text-dark mb-3">
                                            ₹{item.price}
                                        </h5>

                                        <div className="d-flex gap-2">
                                            <Link
                                                to={`/update-product/${item._id}`}
                                                className="btn btn-outline-dark btn-sm w-100"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm w-100"
                                                onClick={() => deleteProduct(item._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-bag fs-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">No products available</h5>
                </div>
            )}

        </div>
    );

}

export default ProductList;