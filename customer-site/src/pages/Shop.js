import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

const Shop = () => {

    const { addToCart } = useContext(CartContext);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [price, setPrice] = useState(229900);
    const [showDrawer, setShowDrawer] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [search, category, price, products]);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await fetch("http://172.16.60.17:5000/shop-products");
            const data = await res.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    // ================= FILTER LOGIC =================
    const filterProducts = () => {
        let updated = [...products];

        if (search) {
            updated = updated.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            updated = updated.filter(item => item.category === category);
        }

        updated = updated.filter(item => item.price <= price);

        setFilteredProducts(updated);
    };

    const categories = ["All", ...new Set(products.map(p => p.category))];

    // ================= ADD TO CART =================
    const handleAddToCart = (product) => {
        addToCart(product);
        setShowDrawer(true);
    };

    return (
        <>
            <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
                <div className="container py-5">

                    <div className="row">

                        {/* ================= FILTER SIDEBAR ================= */}
                        <div className="col-md-3 mb-4">
                            <div
                                className="p-4 bg-white"
                                style={{
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                }}
                            >
                                <h5 className="fw-bold mb-3">Filters</h5>

                                {/* Category */}
                                <div className="mb-4">
                                    <label className="fw-semibold mb-2 d-block">
                                        Category
                                    </label>

                                    {categories.map((cat, index) => (
                                        <div key={index} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="category"
                                                checked={category === cat}
                                                onChange={() => setCategory(cat)}
                                            />
                                            <label className="form-check-label">
                                                {cat}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="fw-semibold d-block mb-2">
                                        Price Range
                                    </label>

                                    <input
                                        type="range"
                                        className="form-range"
                                        min="0"
                                        max="229900"
                                        step="500"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                    />

                                    <div className="d-flex justify-content-between">
                                        <small>₹0</small>
                                        <small>₹{price}</small>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ================= PRODUCT SECTION ================= */}
                        <div className="col-md-9">

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h4 className="fw-bold">Products</h4>
                                    <small className="text-muted">
                                        {filteredProducts.length} Products Available
                                    </small>
                                </div>

                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="Search..."
                                    style={{ maxWidth: "250px" }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Product Grid */}
                            <div className="row g-4">

                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item) => (
                                        <div key={item._id} className="col-md-4">

                                            <div
                                                className="bg-white p-3 h-100"
                                                style={{
                                                    borderRadius: "16px",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                                }}
                                            >

                                                {/* Image */}
                                                <div
                                                    style={{
                                                        height: "180px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => navigate(`/product/${item._id}`)}
                                                >
                                                    <img
                                                        src={`http://172.16.60.17:5000/uploads/${item.images?.[0]}`}
                                                        alt={item.name}
                                                        style={{
                                                            maxHeight: "100%",
                                                            maxWidth: "100%",
                                                            objectFit: "contain"
                                                        }}
                                                    />
                                                </div>

                                                <small className="text-muted">
                                                    {item.category}
                                                </small>

                                                <h6 className="fw-bold mt-1">
                                                    {item.name}
                                                </h6>

                                                <p className="fw-semibold mb-3">
                                                    ₹{item.price}
                                                </p>

                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-outline-dark w-50 rounded-pill"
                                                        onClick={() => navigate(`/product/${item._id}`)}
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        className="btn btn-dark w-50 rounded-pill"
                                                        onClick={() => handleAddToCart(item)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>

                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center mt-5">
                                        <h5>No products found</h5>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {/* CART DRAWER */}
            <CartDrawer
                show={showDrawer}
                onClose={() => setShowDrawer(false)}
            />
        </>
    );
};

export default Shop;
