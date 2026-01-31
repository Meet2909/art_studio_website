    require("dotenv").config();
    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const path = require('path');
    const helmet = require('helmet');
    const compression = require('compression');

    // Import Routes
    const paymentRoutes = require("./routes/paymentRoutes");
    const adminRoutes = require("./routes/adminRoutes");
    const authRoutes = require("./routes/authRoutes");
    const userRoutes = require('./routes/userRoutes');
    const aboutRoutes = require('./routes/about');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // 1. MIDDLEWARE
    app.use(helmet({
    contentSecurityPolicy: false, 
    }));
    app.use(compression());
    app.use(express.json());

    app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? "*" 
        : ["http://localhost:5173", "http://localhost:5000"]
    }));

    // 2. API ROUTES
    app.use("/api/payment", paymentRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/auth", authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/user', aboutRoutes);

    // ==========================================
    // 3. FRONTEND SERVING (THE FIX)
    // ==========================================
    // Use __dirname to safely find the client/dist folder relative to this file
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Catch-all: Send index.html for any request that isn't an API or static file
    app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // 4. DATABASE & START
    const connectDB = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`✅ Production DB Connected: ${conn.connection.host}`);
            app.listen(PORT, () => console.log(`🚀 Production Server running on port ${PORT}`));
        } catch (error) {
            console.error(`❌ DB Error: ${error.message}`);
            process.exit(1);
        }
    };

    connectDB();