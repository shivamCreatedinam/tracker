const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  heading: { type: Number, required: false }, // Vehicle direction
  timestamp: { type: Date, default: Date.now }, // For tracking when the location was updated
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['driver', 'viewer'], required: true }, // Define roles like driver (User A) or viewer (User B)
  locations: [locationSchema], // Array of locations for historical tracking
});

const User = mongoose.model('User', userSchema);
module.exports = User;
