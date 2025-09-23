// database.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306, // Usa el puerto del .env o 3306 por defecto
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // puedes ajustar según la carga
  queueLimit: 0
});

// Probar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Database connection error:', err.message);
  } else {
    console.log(' Successfully connected to the database');
    connection.release();
  }
});

module.exports = pool.promise();
