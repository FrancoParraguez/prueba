import mysql from 'mysql2/promise';
import logger from '../utils/logger';

let pool: mysql.Pool;

const connectDB = async (): Promise<void> => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'plate_verification',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Probar la conexión
    const connection = await pool.getConnection();
    logger.info('✅ MySQL Connected successfully in Docker');
    connection.release();
  } catch (error) {
    logger.error('❌ Error connecting to MySQL in Docker:', error);
    throw error;
  }
};

export const getConnection = (): Promise<mysql.PoolConnection> => {
  return pool.getConnection();
};

export const query = async (sql: string, params?: any[]): Promise<any> => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    logger.error('❌ Database query error:', error);
    throw error;
  }
};

export default connectDB;