    // server/models/Enquiry.js
    const mongoose = require('mongoose');

    const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'New' } // New, Read, Contacted
    }, { timestamps: true });

    module.exports = mongoose.model('Enquiry', enquirySchema);