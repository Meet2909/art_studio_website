    const express = require('express');
    const router = express.Router();
    const ArtPiece = require('../models/ArtPiece');
    const { protect, admin } = require('../middleware/authMiddleware');

    // Public: Get All Art
    router.get('/', async (req, res) => {
    try {
        const art = await ArtPiece.find({ inStock: true });
        res.json(art);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // Admin: Add New Art
    router.post('/', protect, admin, async (req, res) => {
    try {
        const newArt = new ArtPiece(req.body);
        await newArt.save();
        res.status(201).json(newArt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // Admin: Delete Art
    router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await ArtPiece.findByIdAndDelete(req.params.id);
        res.json({ message: 'Art deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    module.exports = router;