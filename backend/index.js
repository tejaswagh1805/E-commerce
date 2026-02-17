const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Jwt = require('jsonwebtoken');

require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product');

const jwtKey = "e-comm";

app.use(express.json());
app.use(cors());

/* =====================================================
   🔥 UPLOAD FOLDER SETUP (AUTO CREATE SAFE VERSION)
===================================================== */

const uploadPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

app.use('/uploads', express.static(uploadPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* =====================================================
   🔐 AUTH ROUTES
===================================================== */

app.post("/register", upload.single("image"), async (req, res) => {
    try {

        const { name, email, password, mobile } = req.body;

        console.log("BODY:", req.body);

        const user = new User({
            name,
            email,
            password,
            mobile: mobile || "",
            image: req.file ? req.file.filename : ""
        });

        const result = await user.save();
        res.send(result);

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
});



app.get("/profile/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.send(user);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.put("/profile/:id", verifyToken, upload.single("image"), async (req, res) => {
    try {

        const updateData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        res.send(updatedUser);

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


app.post("/login", async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            let user = await User.findOne(req.body).select("-password");
            if (user) {
                Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                    if (err) return res.status(500).send({ error: "JWT error" });
                    res.send({ user, auth: token });
                });
            } else {
                res.status(400).send({ error: "Invalid credentials" });
            }
        } else {
            res.status(400).send({ error: "Missing credentials" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

/* =====================================================
   📦 PRODUCT ROUTES
===================================================== */

app.post("/add-product", verifyToken, upload.single('image'), async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            company: req.body.company,
            userId: req.body.userId,
            image: req.file ? req.file.filename : ""
        });

        const result = await product.save();
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get("/products", verifyToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get("/product/:id", verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: "Product not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.put("/product/:id", verifyToken, upload.single('image'), async (req, res) => {
    try {

        const updateData = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            company: req.body.company,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const result = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.send(result);

    } catch (err) {
        console.log("UPDATE ERROR:", err);
        res.status(500).send({ error: err.message });
    }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get("/search/:key", verifyToken, async (req, res) => {
    try {
        const result = await Product.find({
            $or: [
                { name: { $regex: req.params.key, $options: "i" } },
                { category: { $regex: req.params.key, $options: "i" } },
                { company: { $regex: req.params.key, $options: "i" } }
            ]
        });
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

/* =====================================================
   🔑 VERIFY TOKEN
===================================================== */

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(401).send({ error: "Invalid token" });
            } else {
                next();
            }
        });
    } else {
        res.status(403).send({ error: "Token required" });
    }
}

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

