const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

const router = express.Router();

// Get user data by JWT token
router.get('/me', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ msg: 'No token provided' });
  }

  jwt.verify(token, keys.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: 'Invalid token' });
    }

    User.findById(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ email: user.email });
      })
      .catch(err => res.status(500).json({ msg: 'Server error' }));
  });
});

module.exports = router;
