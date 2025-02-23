-- scripts and data/values to insert into 'users' table in Workbench in MySQL
INSERT INTO users (username, password_hash, role, email, phone, created_at, updated_at) VALUES
('admin1', '$2b$10$eImiTXuWVxfM37uY4JANjQ==', 'admin', 'admin1@example.com', '+1234567890', '2025-02-23 12:00:00', '2025-02-23 12:00:00'),
('admin2', '$2b$10$A9c8Jfk5a5J8B/QhA7GZh.', 'admin', 'admin2@example.com', '+1987654321', '2025-02-23 12:05:00', '2025-02-23 12:05:00'),
('john_doe', '$2b$10$7wN1Bl4hNlHTXq0OiOeTzu', 'customer', 'johndoe@example.com', '+1122334455', '2025-02-23 12:10:00', '2025-02-23 12:10:00'),
('jane_doe', '$2b$10$K1fpNEaRljXy6c0Q7YZ8qe', 'customer', 'janedoe@example.com', '+2233445566', '2025-02-23 12:15:00', '2025-02-23 12:15:00'),
('mike_smith', '$2b$10$J8H8h28jJ8H2G3U6NnKpQe', 'customer', 'mike@example.com', '+3344556677', '2025-02-23 12:20:00', '2025-02-23 12:20:00'),
('sarah_connor', '$2b$10$as9dH2GJ72bsdh6N7K3h28', 'customer', 'sarah@example.com', '+4455667788', '2025-02-23 12:25:00', '2025-02-23 12:25:00'),
('alex_jones', '$2b$10$8JKc9H2M8GJnK3h2J8KpQe', 'customer', 'alex@example.com', '+5566778899', '2025-02-23 12:30:00', '2025-02-23 12:30:00'),
('emily_white', '$2b$10$J8H2N9KpQeH8G3J7Kc92b', 'customer', 'emily@example.com', '+6677889900', '2025-02-23 12:35:00', '2025-02-23 12:35:00'),
('ryan_cooper', '$2b$10$A8H2M9KpQeH3J7Kc92bJ8', 'customer', 'ryan@example.com', '+7788990011', '2025-02-23 12:40:00', '2025-02-23 12:40:00'),
('linda_wilson', '$2b$10$H2M9KpQeH8J3J7Kc92bA8', 'customer', 'linda@example.com', '+8899001122', '2025-02-23 12:45:00', '2025-02-23 12:45:00'),
('steve_harrison', '$2b$10$QeH8G3J7Kc92bJ8H2M9Kp', 'customer', 'steve@example.com', '+9900112233', '2025-02-23 12:50:00', '2025-02-23 12:50:00'),
('chris_martin', '$2b$10$J8H2M9KpQeH8G3J7Kc92b', 'customer', 'chris@example.com', '+1011121314', '2025-02-23 12:55:00', '2025-02-23 12:55:00'),
('olivia_brown', '$2b$10$M9KpQeH8G3J7Kc92bJ8H2', 'customer', 'olivia@example.com', '+1213141516', '2025-02-23 13:00:00', '2025-02-23 13:00:00'),
('daniel_clark', '$2b$10$8G3J7Kc92bJ8H2M9KpQeH', 'customer', 'daniel@example.com', '+1314151617', '2025-02-23 13:05:00', '2025-02-23 13:05:00'),
('sophia_wilson', '$2b$10$Kc92bJ8H2M9KpQeH8G3J7', 'customer', 'sophia@example.com', '+1415161718', '2025-02-23 13:10:00', '2025-02-23 13:10:00');

