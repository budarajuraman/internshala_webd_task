// server/routes/blogs.js
const express = require('express');
const db = require('../config');
const router = express.Router();

// Get all published blogs
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM blogs WHERE publish_date <= NOW()';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// POST new blog
router.post('/', (req, res) => {
  const { title, content, publishDate } = req.body;
  const sql = 'INSERT INTO blogs (title, content, publish_date) VALUES (?, ?, ?)';
  
  db.query(sql, [title, content, publishDate], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({ message: 'Blog added successfully!', blogId: results.insertId });
  });
});

// DELETE a specific blog
router.delete("/:id", (req, res) => {
  const blogId = req.params.id; // Get the blog id from the request parameters

  // SQL query to delete the blog by id
  const sql = 'DELETE FROM blogs WHERE id = ?';

  // Execute the delete query
  db.query(sql, [blogId], (err, results) => {
    if (err) {
      console.error("Error deleting blog:", err);
      return res.status(500).json({ error: 'Failed to delete blog', details: err });
    }

    // If no rows were affected, that means the blog wasn't found
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully!' });
  });
});




module.exports = router;
