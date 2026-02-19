const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    mobile: String,
    image: String,
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer"
    }
}, { timestamps: true });

module.exports = mongoose.model("users", userSchema);
