const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Jwt = require("jsonwebtoken");

require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const Order = require("./db/Order");

const jwtKey = "e-comm";
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

app.use(express.json());
app.use(cors());

/* =====================================================
   📂 UPLOAD FOLDER SETUP
===================================================== */

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

app.use("/uploads", express.static(uploadPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* =====================================================
   🔐 TOKEN + ROLE MIDDLEWARE
===================================================== */

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ error: "Token required" });
    }

    const token = authHeader.split(" ")[1];

    Jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = decoded.user;
        next();
    });
}

function verifyAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
}

/* =====================================================
   👤 AUTH ROUTES
===================================================== */

// REGISTER (Always Customer)
app.post("/register", upload.single("image"), async (req, res) => {
    try {

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile || "",
            image: req.file ? req.file.filename : "",
            role: "customer"  // 🔥 FORCE CUSTOMER
        });

        const result = await user.save();
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN REGISTER (Only Admin App Uses This)
app.post("/admin-register", upload.single("image"), async (req, res) => {
    try {

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            image: req.file ? req.file.filename : "",
            role: "admin"   // 🔥 FORCE ADMIN
        });

        const result = await user.save();
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// LOGIN
app.post("/login", async (req, res) => {
    try {

        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        }).select("-password");

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        Jwt.sign(
            { user },
            jwtKey,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) {
                    res.status(500).json({ error: "JWT error" });
                } else {
                    res.json({ user, auth: token });
                }
            }
        );

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =====================================================
   👤 PROFILE
===================================================== */

app.get("/profile/:id", verifyToken, async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
});

/* =====================================================
   📦 ADMIN PRODUCT ROUTES
===================================================== */

// ADD PRODUCT (ADMIN ONLY)
app.post("/add-product",
    verifyToken,
    verifyAdmin,
    upload.array("images", 5),
    async (req, res) => {

        const imagePaths = req.files
            ? req.files.map(file => file.filename)
            : [];

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            company: req.body.company,
            userId: req.user._id,
            images: imagePaths
        });

        const result = await product.save();
        res.json(result);
    }
);

// GET ALL PRODUCTS (ADMIN)
app.get("/products", verifyToken, verifyAdmin, async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

// UPDATE PRODUCT (ADMIN)
app.put("/product/:id",
    verifyToken,
    verifyAdmin,
    upload.array("images", 5),
    async (req, res) => {

        const updateData = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            company: req.body.company,
        };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.filename);
        }

        const result = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.json(result);
    }
);

// DELETE PRODUCT (ADMIN)
app.delete("/product/:id", verifyToken, verifyAdmin, async (req, res) => {
    const result = await Product.findByIdAndDelete(req.params.id);
    res.json(result);
});

/* =====================================================
   🌍 CUSTOMER PUBLIC ROUTES
===================================================== */

// SHOP PRODUCTS
app.get("/shop-products", async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

// SINGLE PRODUCT
app.get("/shop-product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

/* =====================================================
   🛒 ORDER ROUTES
===================================================== */

// CUSTOMER PLACE ORDER
app.post("/place-order", async (req, res) => {

    const orderId = "ORD-" + Date.now().toString().slice(-6);

    const order = new Order({
        orderId,
        ...req.body,
        status: "Pending"
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
});

// ADMIN VIEW ALL ORDERS
app.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// ADMIN UPDATE ORDER STATUS
app.put("/order/:id", verifyToken, verifyAdmin, async (req, res) => {

    const updated = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );

    res.json(updated);
});

// CUSTOMER ORDER HISTORY
app.get("/customer-orders/:userId", async (req, res) => {
    const orders = await Order.find({
        userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(orders);
});

app.get("/invoice/:id", verifyToken, async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 40
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order.orderId}.pdf`
        );

        doc.pipe(res);

        /* ================= LOAD FONT ================= */

        const fontPath = path.join(__dirname, "assets", "NotoSans-Regular.ttf");
        if (fs.existsSync(fontPath)) {
            doc.registerFont("Noto", fontPath);
            doc.font("Noto");
        }

        let y = 40;

        /* ================= HEADER ================= */

        doc.rect(0, 0, doc.page.width, 80).fill("#eef2ff");

        const logoPath = path.join(__dirname, "assets", "e-commm.png");

        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 40, 20, { width: 120 });
        }

        doc.fillColor("#000")
            .fontSize(26)
            .text("INVOICE", 0, 30, { align: "right" });

        y = 110;

        /* ================= ORDER INFO ================= */

        doc.fontSize(12);
        doc.text(`Order ID: ${order.orderId}`, 350, y);
        doc.text(`Date: ${new Date(order.createdAt).toDateString()}`, 350, y + 18);
        doc.text(`Status: ${order.status}`, 350, y + 36);

        /* ================= CUSTOMER ================= */

        doc.fontSize(14).text("Customer Details", 40, y);
        doc.fontSize(12);

        doc.text(`Name: ${order.customerName}`, 40, y + 25);
        doc.text(`Email: ${order.email}`, 40, y + 42);
        doc.text(`Mobile: ${order.mobile}`, 40, y + 59);

        /* ================= ADDRESS BLOCK FUNCTION ================= */

        const printAddress = (title, addr, x, yPos) => {

            doc.fontSize(14).text(title, x, yPos);
            doc.fontSize(12);

            if (!addr) {
                doc.text("N/A", x, yPos + 20);
                return;
            }

            let lineY = yPos + 20;

            if (addr.address) {
                doc.text(addr.address, x, lineY);
                lineY += 15;
            }

            doc.text(
                `${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`,
                x,
                lineY
            );

            lineY += 15;

            if (addr.country) {
                doc.text(addr.country, x, lineY);
            }
        };

        y += 100;

        printAddress("Billing Address", order.billingAddress, 40, y);
        printAddress("Shipping Address", order.shippingAddress, 300, y);

        /* ================= PRODUCTS ================= */

        y += 100;

        doc.fontSize(14).text("Products", 40, y);
        y += 25;

        doc.fontSize(12);

        doc.text("Product", 40, y);
        doc.text("Qty", 300, y);
        doc.text("Price", 350, y);
        doc.text("Total", 430, y);

        y += 20;

        let subtotal = 0;

        order.products.forEach(item => {

            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            if (item.images?.length > 0) {
                const imgPath = path.join(__dirname, "uploads", item.images[0]);
                if (fs.existsSync(imgPath)) {
                    doc.image(imgPath, 40, y, {
                        width: 35,
                        height: 35
                    });
                }
            }

            doc.text(item.name, 90, y, { width: 190 });
            doc.text(item.quantity.toString(), 300, y);
            doc.text(`₹ ${item.price}`, 350, y);
            doc.text(`₹ ${itemTotal}`, 430, y);

            y += 45;
        });

        /* ================= TOTAL ================= */

        const gst = subtotal * 0.18;
        const grandTotal = subtotal + gst;

        y += 10;

        doc.text(`Subtotal: ₹ ${subtotal}`, 350, y);
        y += 18;
        doc.text(`GST (18%): ₹ ${gst.toFixed(2)}`, 350, y);
        y += 18;

        doc.fontSize(14)
            .text(`Grand Total: ₹ ${grandTotal.toFixed(2)}`, 350, y);

        /* ================= QR ================= */

        const qrData = `Order ID: ${order.orderId}\nTotal: ₹ ${grandTotal}`;

        const qrImage = await QRCode.toDataURL(qrData);
        const qrBuffer = Buffer.from(
            qrImage.replace(/^data:image\/png;base64,/, ""),
            "base64"
        );

        doc.image(qrBuffer, 40, y + 30, { width: 80 });

        /* ================= SIGNATURE ================= */

        doc.fontSize(12)
            .text("Authorized Signature", 400, y + 40);

        doc.moveTo(400, y + 60)
            .lineTo(550, y + 60)
            .stroke();

        /* ================= FOOTER ================= */

        doc.fontSize(10)
            .fillColor("#777")
            .text(
                "Thank you for shopping with MyStore!",
                0,
                770,
                { align: "center" }
            );

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

/* =====================================================
   🚀 START SERVER
===================================================== */

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
