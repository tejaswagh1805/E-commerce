import { useState } from "react";
import axios from "axios";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://localhost:5000/newsletter/subscribe", { email });
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
                background: "linear-gradient(135deg, #FFE5EC 0%, #FFF5F7 100%)",
                borderTop: "3px solid #FFB6C1",
                borderBottom: "3px solid #FFB6C1"
            }}
        >
            <div className="container text-center">
                <h3 className="fw-bold mb-2" style={{ color: "#FF6B9D" }}>👶 Join Our Baby Care Community!</h3>
                <p className="mb-4" style={{ color: "#666" }}>Get parenting tips, exclusive deals & new arrivals!</p>

                <form onSubmit={handleSubscribe} className="d-flex justify-content-center gap-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        style={{ 
                            maxWidth: "350px",
                            border: "2px solid #FF6B9D",
                            borderRadius: "25px",
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
                            background: "#FF6B9D",
                            color: "#fff",
                            border: "none",
                            borderRadius: "25px",
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
                            color: "#FF6B9D",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: "2px solid #FFB6C1",
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
