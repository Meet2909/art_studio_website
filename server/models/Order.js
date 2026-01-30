    const mongoose = require("mongoose");

    const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        userEmail: { type: String },
        // --- NEW FIELDS ---
        userPhone: { type: String }, // Changed to String to handle formatting/+91
        shippingAddress: { type: String },
        paymentMode: { type: String, enum: ['Online', 'COD'], default: 'Online' }, // Track how they paid
        // ------------------
        items: [
        {
            title: String,
            price: Number,
            courseId: String, 
            attendees: [{ type: String }]
        },
        ],
        totalAmount: { type: Number, required: true },
        // Update status to reflect COD pending state
        paymentStatus: { type: String, default: "Pending" }, // Can be: Pending, Completed, COD-Pending

        // RAZORPAY SPECIFIC FIELDS (Will be empty for COD)
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
    },
    { timestamps: true }
    );

    module.exports = mongoose.model("Order", orderSchema);