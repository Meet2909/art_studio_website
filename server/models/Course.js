const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: [String], required: true },
  category: { type: String, required: true }, // e.g., 'Adults', 'Kids'
  type: { type: String, required: true },     // e.g., 'Fine Arts', 'Sculpting'
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: [String], required: true },
  slots: { type: Number, default: 20 }, // Available seats
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);