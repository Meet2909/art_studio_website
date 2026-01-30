    require("dotenv").config();
    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const path = require('path');
    const helmet = require('helmet');           // NEW
    const compression = require('compression'); // NEW

    // Import Routes
    const paymentRoutes = require("./routes/paymentRoutes");
    const adminRoutes = require("./routes/adminRoutes");
    const authRoutes = require("./routes/authRoutes");
    const userRoutes = require('./routes/userRoutes');
    const aboutRoutes = require('./routes/about');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // ==========================================
    // 1. SECURITY & PERFORMANCE MIDDLEWARE
    // ==========================================
    app.use(helmet({
    contentSecurityPolicy: false, // Disable strictly for React images/scripts compatibility
    }));
    app.use(compression()); // Gzip compression for speed
    app.use(express.json());

    // Strict CORS: Only allow your specific domain (You will update this later)
    app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? "*"  // Allow all in production (Safest for first deploy)
        : ["http://localhost:5173", "http://localhost:5000"] // Allow Vite & Localhost
    }));
    // ==========================================
    // 2. API ROUTES
    // ==========================================
    app.use("/api/payment", paymentRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/auth", authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/user', aboutRoutes);

    // ==========================================
    // 3. FRONTEND SERVING
    // ==========================================
    const _dirname = path.resolve();
    app.use(express.static(path.join(_dirname, '../client/dist')));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(_dirname, '../client/dist', 'index.html'));
    });

    // ==========================================
    // 4. DATABASE & START
    // ==========================================
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