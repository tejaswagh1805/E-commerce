import { useState } from "react";
import axios from "axios";

const ProductReviews = ({ productId, reviews, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        
        if (!user || !token) {
            alert("Please login to add a review");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5000/product/${productId}/review`,
                { rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            alert("Review added successfully!");
            setComment("");
            setRating(5);
            setShowForm(false);
            onReviewAdded();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to add review");
        }
    };

    const renderStars = (rating) => {
        return "⭐".repeat(Math.round(rating));
    };

    return (
        <div className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Customer Reviews</h4>
                <button 
                    className="btn btn-dark btn-sm rounded-pill"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancel" : "Write a Review"}
                </button>
            </div>

            {showForm && (
                <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Rating</label>
                                <div className="d-flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            style={{ 
                                                fontSize: "2rem", 
                                                cursor: "pointer",
                                                opacity: star <= rating ? 1 : 0.3
                                            }}
                                            onClick={() => setRating(star)}
                                        >
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Your Review</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    placeholder="Share your experience with this product..."
                                />
                            </div>

                            <button type="submit" className="btn btn-dark rounded-pill px-4">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-4">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="card mb-3 border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-1">{review.userName}</h6>
                                        <div className="mb-2">{renderStars(review.rating)}</div>
                                    </div>
                                    <small className="text-muted">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                <p className="mb-0">{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
