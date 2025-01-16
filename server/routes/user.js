const express = require('express');
const User = require('../models/user');
const router = express.Router();

// POST: Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Directly compare entered password with the stored password (plain text)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Respond with success if credentials are correct
    res.json({ message: 'Login successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
