    require("dotenv").config();
    const mongoose = require("mongoose");

    const runTest = async () => {
    console.log("1. Starting Connection Test...");
    console.log("   URI:", process.env.MONGO_URI); 

    try {
        // Attempt to connect
        await mongoose.connect(process.env.MONGO_URI);
        console.log("2. ✅ Connected! State:", mongoose.connection.readyState);
        
        // Attempt to find ONE item
        console.log("3. Fetching data...");
        const collection = mongoose.connection.collection("galleryitems");
        const count = await collection.countDocuments();
        
        console.log(`4. ✅ SUCCESS! Found ${count} items in the database.`);
        console.log("   Your connection is PERFECT.");
        process.exit(0);

    } catch (err) {
        console.log("------------------------------------------");
        console.log("❌ CONNECTION FAILED");
        console.log("Error Name:", err.name);
        console.log("Error Message:", err.message);
        console.log("------------------------------------------");
        process.exit(1);
    }
    };

    runTest();