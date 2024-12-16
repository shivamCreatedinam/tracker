const { Router } = require("express");
const User = require("../models/User"); // Correct import
const app = Router();

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, role, locations } = req.body;
        const newUser = new User({ name, role, locations: locations || [] }); // Default to empty array
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a user by roll_number
app.get('/users/:roll_number', async (req, res) => {
    try {
        const user = await User.findOne({ roll_number: req.params.roll_number });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user by roll_number
app.put('/users/:roll_number', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { roll_number: req.params.roll_number },
            req.body,
            { new: true } // Return the updated document
        );
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user by roll_number
app.delete('/users/:roll_number', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ roll_number: req.params.roll_number });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;