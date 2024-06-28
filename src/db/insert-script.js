const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

// Ruta al archivo SQL
const sqlFilePath = path.join(__dirname, 'insert.sql');

// Configuración de conexión a PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runInsert() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    // Leer contenido del archivo SQL
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Ejecutar el contenido SQL
    await client.query(sql);
    console.log('Data inserted successfully.');

  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL database.');
  }
}

// Ejecutar la función principal
runInsert();
