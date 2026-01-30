require('dotenv').config();
const mongoose = require('mongoose');
const CorporateContent = require('./models/CorporateContent');

const corporateData = {
    section: 'main',
    
    // 1. VIDEO: Point to your local file in public/corporate
    heroVideo: "/corporate/video.mp4", 
    
    // 2. IMAGES: Point to your local files
    // Make sure these filenames match exactly what is in your folder!
    heroImage: "/corporate/hero-image.jpg",
    paintingPartyImage: "/corporate/paint.jpg",
    muralImage: "/corporate/mural.jpg"
};

const seedCorporate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await CorporateContent.deleteMany({});
        console.log('🗑️  Old corporate content removed');

        await CorporateContent.create(corporateData);
        console.log('🚀 Success! Local paths seeded.');
        
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedCorporate();