    // server/routes/about.js
    const express = require('express');
    const router = express.Router();
    const AboutPage = require('../models/AboutPage'); // Adjust path to your model if needed

    // Route: GET /api/user/about
    router.get('/about', async (req, res) => {
    try {
        // Fetch the most recent document created by the seed script
        const content = await AboutPage.findOne().sort({ createdAt: -1 });
        
        if (!content) {
        return res.status(404).json({ message: "No about content found" });
        }

        res.json(content);
    } catch (error) {
        console.error("Error fetching about page:", error);
        res.status(500).json({ message: "Server Error" });
    }
    });

    module.exports = router;