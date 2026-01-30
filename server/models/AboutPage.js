    const mongoose = require('mongoose');

    const aboutPageSchema = new mongoose.Schema({
    // --- Text Content ---
    // The main story section
    storyParagraphs: [{ type: String }], 
    
    // Mission Section broken down for better control
    missionDescription: { type: String }, 
    visionDescription: { type: String },
    coreValues: [{ type: String }], // Array of strings for the bullet points

    // --- Images (6 Distinct Images) ---
    heroImage: { type: String },      // Main Portrait
    storyImageLeft: { type: String }, // Story Section - Left Floating
    storyImageRight: { type: String },// Story Section - Right Floating
    missionImageLeft: { type: String }, // Mission Section - Left Floating
    missionImageRight: { type: String },// Mission Section - Right Floating
    statsImage: { type: String },     // Square grid image
    
    // --- Stats (Optional, good to keep dynamic) ---
    yearsExperience: { type: String, default: "15+" },
    studentsMentored: { type: String, default: "2k+" },
    exhibitionsHosted: { type: String, default: "50+" }
    }, { timestamps: true });

    module.exports = mongoose.model('AboutPage', aboutPageSchema);