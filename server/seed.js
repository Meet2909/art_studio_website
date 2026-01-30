require('dotenv').config();
const mongoose = require('mongoose');
const GalleryItem = require('./models/GalleryItem');

const galleryData = [
    { title: "Gallery Item 1", imageUrl: "/gallery/1.webp",isFeatured: false ,width: "300px", height: "450px", rounded: "rounded-[20px]" },
    { title: "Gallery Item 2", imageUrl: "/gallery/2.webp",isFeatured: false ,width: "350px", height: "450px", rounded: "rounded-[20px]" },
    { title: "Gallery Item 3", imageUrl: "/gallery/3.webp",isFeatured: false ,width: "400px", height: "550px", rounded: "rounded-[20px]" },
    { title: "Gallery Item 4", imageUrl: "/gallery/4.webp",isFeatured: false ,width: "400px", height: "450px", rounded: "rounded-[20px]" },
    { title: "Gallery Item 5", imageUrl: "/gallery/5.webp",isFeatured: false ,width: "400px", height: "500px", rounded: "rounded-[20px]" },
    { title: "Gallery Item 6", imageUrl: "/gallery/6.webp",isFeatured: false ,width: "400px", height: "450px", rounded: "rounded-[20px]" },
    { title: "Wide Horizon", imageUrl: "/gallery/7.webp", isFeatured: false,width: "400px", height: "350px", rounded: "rounded-[10px]" },
    { title: "Gallery Item 8", imageUrl: "/gallery/8.webp", isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 9", imageUrl: "/gallery/9.webp", isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 10", imageUrl: "/gallery/10.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 11", imageUrl: "/gallery/11.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 12", imageUrl: "/gallery/12.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 13", imageUrl: "/gallery/13.webp",isFeatured: false, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 14", imageUrl: "/gallery/14.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 15", imageUrl: "/gallery/15.webp",isFeatured: true, width: "550px", height: "350px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 16", imageUrl: "/gallery/16.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 17", imageUrl: "/gallery/17.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 18", imageUrl: "/gallery/18.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 19", imageUrl: "/gallery/19.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 20", imageUrl: "/gallery/20.webp",isFeatured: false, width: "400px", height: "600px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 21", imageUrl: "/gallery/21.webp",isFeatured: false, width: "400px", height: "600px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 22", imageUrl: "/gallery/22.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 23", imageUrl: "/gallery/23.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 24", imageUrl: "/gallery/24.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 25", imageUrl: "/gallery/25.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 26", imageUrl: "/gallery/26.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 27", imageUrl: "/gallery/27.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 28", imageUrl: "/gallery/28.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 29", imageUrl: "/gallery/29.webp",isFeatured: false, width: "450px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 30", imageUrl: "/gallery/30.webp",isFeatured: false, width: "400px", height: "600px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 31", imageUrl: "/gallery/31.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 32", imageUrl: "/gallery/32.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 33", imageUrl: "/gallery/33.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 34", imageUrl: "/gallery/34.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 35", imageUrl: "/gallery/35.webp",isFeatured: true, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 36", imageUrl: "/gallery/36.webp",isFeatured: false, width: "500px", height: "400px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 37", imageUrl: "/gallery/37.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 38", imageUrl: "/gallery/38.webp",isFeatured: false, width: "550px", height: "350px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 39", imageUrl: "/gallery/39.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 40", imageUrl: "/gallery/40.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 41", imageUrl: "/gallery/41.webp",isFeatured: false, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 42", imageUrl: "/gallery/42.webp",isFeatured: false, width: "550px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 43", imageUrl: "/gallery/43.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 44", imageUrl: "/gallery/44.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 45", imageUrl: "/gallery/45.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 46", imageUrl: "/gallery/46.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 47", imageUrl: "/gallery/47.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 48", imageUrl: "/gallery/48.webp",isFeatured: false, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 49", imageUrl: "/gallery/49.webp",isFeatured: false, width: "550px", height: "400px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 50", imageUrl: "/gallery/50.webp",isFeatured: false, width: "400px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 51", imageUrl: "/gallery/51.webp",isFeatured: false, width: "300px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 52", imageUrl: "/gallery/52.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 53", imageUrl: "/gallery/53.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 54", imageUrl: "/gallery/54.webp",isFeatured: false, width: "400px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 55", imageUrl: "/gallery/55.webp",isFeatured: false, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 56", imageUrl: "/gallery/56.webp",isFeatured: false, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 57", imageUrl: "/gallery/57.webp",isFeatured: true, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 58", imageUrl: "/gallery/58.webp",isFeatured: true, width: "450px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 59", imageUrl: "/gallery/59.webp",isFeatured: false, width: "450px", height: "500px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 60", imageUrl: "/gallery/60.webp",isFeatured: true, width: "450px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 61", imageUrl: "/gallery/61.webp",isFeatured: true, width: "450px", height: "550px", rounded: "rounded-[15px]" },
    { title: "Gallery Item 62", imageUrl: "/gallery/62.webp",isFeatured: true, width: "500px", height: "550px", rounded: "rounded-[15px]" },
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        
        // Clear existing items
        console.log('Deleting old items...');
        await GalleryItem.deleteMany({});
        console.log('Old gallery items removed...');

        // Insert new items
        console.log('Inserting new items...');
        await GalleryItem.insertMany(galleryData);
        console.log('Success! Gallery database populated.');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error with seeding:', error);
        process.exit(1);
    }
};

seedDB();