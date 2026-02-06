const bcrypt = require('bcryptjs');
const initializeDatabase = require('./init');

async function seedDatabase() {
  const db = initializeDatabase();

  // Check if admin user exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');

  if (!adminExists) {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const insertUser = db.prepare(`
      INSERT INTO users (username, password, name)
      VALUES (?, ?, ?)
    `);
    insertUser.run('admin', hashedPassword, 'Administrador');
    console.log('Admin user created: username=admin, password=admin123');
  } else {
    console.log('Admin user already exists');
  }

  // Check if raffles exist
  const raffleCount = db.prepare('SELECT COUNT(*) as count FROM raffles').get();

  if (raffleCount.count === 0) {
    // Create sample raffles
    const insertRaffle = db.prepare(`
      INSERT INTO raffles (title, description, images, price_per_number, total_numbers, draw_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date();
    
    // Raffle 1 - 30 days from now
    const drawDate1 = new Date(now);
    drawDate1.setDate(drawDate1.getDate() + 30);
    
    insertRaffle.run(
      'Rifa Solidária - Hospital de Câncer RV',
      'Concorra a prêmios incríveis e ajude o Hospital de Câncer de Rio Verde! Sua participação faz a diferença.',
      JSON.stringify(['/uploads/raffle1.jpg']),
      10.0,
      1000,
      drawDate1.toISOString(),
      'active'
    );

    // Raffle 2 - 60 days from now
    const drawDate2 = new Date(now);
    drawDate2.setDate(drawDate2.getDate() + 60);
    
    insertRaffle.run(
      'Rifa Beneficente - Cesta de Natal',
      'Concorra a uma super cesta de Natal recheada e ajude uma causa nobre.',
      JSON.stringify(['/uploads/raffle2.jpg']),
      5.0,
      500,
      drawDate2.toISOString(),
      'active'
    );

    // Raffle 3 - 90 days from now
    const drawDate3 = new Date(now);
    drawDate3.setDate(drawDate3.getDate() + 90);
    
    insertRaffle.run(
      'Rifa do Bem - Notebook Dell',
      'Concorra a um notebook Dell novinho e contribua para nossa causa.',
      JSON.stringify(['/uploads/raffle3.jpg']),
      20.0,
      300,
      drawDate3.toISOString(),
      'active'
    );

    console.log('3 sample raffles created');

    // Create sample purchases for the first raffle
    const insertPurchase = db.prepare(`
      INSERT INTO purchases (raffle_id, buyer_name, buyer_phone, buyer_email, number)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (let i = 1; i <= 10; i++) {
      insertPurchase.run(
        1,
        `Comprador ${i}`,
        `(62) 9999-${String(i).padStart(4, '0')}`,
        `comprador${i}@email.com`,
        i
      );
    }

    console.log('Sample purchases created for raffle 1');
  } else {
    console.log('Raffles already exist');
  }

  db.close();
  console.log('Database seeded successfully');
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = seedDatabase;
