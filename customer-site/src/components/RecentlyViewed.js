import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecentlyViewed = ({ currentProductId }) => {
    const [recentProducts, setRecentProducts] = useState([]);
    const navigate = useNavigate();

    const createSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        fetchRecentProducts();
    }, [currentProductId]);

    const fetchRecentProducts = async () => {
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        const filtered = viewed.filter(p => p._id !== currentProductId).slice(0, 4);
        
        // Verify products still exist in database
        const validProducts = [];
        for (const product of filtered) {
            try {
                const response = await axios.get(`http://localhost:5000/products/${product._id}`);
                if (response.data) {
                    validProducts.push(response.data);
                }
            } catch (error) {
                // Product doesn't exist, remove from localStorage
                const updatedViewed = viewed.filter(p => p._id !== product._id);
                localStorage.setItem("recentlyViewed", JSON.stringify(updatedViewed));
            }
        }
        
        setRecentProducts(validProducts);
    };

    if (recentProducts.length === 0) return null;

    return (
        <div className="mt-5">
            <h4 className="fw-bold mb-4">👁️ Recently Viewed</h4>
            
            <div className="row g-3">
                {recentProducts.map((product) => (
                    <div key={product._id} className="col-md-3">
                        <div 
                            className="card h-100 border-0 shadow-sm"
                            style={{ cursor: "pointer", transition: "0.3s" }}
                            onClick={() => navigate(`/product/${createSlug(product.name)}`)}
                            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
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
                                <p className="fw-semibold mb-0">₹{product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
