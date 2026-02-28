import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Recommendations = ({ category, currentProductId }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const createSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        if (category) {
            fetchRecommendations();
        }
    }, [category]);

    const fetchRecommendations = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/products/recommended/${category}`);
            const filtered = res.data.filter(p => p._id !== currentProductId);
            setProducts(filtered);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="mt-5">
            <h4 className="fw-bold mb-4">🎯 You May Also Like</h4>
            
            <div className="row g-3">
                {products.map((product) => (
                    <div key={product._id} className="col-md-3">
                        <div 
                            className="card h-100 border-0 shadow-sm"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/product/${createSlug(product.name)}`)}
                        >
                            <div 
                                style={{ 
                                    height: "150px", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    padding: "10px"
                                }}
                            >
                                <img
                                    src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                                    alt={product.name}
                                    style={{
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                        objectFit: "contain"
                                    }}
                                />
                            </div>
                            <div className="card-body">
                                <small className="text-muted">{product.category}</small>
                                <h6 className="fw-bold mt-1 mb-2">{product.name}</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="fw-semibold mb-0">₹{product.price}</p>
                                    {product.rating > 0 && (
                                        <small className="text-warning">
                                            ⭐ {product.rating.toFixed(1)}
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
