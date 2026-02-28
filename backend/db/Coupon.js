const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage"
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number,
        default: null
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("coupons", couponSchema);
