import { useState } from "react";
import axios from "axios";
import { API_URL } from '../config';

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
            setMessage(res.data.message);
            setEmail("");
        } catch (error) {
            setMessage(error.response?.data?.error || "Subscription failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section 
            className="py-5" 
            style={{ 
                background: "#fafafa",
                borderTop: "1px solid #e5e5e5",
                borderBottom: "1px solid #e5e5e5"
            }}
        >
            <div className="container text-center">
                <h3 className="fw-bold mb-2" style={{ color: "#000" }}>Join Our Baby Care Community!</h3>
                <p className="mb-4" style={{ color: "#666" }}>Get parenting tips, exclusive deals & new arrivals!</p>

                <form onSubmit={handleSubscribe} className="d-flex justify-content-center gap-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        style={{ 
                            maxWidth: "350px",
                            border: "1px solid #ddd",
                            borderRadius: "0",
                            padding: "12px 20px"
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button 
                        type="submit" 
                        className="btn px-4"
                        style={{
                            background: "#000",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0",
                            fontWeight: "600"
                        }}
                        disabled={loading}
                    >
                        {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                </form>

                {message && (
                    <div className="mt-3">
                        <small style={{ 
                            background: "#fff",
                            color: "#000",
                            padding: "8px 16px",
                            border: "1px solid #e5e5e5",
                            fontWeight: "600"
                        }}>
                            {message}
                        </small>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Newsletter;
