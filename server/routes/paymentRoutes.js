    const express = require("express");
    const router = express.Router();
    const Razorpay = require("razorpay");
    const crypto = require("crypto");
    const Order = require("../models/Order");

    // 1. INITIALIZE RAZORPAY (This was missing)
    const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // --- ROUTE 1: Handle COD (Pay on Spot) Orders ---
    router.post("/cod-order", async (req, res) => {
    try {
        const { userId, userEmail, userPhone, shippingAddress, items, totalAmount } = req.body;

        if (!userPhone || !shippingAddress) {
        return res.status(400).json({ message: "Phone and Address are required for COD" });
        }

        const newOrder = new Order({
        userId,
        userEmail,
        userPhone,
        shippingAddress,
        items,
        totalAmount,
        paymentMode: 'COD',
        paymentStatus: "COD-Pending",
        });

        await newOrder.save();
        
        console.log(`✅ COD Order Created for User: ${userId}`);
        res.status(201).json({ message: "COD Order placed successfully!", orderId: newOrder._id });

    } catch (error) {
        console.error("COD Order Error:", error);
        // Always return JSON, even for errors
        res.status(500).json({ message: "Failed to place COD order." });
    }
    });

    // --- ROUTE 2: Create Razorpay Order ---
    router.post("/create-order", async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const options = { 
            amount: Math.round(amount * 100), // Razorpay accepts amount in paise
            currency, 
            receipt: receipt || `rcpt_${Date.now()}` 
        };

        // This line previously failed because 'razorpay' wasn't initialized
        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).json({ message: "Error creating Razorpay order" });
        
        res.json(order);

    } catch (error) {
        console.error("Error creating order:", error);
        // Return JSON error to prevent "Unexpected token S" on frontend
        res.status(500).json({ message: "Server Error: " + error.message });
    }
    });

    // --- ROUTE 3: Verify Payment ---
    router.post("/verify-payment", async (req, res) => {
    try {
        const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId, userEmail, userPhone, shippingAddress, items, totalAmount,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

        if (expectedSignature === razorpay_signature) {
        const newOrder = new Order({
            userId,
            userEmail,
            userPhone,
            shippingAddress,
            items,
            totalAmount,
            paymentMode: 'Online',
            paymentStatus: "Completed",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        });

        await newOrder.save();

        res.json({
            message: "Payment Verified Successfully",
            orderId: newOrder._id,
        });
        } else {
        res.status(400).json({ message: "Invalid Signature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error during verification" });
    }
    });

    module.exports = router;