const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM expenses', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { amount, category, description, user_id } = req.body; // Accept user_id

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  db.query(
    'INSERT INTO expenses (amount, category, description, user_id) VALUES (?, ?, ?, ?)',
    [amount, category, description, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Expense added successfully!' });
    }
  );
});

router.delete('/delete/:id', (req, res) => {
  db.query(
    'DELETE FROM expenses WHERE id = ?',
    [req.params.id], // Extract id from URL
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Expense deleted successfully!' });
    }
  );
});

module.exports = router;
