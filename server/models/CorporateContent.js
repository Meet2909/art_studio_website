    const mongoose = require('mongoose');

    const corporateSchema = new mongoose.Schema({
    section: { type: String, default: 'main' },
    heroVideo: String,          // <--- NEW FIELD for the video
    paintingPartyImage: String, 
    muralImage: String          
    });

    module.exports = mongoose.model('CorporateContent', corporateSchema);