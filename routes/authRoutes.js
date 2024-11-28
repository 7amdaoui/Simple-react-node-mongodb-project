const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys'); 

const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        // Create new user
        const newUser = new User({
          email,
          password: hashedPassword,
        });

        // Save the user in the database
        newUser.save()
          .then(user => {
            res.status(201).json({ msg: 'User registered successfully' });
          })
          .catch(err => res.status(500).json({ msg: 'Error saving user' }));
      });
    })
    .catch(err => res.status(500).json({ msg: 'Server error' }));
});

// Login a user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Compare the provided password with the hashed password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
          }

          // Create JWT payload
          const payload = { id: user._id, email: user.email };

          // Sign JWT token
          jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token: `Bearer ${token}` });
          });
        })
        .catch(err => res.status(500).json({ error: 'Server error' }));
    })
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

module.exports = router;
