-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Cars Table
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'booked', 'maintenance') NOT NULL
);

-- add a new column, imageURL, data type string -
-- 3. Booking-payment Table
CREATE TABLE booking_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    car_id INT,
    start_date DATE,
    end_date DATE,
    total_amount DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer'),
    payment_status ENUM('pending', 'completed', 'failed'),
    amount DECIMAL(10, 2),
    payment_date DATETIME,
    extra TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);
