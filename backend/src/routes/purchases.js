const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all purchases for a raffle (public)
router.get('/raffle/:raffleId', (req, res) => {
  try {
    const db = req.app.get('db');
    const { raffleId } = req.params;

    const purchases = db.prepare('SELECT * FROM purchases WHERE raffle_id = ? ORDER BY number').all(raffleId);

    res.json({ purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a purchase (public)
router.post('/', (req, res) => {
  try {
    const db = req.app.get('db');
    const { raffle_id, buyer_name, buyer_phone, buyer_email, number } = req.body;

    // Validate required fields
    if (!raffle_id || !buyer_name || !buyer_phone || !number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if raffle exists and is active
    const raffle = db.prepare('SELECT * FROM raffles WHERE id = ?').get(raffle_id);
    if (!raffle) {
      return res.status(404).json({ error: 'Raffle not found' });
    }
    if (raffle.status !== 'active') {
      return res.status(400).json({ error: 'Raffle is not active' });
    }

    // Check if number is valid
    if (number < 1 || number > raffle.total_numbers) {
      return res.status(400).json({ error: 'Invalid number' });
    }

    // Check if number is already purchased
    const existingPurchase = db.prepare('SELECT * FROM purchases WHERE raffle_id = ? AND number = ?').get(raffle_id, number);
    if (existingPurchase) {
      return res.status(409).json({ error: 'Number already purchased' });
    }

    // Create purchase
    const insertPurchase = db.prepare(`
      INSERT INTO purchases (raffle_id, buyer_name, buyer_phone, buyer_email, number)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertPurchase.run(raffle_id, buyer_name, buyer_phone, buyer_email, number);

    const newPurchase = db.prepare('SELECT * FROM purchases WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ purchase: newPurchase });
  } catch (error) {
    console.error('Create purchase error:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Number already purchased' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single purchase (authenticated)
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;

    const purchase = db.prepare('SELECT * FROM purchases WHERE id = ?').get(id);

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json({ purchase });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete purchase (authenticated)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;

    const purchase = db.prepare('SELECT * FROM purchases WHERE id = ?').get(id);
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    db.prepare('DELETE FROM purchases WHERE id = ?').run(id);

    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Delete purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all purchases (authenticated)
router.get('/', authMiddleware, (req, res) => {
  try {
    const db = req.app.get('db');

    const purchases = db.prepare(`
      SELECT p.*, r.title as raffle_title 
      FROM purchases p
      JOIN raffles r ON p.raffle_id = r.id
      ORDER BY p.created_at DESC
    `).all();

    res.json({ purchases });
  } catch (error) {
    console.error('Get all purchases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
