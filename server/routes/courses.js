const express = require('express');
const db = require('../config');
const router = express.Router();

// Get all discounted courses
router.get('/discounted', (req, res) => {
  const sql = 'SELECT * FROM courses WHERE is_discounted = TRUE';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/// Add a new course
router.post('/add', (req, res) => {
  const { title, description, actualPrice, discountPercentage } = req.body;

  // Validate input
  if (!title || !description || !actualPrice || !discountPercentage) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Calculate the discounted price
  const discountedPrice = actualPrice - (actualPrice * (discountPercentage / 100));

  // SQL query to insert the course
  const sql = `
    INSERT INTO courses (title, description, price, discount, discounted_price, is_discounted)
    VALUES (?, ?, ?, ?, ?, TRUE)`;

  // Execute the query
  db.query(sql, [title, description, actualPrice, discountPercentage, discountedPrice], (err, result) => {
    if (err) {
      console.error('Error inserting course:', err);
      return res.status(500).json({ message: 'Failed to add course.' });
    }

    // Send response with the inserted course details
    res.status(201).json({
      message: 'Course added successfully!',
      courseId: result.insertId,
    });
  });
});

module.exports = router;

