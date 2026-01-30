const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isFeatured: { type: Boolean, default: false},
  width: { type: String, default: "400px" },    // Added this
  height: { type: String, default: "400px" },   // Added this
  rounded: { type: String, default: "rounded-[15px]" }, // Added this
  type: { type: String, default: 'Student Work' },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);