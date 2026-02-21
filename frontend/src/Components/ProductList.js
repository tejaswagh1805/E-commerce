import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState(0);
    const [maxProductPrice, setMaxProductPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedCategory, priceRange]);

    /* ================= SAFE FETCH PRODUCTS ================= */

    const getProducts = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));
            if (!auth) return;

            let response = await fetch("http://localhost:5000/products", {
                headers: {
                    Authorization: `Bearer ${auth.auth}`
                }
            });

            let result = await response.json();

            // 🔥 IMPORTANT FIX
            if (!Array.isArray(result)) {
                console.error("API did not return array:", result);
                setProducts([]);
                setFilteredProducts([]);
                return;
            }

            setProducts(result);
            setFilteredProducts(result);

            const highestPrice =
                result.length > 0
                    ? Math.max(...result.map(item => Number(item.price)))
                    : 0;

            setMaxProductPrice(highestPrice);
            setPriceRange(highestPrice);

        } catch (error) {
            console.log("Fetch Error:", error);
            setProducts([]);
            setFilteredProducts([]);
        }
    };

    /* ================= DELETE ================= */

    const deleteProduct = async (id) => {
        try {
            const auth = JSON.parse(localStorage.getItem("user"));
            if (!auth) return;

            await fetch(
                `http://localhost:5000/product/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${auth.auth}`
                    }
                }
            );

            getProducts();

        } catch (error) {
            console.log("Delete Error:", error);
        }
    };

    /* ================= APPLY FILTERS ================= */

    const applyFilters = () => {

        if (!Array.isArray(products)) return;

        let updated = [...products];

        if (selectedCategory) {
            updated = updated.filter(
                (item) => item.category === selectedCategory
            );
        }

        if (priceRange) {
            updated = updated.filter(
                (item) => Number(item.price) <= Number(priceRange)
            );
        }

        setFilteredProducts(updated);
    };

    const resetFilters = () => {
        setSelectedCategory("");
        setPriceRange(maxProductPrice);
        setFilteredProducts(products);
    };

    /* ================= SEARCH ================= */

    const searchHandle = async (event) => {

        try {
            const key = event.target.value;
            const auth = JSON.parse(localStorage.getItem("user"));
            if (!auth) return;

            if (key) {
                let response = await fetch(
                    `http://localhost:5000/search/${key}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.auth}`
                        }
                    }
                );

                let result = await response.json();

                if (!Array.isArray(result)) {
                    setFilteredProducts([]);
                    return;
                }

                setFilteredProducts(result);

            } else {
                setFilteredProducts(products);
            }

        } catch (error) {
            console.log("Search Error:", error);
        }
    };

    /* ================= SAFE CATEGORY ================= */

    const categories = Array.isArray(products)
        ? [...new Set(products.map(p => p.category))]
        : [];

    return (
        <div className="container py-5">

            <div className="row">

                {/* SIDEBAR */}
                <div className="col-lg-3 mb-4">

                    <div className="border rounded-4 p-4 shadow-sm">

                        <h5 className="fw-bold mb-4">Filters</h5>

                        <div className="mb-4">
                            <h6 className="fw-semibold mb-3">Category</h6>

                            {categories.map((cat, index) => (
                                <div key={index} className="form-check mb-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="form-check-input"
                                        checked={selectedCategory === cat}
                                        onChange={() => setSelectedCategory(cat)}
                                    />
                                    <label className="form-check-label">
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <h6 className="fw-semibold mb-3">Price Range</h6>

                            <input
                                type="range"
                                min="0"
                                max={maxProductPrice}
                                value={priceRange}
                                className="form-range"
                                onChange={(e) => setPriceRange(e.target.value)}
                            />

                            <div className="d-flex justify-content-between mt-2">
                                <span className="text-muted">₹0</span>
                                <span className="fw-bold">₹{priceRange}</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-outline-dark w-100 rounded-pill"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>

                    </div>

                </div>

                {/* PRODUCTS */}
                <div className="col-lg-9">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>
                            <h2 className="fw-bold mb-1">Admin Products</h2>
                            <p className="text-muted mb-0">
                                {filteredProducts.length} Products Available
                            </p>
                        </div>

                        <div
                            className="input-group shadow-sm rounded-pill overflow-hidden"
                            style={{ maxWidth: "300px" }}
                        >
                            <span className="input-group-text bg-white border-0">
                                🔍
                            </span>
                            <input
                                type="text"
                                className="form-control border-0"
                                placeholder="Search..."
                                onChange={searchHandle}
                            />
                        </div>

                    </div>

                    {Array.isArray(filteredProducts) &&
                        filteredProducts.length > 0 ? (
                        <div className="row g-4">
                            {filteredProducts.map((item) => (
                                <div className="col-sm-6 col-md-4" key={item._id}>
                                    <div className="border rounded-4 shadow-sm p-3 h-100">

                                        <div
                                            className="text-center mb-3"
                                            onClick={() =>
                                                navigate(`/product/${item._id}`)
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img
                                                src={
                                                    item.images &&
                                                        item.images.length > 0
                                                        ? `http://localhost:5000/uploads/${item.images[0]}`
                                                        : ""
                                                }
                                                alt={item.name}
                                                className="img-fluid"
                                                style={{
                                                    height: "180px",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </div>

                                        <small className="text-muted">
                                            {item.category}
                                        </small>

                                        <h6 className="fw-semibold mt-2">
                                            {item.name}
                                        </h6>

                                        <p className="fw-bold text-dark">
                                            ₹{item.price}
                                        </p>

                                        <div className="d-flex gap-2 mt-3">
                                            <Link
                                                to={`/update-product/${item._id}`}
                                                className="btn btn-light btn-sm w-100 shadow-sm fw-semibold"
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
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <h5 className="text-muted">
                                No products found
                            </h5>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ProductList;
