    // server/routes/adminRoutes.js
    console.log("🔥 ADMIN ROUTES LOADED");

    const express = require("express");
    const router = express.Router();
    const mongoose = require("mongoose");
    const cloudinary = require("cloudinary");
    const CloudinaryStorage = require("multer-storage-cloudinary");
    const multer = require("multer");
    const nodemailer = require('nodemailer');

    // Models
    const User = require("../models/User");
    const Order = require("../models/Order");
    const GalleryItem = require("../models/GalleryItem");
    const AboutPage = require('../models/AboutPage');
    const Course = require("../models/Course");
    const Enquiry = require("../models/Enquiry"); // Import Enquiry
    const ArtPiece = require("../models/ArtPiece");

    const { protect, admin } = require("../middleware/authMiddleware");

    const jwt = require('jsonwebtoken'); // Import this
    const bcrypt = require('bcryptjs');  // Ensure you have this

    // Helper to generate token
    const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    };

    // --- 1. CLOUDINARY CONFIG ---
    cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

        const storage = new CloudinaryStorage({
        cloudinary: cloudinary.v2,
        params: {
            folder: "art-studio-gallery",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        },
    });
    const upload = multer({ 
        storage,
        limits: { fileSize: 8 * 1024 * 1024 }, // prevents Render timeout
    });

    // --- 2. GALLERY ROUTES (With File Upload) ---
    router.get("/gallery", async (req, res) => {
    try {
        const items = await GalleryItem.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // Upload Route
        router.post("/gallery", protect, admin, (req, res, next) => {
            console.log("📩 Upload request reached server");
        // This wrapper catches Multer/Cloudinary errors explicitly
        upload.single("imageFile")(req, res, (err) => {
            if (err) {
                console.error("❌ Multer/Cloudinary Upload Error:", err);
                return res.status(500).json({ message: "Image upload failed: " + err.message });
            }
            next();
        });
    }, async (req, res) => {
    try {
        // Debugging: See what came through
        console.log("📸 File received:", req.file);
        console.log("📝 Body received:", req.body);

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided." });
        }

        const { path, width, height } = req.file;

        const newItem = new GalleryItem({
        title: req.body.title || "Untitled",
        imageUrl: path,
        width: width ? width.toString() : "400",
        height: height ? height.toString() : "400",
        rounded: req.body.rounded || "rounded-[15px]",
        });

        await newItem.save();
        console.log("✅ Gallery Item Saved!");
        res.status(201).json(newItem);

    } catch (error) {
        console.error("❌ Database Save Error:", error);
        res.status(500).json({ message: error.message });
    }
    });

        router.delete("/gallery/:id", protect, admin, async (req, res) => {
        try {
            await GalleryItem.findByIdAndDelete(req.params.id);
            res.json({ message: "Item removed" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        });


    // --- 3. COURSE ROUTES ---
    router.get("/courses", async (req, res) => {
        // Public route to fetch courses for editing list
        const courses = await Course.find({});
        res.json(courses);
    });

    router.post("/courses", protect, admin, async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    router.put("/courses/:id", protect, admin, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Return the updated doc
        );
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    router.delete("/courses/:id", protect, admin, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });


    // --- 4. ORDER ROUTES ---
    router.get("/orders", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    router.get("/stats", protect, admin, async (req, res) => {
        try {
            const totalUsers = await User.countDocuments();
            const totalOrders = await Order.countDocuments();
            const orders = await Order.find({ paymentStatus: "Completed" });
            const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
            res.json({ totalUsers, totalOrders, totalRevenue });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });


    // --- 5. ENQUIRY ROUTES (Contact Form) ---
    router.get("/enquiries", protect, admin, async (req, res) => {
        try {
            const messages = await Enquiry.find({}).sort({ createdAt: -1 });
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Public route for submitting form
    router.post('/contact', async (req, res) => {
        const { name, email, message } = req.body;

        try {
            // 1. Save to Database first (so you don't lose the lead if email fails)
            const newEnquiry = new Enquiry({ name, email, message });
            await newEnquiry.save();

            // 2. Transporter Setup
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, 
                },
            });

            // 3. Mail Options
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, 
                replyTo: email,
                subject: `New Message from ${name}`,
                text: message, // Plain text fallback
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Message:</strong> ${message}</p>`
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Message received and email sent!' });

        } catch (error) {
            console.error('Detailed Error:', error);
            res.status(500).json({ message: 'Server error', details: error.message });
        }
    });

    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            // Check password (Secure comparison)
            if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // <--- THIS IS THE KEY
            });
            } else {
            res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        });

    router.get("/art", async (req, res) => {
        try {
            const art = await ArtPiece.find({}).sort({ createdAt: -1 });
            res.json(art);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // B. Upload New Art (Reuses 'upload' middleware from Gallery)
    router.post("/art", protect, admin, (req, res, next) => {
        upload.single("imageFile")(req, res, (err) => {
            if (err) return res.status(500).json({ message: "Upload Error" });
            next();
        });
    }, async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No image provided" });

            const newArt = new ArtPiece({
                title: req.body.title,
                price: req.body.price,
                category: req.body.category || "Painting",
                description: req.body.description,
                image: req.file.path, // Cloudinary URL
                inStock: true
            });

            await newArt.save();
            res.status(201).json(newArt);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // C. Delete Art
    router.delete("/art/:id", protect, admin, async (req, res) => {
        try {
            await ArtPiece.findByIdAndDelete(req.params.id);
            res.json({ message: "Art deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    
    module.exports = router;