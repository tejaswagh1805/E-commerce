import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import { API_URL, getImageUrl } from '../config';

const Shop = () => {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(229900);
  const [showDrawer, setShowDrawer] = useState(false);

  const navigate = useNavigate();

  // Helper function to create URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, category, price, products]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/shop-products`);
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
      updated = updated.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      updated = updated.filter((item) => item.category === category);
    }

    updated = updated.filter((item) => item.price <= price);

    setFilteredProducts(updated);
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

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
                  borderRadius: "0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e5e5",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <h5
                  className="fw-bold mb-4"
                  style={{ fontSize: "16px", letterSpacing: "0.5px" }}
                >
                  FILTERS
                </h5>

                {/* Category */}
                <div className="mb-4">
                  <label
                    className="fw-semibold mb-3 d-block"
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
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
                      <label
                        className="form-check-label"
                        style={{ fontSize: "14px", cursor: "pointer" }}
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Price Range */}
                <div>
                  <label
                    className="fw-semibold d-block mb-3"
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
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

                  <div className="d-flex justify-content-between mt-2">
                    <small style={{ fontSize: "12px", color: "#666" }}>
                      ₹0
                    </small>
                    <small style={{ fontSize: "12px", fontWeight: "600" }}>
                      ₹{price}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= PRODUCT SECTION ================= */}
            <div className="col-md-9">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4
                    className="fw-bold"
                    style={{ fontSize: "20px", letterSpacing: "0.5px" }}
                  >
                    PRODUCTS
                  </h4>
                  <small className="text-muted" style={{ fontSize: "13px" }}>
                    {filteredProducts.length} Products Available
                  </small>
                </div>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  style={{
                    maxWidth: "250px",
                    borderRadius: "0",
                    border: "1px solid #000",
                    fontSize: "14px",
                    padding: "10px 16px",
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Product Grid */}
              <div className="row g-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <div key={item._id} className="col-md-4 col-sm-6">
                      <div
                        className="bg-white h-100"
                        style={{
                          borderRadius: "0",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          border: "1px solid #e5e5e5",
                          position: "relative",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.15)";
                          e.currentTarget.style.transform = "translateY(-4px)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0,0,0,0.08)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {/* Discount Badge */}
                        {item.discount > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                              background: "#000",
                              color: "#fff",
                              padding: "4px 12px",
                              borderRadius: "0",
                              fontSize: "11px",
                              fontWeight: "700",
                              letterSpacing: "0.5px",
                              zIndex: 1,
                            }}
                          >
                            {item.discount}% OFF
                          </div>
                        )}

                        {/* Image */}
                        <div
                          style={{
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            background: "#fafafa",
                          }}
                          onClick={() =>
                            navigate(`/product/${createSlug(item.name)}`)
                          }
                        >
                          <img
                            src={getImageUrl(item.images?.[0])}
                            alt={item.name}
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}
                        >
                          <small
                            className="text-muted"
                            style={{
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {item.category}
                          </small>

                          <h6
                            className="fw-bold mt-2 mb-2"
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.4",
                              minHeight: "42px",
                            }}
                          >
                            {item.name}
                          </h6>

                          <div className="d-flex align-items-center gap-2 mb-3">
                            <p
                              className="fw-bold mb-0"
                              style={{ fontSize: "16px" }}
                            >
                              ₹{item.price}
                            </p>

                            {item.discount > 0 && (
                              <p
                                className="text-muted text-decoration-line-through mb-0"
                                style={{ fontSize: "13px" }}
                              >
                                ₹
                                {(
                                  Number(item.price) /
                                  (1 - item.discount / 100)
                                ).toFixed(0)}
                              </p>
                            )}
                          </div>

                          {/* Buttons */}
                          <div className="d-flex gap-2 mt-auto">
                            <button
                              className="btn"
                              style={{
                                flex: 1,
                                background: "#fff",
                                color: "#000",
                                border: "1px solid #000",
                                borderRadius: "0",
                                fontWeight: "600",
                                padding: "10px 16px",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                transition: "all 0.3s ease",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${createSlug(item.name)}`);
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#000";
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.color = "#000";
                              }}
                            >
                              View
                            </button>

                            <button
                              className="btn"
                              style={{
                                flex: 1,
                                background: "#000",
                                color: "#fff",
                                border: "1px solid #000",
                                borderRadius: "0",
                                fontWeight: "600",
                                padding: "10px 16px",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                transition: "all 0.3s ease",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background = "#333")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background = "#000")
                              }
                            >
                              Add
                            </button>
                          </div>
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
      <CartDrawer show={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default Shop;
