    const express = require('express');
    const router = express.Router();
    const User = require('../models/User');
    const Course = require('../models/Course');
    const GalleryItem = require('../models/GalleryItem');
    const CorporateContent = require('../models/CorporateContent'); // <--- Import this at the top

    // Middleware to simulate auth (In real app, verify JWT token here)
    // For now, we will trust the userId sent in the body/headers for simplicity in this demo
    const protect = async (req, res, next) => {
        // In production, decode JWT token to get req.user
        next(); 
    };

    // @desc    Get User Cart
    // @route   GET /api/user/:id/cart
    router.get('/:id/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
        res.json(user.cart);
        } else {
        res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // @desc    Update User Cart
    // @route   PUT /api/user/:id/cart
    router.put('/:id/cart', async (req, res) => {
    console.log(`\n--- UPDATE CART REQUEST ---`);
    console.log(`Target User ID: ${req.params.id}`);
    
    try {
        const { cart } = req.body;
        console.log(`Received Cart Items: ${cart ? cart.length : 'undefined'}`);

        if (!cart) {
            console.error("❌ Error: No cart data provided in body");
            return res.status(400).json({ message: "No cart data provided" });
        }

        // 1. Find the user
        const user = await User.findById(req.params.id);
        
        if (!user) {
            console.error("❌ Error: User not found in DB");
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. LOG THE BEFORE STATE
        console.log(`Current DB Cart Size: ${user.cart.length}`);

        // 3. UPDATE
        // We force the assignment. Mongoose will cast this to the Schema.
        user.cart = cart;

        // 4. SAVE & LOG ERROR
        try {
            const updatedUser = await user.save();
            console.log(`✅ Success! New DB Cart Size: ${updatedUser.cart.length}`);
            res.json(updatedUser.cart);
        } catch (saveError) {
            console.error("❌ Mongoose Save Error:", saveError.message);
            // This usually captures Validation Errors
            res.status(400).json({ message: saveError.message });
        }

        } catch (error) {
            console.error("❌ Server Error:", error.message);
            res.status(500).json({ message: error.message });
        }
    });

    router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
    });

    router.get('/home-gallery', async (req, res) => {
    try {
        // Get 'limit' from query (?limit=5), default to 5
        const limit = parseInt(req.query.limit) || 5;
        const featuredItems = await GalleryItem.find({ isFeatured: true });
        const items = await GalleryItem.aggregate([
        { $sample: { size: limit } } 
        ]);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching gallery' });
    }
    });

    router.get('/corporate-content', async (req, res) => {
    try {
        // We use findOne because we only have one "Main" document for this page
        const content = await CorporateContent.findOne({ section: 'main' });
        res.json(content);
    } catch (error) {
        console.error("Error fetching corporate content:", error);
        res.status(500).json({ message: 'Server Error' });
    }
    });

    module.exports = router;