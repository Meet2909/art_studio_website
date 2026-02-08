    const mongoose = require('mongoose');

    const artPieceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // URL from Cloudinary
    category: { type: String, default: 'Painting' },
    inStock: { type: Boolean, default: true },
    dimensions: { type: String } // Optional: e.g., "24x36 inches"
    }, { timestamps: true });

    module.exports = mongoose.model('ArtPiece', artPieceSchema);