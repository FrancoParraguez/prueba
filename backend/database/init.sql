-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS plate_verification;
USE plate_verification;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de placas vehiculares
CREATE TABLE IF NOT EXISTS plates (
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
);

-- Tabla de verificaciones
CREATE TABLE IF NOT EXISTS verifications (
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
);

-- Insertar usuario admin por defecto (password: admin123)
INSERT IGNORE INTO users (name, email, password, role) 
VALUES ('Administrator', 'admin@example.com', '$2a$10$rOzZJ5cH3ZzU7gU9U8qZVeGkQzQ7QxYQ7QxYQ7QxYQ7QxYQ7QxYQ7', 'admin');

-- Insertar algunas placas de ejemplo
INSERT IGNORE INTO plates (plate_number, owner, vehicle_type, vehicle_model, color) VALUES
('ABC123', 'Juan Pérez', 'car', 'Toyota Corolla', 'Azul'),
('XYZ789', 'María López', 'car', 'Honda Civic', 'Rojo'),
('JKL456', 'Carlos Ruiz', 'motorcycle', 'Yamaha YBR', 'Negro'),
('MNO123', 'Ana García', 'truck', 'Ford F-150', 'Blanco');