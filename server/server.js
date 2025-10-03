require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const MAX_CLIENTS = 1000;

// CORS
const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// Initialize DB
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    initializeDatabase(client, release);
  }
});

function initializeDatabase(client, release) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      location VARCHAR(255),
      service_type VARCHAR(100),
      price NUMERIC(10,2),
      serial_number VARCHAR(100),
      supporter VARCHAR(100),
      has_bonus BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  client.query(createTableQuery, (err) => {
    release();
    if (err) {
      console.error('❌ Error creating clients table:', err);
    } else {
      console.log('✅ Clients table ready');
    }
  });
}

// ================== API ROUTES ==================

// GET clients with pagination
app.get('/api/clients', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query('SELECT COUNT(*) AS total FROM clients');
    const total = parseInt(countResult.rows[0].total);

    const dataResult = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      data: dataResult.rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalClients: total,
    });
  } catch (err) {
    console.error('❌ Error fetching clients:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// POST add client
app.post('/api/clients', async (req, res) => {
  const { full_name, email, phone, location, service_type, price, serial_number, supporter, has_bonus } = req.body;

  try {
    const countResult = await pool.query('SELECT COUNT(*) AS total FROM clients');
    const totalClients = parseInt(countResult.rows[0].total);
    if (totalClients >= MAX_CLIENTS) {
      return res.status(400).json({ error: `Client limit of ${MAX_CLIENTS} reached.` });
    }

    const parsedPrice = isNaN(parseFloat(price)) ? null : parseFloat(price);
    const parsedBonus = has_bonus === true || has_bonus === 'true';

    const insertQuery = `
      INSERT INTO clients (
        full_name, email, phone, location,
        service_type, price, serial_number,
        supporter, has_bonus
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

    const insertValues = [full_name || null, email || null, phone || null, location || null, service_type || null, parsedPrice, serial_number || null, supporter || null, parsedBonus];

    const result = await pool.query(insertQuery, insertValues);
    res.status(201).json({ id: result.rows[0].id, message: 'Client created successfully' });
  } catch (err) {
    console.error('❌ Error inserting client:', err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT update client
app.put('/api/clients/:id', async (req, res) => {
  const id = req.params.id;
  const { full_name, email, phone, location, service_type, price, serial_number, supporter, has_bonus } = req.body;

  try {
    const parsedPrice = isNaN(parseFloat(price)) ? null : parseFloat(price);
    const parsedBonus = has_bonus === true || has_bonus === 'true';

    const updateQuery = `
      UPDATE clients SET
        full_name = $1, email = $2, phone = $3, location = $4,
        service_type = $5, price = $6, serial_number = $7,
        supporter = $8, has_bonus = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
    `;

    const updateValues = [full_name || null, email || null, phone || null, location || null, service_type || null, parsedPrice, serial_number || null, supporter || null, parsedBonus, id];

    const result = await pool.query(updateQuery, updateValues);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Client not found' });

    res.json({ message: 'Client updated successfully' });
  } catch (err) {
    console.error('❌ Error updating client:', err);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client
app.delete('/api/clients/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting client:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// GET reminders
app.get('/api/reminders', async (req, res) => {
  const query = `
    SELECT full_name, created_at
    FROM clients
    WHERE MOD(EXTRACT(DAY FROM (CURRENT_DATE - created_at)), 28) = 0
      AND CURRENT_DATE > created_at
  `;

  try {
    const result = await pool.query(query);
    const reminders = result.rows.map(client =>
      `Reminder: Client ${client.full_name}'s subscription is nearing renewal. Registered on ${client.created_at.toISOString().slice(0, 10)}`
    );
    res.json({ reminders });
  } catch (err) {
    console.error('❌ Error fetching reminders:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve React frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down gracefully...');
  pool.end(err => {
    if (err) console.error('❌ Error closing database connection:', err);
    else console.log('✅ Database connection closed.');
    process.exit(0);
  });
});









