
select * from cars;
select * from users;
select * from booking_payments; -- unnecessary table
select * from rentals;

SET SQL_SAFE_UPDATES = 0;
-- Drop data from rentals table
DELETE FROM rentals;

-- Reset auto-increment counter for rentals table (if needed)
ALTER TABLE rentals AUTO_INCREMENT = 1;

-- Drop data from cars table
DELETE FROM cars;

-- Reset auto-increment counter for cars table (if needed)
ALTER TABLE cars AUTO_INCREMENT = 1;

-- Drop data from users table
DELETE FROM users;

-- Reset auto-increment counter for users table (if needed)
ALTER TABLE users AUTO_INCREMENT = 1;

-- Insert 15 users
INSERT INTO users (username, password_hash, role, email, phone, created_at, updated_at) VALUES
('user1', 'hashed_pass1', 'customer', 'user1@example.com', '123-456-7890', NOW(), NOW()),
('user2', 'hashed_pass2', 'customer', 'user2@example.com', '987-654-3210', NOW(), NOW()),
('user3', 'hashed_pass3', 'customer', 'user3@example.com', '111-222-3333', NOW(), NOW()),
('user4', 'hashed_pass4', 'customer', 'user4@example.com', '444-555-6666', NOW(), NOW()),
('user5', 'hashed_pass5', 'customer', 'user5@example.com', '777-888-9999', NOW(), NOW()),
('admin1', 'hashed_admin1', 'admin', 'admin1@example.com', '100-200-3000', NOW(), NOW()),
('admin2', 'hashed_admin2', 'admin', 'admin2@example.com', '400-500-6000', NOW(), NOW()),
('user6', 'hashed_pass6', 'customer', 'user6@example.com', '222-333-4444', NOW(), NOW()),
('user7', 'hashed_pass7', 'customer', 'user7@example.com', '555-666-7777', NOW(), NOW()),
('user8', 'hashed_pass8', 'customer', 'user8@example.com', '888-999-0000', NOW(), NOW()),
('user9', 'hashed_pass9', 'customer', 'user9@example.com', '333-444-5555', NOW(), NOW()),
('user10', 'hashed_pass10', 'customer', 'user10@example.com', '666-777-8888', NOW(), NOW()),
('user11', 'hashed_pass11', 'customer', 'user11@example.com', '999-000-1111', NOW(), NOW()),
('user12', 'hashed_pass12', 'customer', 'user12@example.com', '121-343-5656', NOW(), NOW()),
('user13', 'hashed_pass13', 'customer', 'user13@example.com', '787-909-1212', NOW(), NOW());

-- Insert 15 cars
INSERT INTO cars (make, model, year, price_per_day, status, type) VALUES
('Toyota', 'Camry', 2022, 50.00, 'available', 'Sedan'),
('Honda', 'Civic', 2021, 45.00, 'available', 'Sedan'),
('Ford', 'Mustang', 2023, 80.00, 'available', 'Coupe'),
('Chevrolet', 'Suburban', 2020, 70.00, 'available', 'SUV'),
('BMW', 'X5', 2022, 90.00, 'available', 'SUV'),
('Mercedes', 'C-Class', 2023, 85.00, 'available', 'Sedan'),
('Audi', 'A4', 2021, 75.00, 'available', 'Sedan'),
('Nissan', 'Altima', 2022, 55.00, 'available', 'Sedan'),
('Hyundai', 'Sonata', 2023, 60.00, 'available', 'Sedan'),
('Kia', 'Sorento', 2020, 65.00, 'available', 'SUV'),
('Volkswagen', 'Golf', 2022, 52.00, 'available', 'Hatchback'),
('Subaru', 'Outback', 2021, 68.00, 'available', 'SUV'),
('Mazda', 'CX-5', 2023, 72.00, 'available', 'SUV'),
('Jeep', 'Wrangler', 2020, 78.00, 'available', 'SUV'),
('Tesla', 'Model 3', 2022, 100.00, 'available', 'Sedan');

ALTER TABLE rentals
DROP COLUMN createdAt,
DROP COLUMN updatedAt;

-- Insert 15 rentals
INSERT INTO booking_payments (user_id, car_id, start_date, end_date, total_amount, status, payment_method, payment_status, amount, payment_date, extra, created_at, updated_at) VALUES
(1, 1, '2024-01-10', '2024-01-15', 250.00, 'confirmed', 'credit_card', 'completed', 250.00, NOW(), 'GPS, Child Seat', NOW(), NOW()),
(2, 2, '2024-01-20', '2024-01-25', 225.00, 'confirmed', 'paypal', 'completed', 225.00, NOW(), 'Additional Driver', NOW(), NOW()),
(3, 3, '2024-02-01', '2024-02-07', 480.00, 'confirmed', 'stripe', 'completed', 480.00, NOW(), 'Insurance', NOW(), NOW()),
(4, 4, '2024-02-10', '2024-02-15', 350.00, 'pending', 'bank_transfer', 'pending', NULL, 'None', NOW(), NOW()),
(5, 5, '2024-02-20', '2024-02-28', 720.00, 'confirmed', 'credit_card', 'completed', 720.00, NOW(), 'GPS', NOW(), NOW()),
(6, 6, '2024-03-01', '2024-03-05', 340.00, 'confirmed', 'paypal', 'completed', 340.00, NOW(), 'Additional Driver, Insurance', NOW(), NOW()),
(7, 7, '2024-03-10', '2024-03-17', 525.00, 'pending', 'stripe', 'pending', NULL, 'None', NOW(), NOW()),
(8, 8, '2024-03-20', '2024-03-25', 275.00, 'confirmed', 'bank_transfer', 'completed', 275.00, NOW(), 'GPS, Child Seat', NOW(), NOW()),
(9, 9, '2024-04-01', '2024-04-08', 420.00, 'confirmed', 'credit_card', 'completed', 420.00, NOW(), 'Additional Driver', NOW(), NOW()),
(10, 10, '2024-04-10', '2024-04-14', 260.00, 'pending', 'paypal', 'pending', NULL, 'Insurance', NOW(), NOW()),
(11, 11, '2024-04-20', '2024-04-27', 364.00, 'confirmed', 'stripe', 'completed', 364.00, NOW(), 'GPS, Additional Driver', NOW(), NOW()),
(12, 12, '2024-05-01', '2024-05-06', 260.00, 'confirmed', 'bank_transfer', 'completed', 260.00, NOW(), 'None', NOW(), NOW()),
(13, 13, '2024-05-10', '2024-05-17', 504.00, 'pending', 'credit_card', 'pending', NULL, 'GPS', NOW(), NOW()),
(14, 14, '2024-05-20', '2024-05-25', 390.00, 'confirmed', 'paypal', 'completed', 390.00, NOW(), 'Additional Driver, Child Seat', NOW(), NOW()),
(15, 15, '2024-06-01', '2024-06-08', 700.00, 'confirmed', 'stripe', 'completed', 700.00, NOW(), 'Insurance, GPS', NOW(), NOW());