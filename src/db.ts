import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_PASSWORD) {
  throw new Error('Falta DB_PASSWORD en el archivo .env');
}

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'tracker_gastos',
});