const express = require('express');
const User = require('../models/User'); // Import User model
const router = express.Router();

// Utility function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Create a user
router.post('/users', async (req, res) => {
    try {
        const { name, role } = req.body;
        const newUser = new User({ name, role });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user details
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get distance between two users
router.get('/users/distance/:userA/:userB', async (req, res) => {
    try {
        const userA = await User.findById(req.params.userA);
        const userB = await User.findById(req.params.userB);

        if (!userA || !userB)
            return res.status(404).json({ message: 'One or both users not found' });

        const lastLocationA = userA.locations[userA.locations.length - 1];
        const lastLocationB = userB.locations[userB.locations.length - 1];

        if (!lastLocationA || !lastLocationB)
            return res.status(404).json({ message: 'Locations not found' });

        const distance = calculateDistance(
            lastLocationA.latitude,
            lastLocationA.longitude,
            lastLocationB.latitude,
            lastLocationB.longitude
        );

        res.status(200).json({ distance: `${distance.toFixed(2)} km` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
