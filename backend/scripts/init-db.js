const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔌 Attempting to connect to MySQL...');
    
    // Conexión inicial sin base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '', // ¡IMPORTANTE!
      connectTimeout: 10000,
      reconnect: true
    });

    console.log('✅ Connected to MySQL server');

    // Crear base de datos si no existe
    const dbName = process.env.DB_NAME || 'plate_verification';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created or already exists`);

    // Cambiar a la base de datos
    await connection.execute(`USE \`${dbName}\``);
    console.log(`✅ Using database '${dbName}'`);

    // Leer y ejecutar schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('⚠️  Schema file not found, creating basic tables...');
      await createBasicTables(connection);
    } else {
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.execute(statement);
          } catch (error) {
            console.log(`⚠️  Warning executing statement: ${error.message}`);
          }
        }
      }
      console.log('✅ Schema executed successfully');
    }

    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Is MySQL installed and running?');
    console.log('2. Check your DB_PASSWORD in .env file');
    console.log('3. Try: mysql -u root -p (to test connection)');
    console.log('4. For XAMPP: Make sure MySQL is started in XAMPP Control Panel');
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createBasicTables(connection) {
  // Crear tablas básicas si no existe el archivo schema.sql
  const tablesSQL = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS plates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plate_number VARCHAR(20) UNIQUE NOT NULL,
      owner VARCHAR(255) NOT NULL,
      vehicle_type ENUM('car', 'motorcycle', 'truck', 'bus') NOT NULL,
      vehicle_model VARCHAR(255) NOT NULL,
      color VARCHAR(100) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS verifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plate_number VARCHAR(20) NOT NULL,
      recognized_plate VARCHAR(20) NOT NULL,
      confidence FLOAT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      is_match BOOLEAN NOT NULL,
      verified_by INT NOT NULL,
      latitude DECIMAL(10, 8) NULL,
      longitude DECIMAL(11, 8) NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    `INSERT IGNORE INTO users (name, email, password, role) VALUES 
    ('Admin', 'admin@example.com', '$2a$10$rOzZJ5cH3ZzU7gU9U8qZVeGkQzQ7QxYQ7QxYQ7QxYQ7QxYQ7QxYQ7', 'admin')`,

    `INSERT IGNORE INTO plates (plate_number, owner, vehicle_type, vehicle_model, color) VALUES
    ('ABC123', 'Juan Pérez', 'car', 'Toyota Corolla', 'Azul'),
    ('XYZ789', 'María López', 'car', 'Honda Civic', 'Rojo')`
  ];

  for (const sql of tablesSQL) {
    await connection.execute(sql);
  }
  
  console.log('✅ Basic tables created successfully');
}

initializeDatabase();