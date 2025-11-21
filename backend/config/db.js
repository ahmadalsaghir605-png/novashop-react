import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'gmailacount2',
  database: process.env.DB_NAME || 'novashop_db',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: false
});

export const getConnection = () => pool.getConnection();
export const query = (sql, params = []) => pool.execute(sql, params);

export async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log('✅ MySQL connection ready');
  } finally {
    connection.release();
  }
}

export default pool;
