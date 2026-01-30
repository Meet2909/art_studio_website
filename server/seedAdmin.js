    require("dotenv").config();
    const mongoose = require("mongoose");
    const bcrypt = require("bcryptjs");
    const User = require("./models/User");

    const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Check if Admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
        console.log("⚠️ Admin already exists");
        process.exit();
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, salt);

        // 3. Create Admin
        const adminUser = new User({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword, // <--- Securely Hashed!
        role: "admin",
        cart: [],
        enrolledCourses: []
        });

        await adminUser.save();
        console.log("✅ Admin Created Successfully!");
        process.exit();

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
    };

    seedAdmin();