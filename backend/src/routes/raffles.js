const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all raffles (public)
router.get('/', (req, res) => {
  try {
    const db = req.app.get('db');
    const { status } = req.query;

    let query = 'SELECT * FROM raffles';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const raffles = db.prepare(query).all(...params);

    // Parse images JSON for each raffle
    const rafflesWithParsedImages = raffles.map(raffle => ({
      ...raffle,
      images: raffle.images ? JSON.parse(raffle.images) : []
    }));

    res.json({ raffles: rafflesWithParsedImages });
  } catch (error) {
    console.error('Get raffles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single raffle (public)
router.get('/:id', (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;

    const raffle = db.prepare('SELECT * FROM raffles WHERE id = ?').get(id);

    if (!raffle) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    // Parse images JSON
    raffle.images = raffle.images ? JSON.parse(raffle.images) : [];

    // Get purchased numbers for this raffle
    const purchases = db.prepare('SELECT number FROM purchases WHERE raffle_id = ?').all(id);
    const purchasedNumbers = purchases.map(p => p.number);

    res.json({ 
      raffle,
      purchasedNumbers
    });
  } catch (error) {
    console.error('Get raffle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create raffle (authenticated)
router.post('/', authMiddleware, (req, res) => {
  try {
    const db = req.app.get('db');
    const { title, description, images, price_per_number, total_numbers, draw_date } = req.body;

    // Validate required fields
    if (!title || !description || !price_per_number || !total_numbers || !draw_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertRaffle = db.prepare(`
      INSERT INTO raffles (title, description, images, price_per_number, total_numbers, draw_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertRaffle.run(
      title,
      description,
      images ? JSON.stringify(images) : null,
      price_per_number,
      total_numbers,
      draw_date,
      'active'
    );

    const newRaffle = db.prepare('SELECT * FROM raffles WHERE id = ?').get(result.lastInsertRowid);
    newRaffle.images = newRaffle.images ? JSON.parse(newRaffle.images) : [];

    res.status(201).json({ raffle: newRaffle });
  } catch (error) {
    console.error('Create raffle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update raffle (authenticated)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    const { title, description, images, price_per_number, total_numbers, draw_date, status, winner_number, winner_name } = req.body;

    // Check if raffle exists
    const existingRaffle = db.prepare('SELECT * FROM raffles WHERE id = ?').get(id);
    if (!existingRaffle) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    const updateRaffle = db.prepare(`
      UPDATE raffles
      SET title = ?, description = ?, images = ?, price_per_number = ?, 
          total_numbers = ?, draw_date = ?, status = ?, winner_number = ?, 
          winner_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateRaffle.run(
      title !== undefined ? title : existingRaffle.title,
      description !== undefined ? description : existingRaffle.description,
      images !== undefined ? JSON.stringify(images) : existingRaffle.images,
      price_per_number !== undefined ? price_per_number : existingRaffle.price_per_number,
      total_numbers !== undefined ? total_numbers : existingRaffle.total_numbers,
      draw_date !== undefined ? draw_date : existingRaffle.draw_date,
      status !== undefined ? status : existingRaffle.status,
      winner_number !== undefined ? winner_number : existingRaffle.winner_number,
      winner_name !== undefined ? winner_name : existingRaffle.winner_name,
      id
    );

    const updatedRaffle = db.prepare('SELECT * FROM raffles WHERE id = ?').get(id);
    updatedRaffle.images = updatedRaffle.images ? JSON.parse(updatedRaffle.images) : [];

    res.json({ raffle: updatedRaffle });
  } catch (error) {
    console.error('Update raffle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete raffle (authenticated)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;

    const raffle = db.prepare('SELECT * FROM raffles WHERE id = ?').get(id);
    if (!raffle) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    db.prepare('DELETE FROM raffles WHERE id = ?').run(id);

    res.json({ message: 'Raffle deleted successfully' });
  } catch (error) {
    console.error('Delete raffle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
