const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, enum: ['student', 'admin'], default: 'student' },

cart: [
    {
    id: String,
    title: String,
    price: Number,
    image: String,
    category: String,
    type: { type: String, default: 'course' }
      // We can extend this later for attendee names if needed
    }
],
enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);