import pkg from 'pg';
import env from './env.js';

const { Pool } = pkg;

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error', err);
  process.exit(1);
});

/**
 * Helper method to run queries
 */
export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;
