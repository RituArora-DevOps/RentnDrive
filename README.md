 Online Booking System for Car Rental

Names of members of the team 
Aliev Khadis, Wang Haitao, Ritu Arora

The Online Booking System for Car Rental allows customers to easily browse and book cars for rent while enabling admins to manage the fleet efficiently. Customers can search for available cars, make bookings, and process payments, while admins can add or remove cars, track bookings, and monitor payment statuses. The system is designed with a simple 4-table database structure, focusing on user management, car details, bookings, and payments.
The system includes a Users Table for storing customer and admin info, a Cars Table for car details and availability, a Bookings Table for managing rental reservations, and a Payments Table for tracking payment transactions. With secure login, car availability tracking, and real-time booking management, this platform offers a simple and effective solution for both customers and admins in the car rental business.

Technologies used
	Frontend: HTML, CSS, JavaScript 
	Backend: Node.js, Express.js
	Database: MySQL, Sequelize (ORM tool)
	Authentication: JWT (JSON Web Tokens) for secure user authentication
	Calendar Integration: FullCalendar for managing car availability
	APIs: RESTful API architecture for communication between frontend and backend
	Deployment: Cloud for hosting the application

Special features and challenging items

Booking Wizard: A step-by-step interface that simplifies the booking process for users.
Car Availability Calendar: A calendar view showing available cars for specific dates, allowing managers to track bookings in real-time.
User Authentication: Secure login/logout functionality for customers and administrators with role-based access.
Admin Dashboard: A user-friendly dashboard where the car rental manager can manage the fleet and monitor bookings.

Additional libraries
Chart.js for displaying usage statistics (for future enhancement)
Analytics and Reports: Charts that visualize car usage trends, helping managers understand peak rental times and customer preferences.

URLs (include API calls):
These URLs will need to handle various tasks such as user authentication, managing bookings, handling car data, and generating reports. The system will use RESTful APIs for communication between the frontend and backend.
1. User Management
Login
URL: /api/login (POST)
Description: Authenticates a user.
Register User
URL: /api/register (POST)
Description: Registers a new user.
Get User Info
URL: /api/users/{userId} (GET)
Description: Retrieves user profile.

2. Car Management (Admin)
Get All Cars
URL: /api/cars (GET)
Description: Retrieves all cars.
Add New Car
URL: /api/cars (POST)
Description: Adds a new car.
Update Car
URL: /api/cars/{carId} (PUT)
Description: Updates car details.
Delete Car
URL: /api/cars/{carId} (DELETE)
Description: Deletes a car.

3. Booking Management (Customer)
Get Available Cars
URL: /api/cars/available (GET)
Description: Retrieves available cars for selected dates.
Make a Booking
URL: /api/bookings (POST)
Description: Makes a booking for a car.

4. Payments
Process Payment
URL: /api/payments (POST)
Description: Processes payment for a booking.

API Request Workflow
1. Customer Logs In
Request: POST /api/login
Response: Receives JWT token for authentication.
2. Customer Searches for Cars
Request: GET /api/cars/available?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
Description: Searches for available cars for specific dates (you can add optional filters such as car type, location, etc., depending on your requirements).
3. Admin Adds a New Car
Request: POST /api/cars
Description: Admin adds a new car to the fleet with details such as make, model, price, and availability.
4. Admin Reviews Analytics (Optional, if implemented)
Request: GET /api/analytics/usage
Description: This is not part of the previous API list but can be added if you're tracking analytics like car usage. You might need to create this endpoint for admins to access stats.
5. Customer Makes a Booking
Request: POST /api/bookings
Description: Customer makes a booking for a car by providing booking details like the car, rental dates, etc.
6. Admin Reviews the Booking
Request: GET /api/bookings/{bookingId}
Description: Admin can review details for a specific booking.
7. Admin Tracks Car Availability (Optional, can use FullCalendar API integration)
Request: GET /api/cars/available?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
Description: Admin tracks availability of cars (This could be part of the same /available API).
8. Customer Makes a Payment
Request: POST /api/payments
Description: Customer completes payment for the booking.
9. Admin Generates an Invoice (Optional, needs a specific endpoint for invoices)
Request: GET /api/invoices/{invoiceId}
Description: Admin can generate an invoice for the booking (you might need to implement an invoice system and a new API).

Key Points to Consider:
Car Search: We might want to add filtering options (e.g., by car type, location, or price range) to the /api/cars/available endpoint.
Analytics: If analytics (e.g., car usage trends) are part of the system, we'll need a /api/analytics endpoint to generate reports.
Invoice: If invoices are needed, we would have to create a /api/invoices/{invoiceId} endpoint to support the "Generate Invoice" functionality.

Database Design

1. Users Table
This table stores user information for both customers and admins.
Table: users
id: INT (Primary Key, auto-incrementing ID)
username: VARCHAR(255) (Unique username for login)
password_hash: VARCHAR(255) (Hashed password for authentication)
role: ENUM('admin', 'customer') (Role of the user: admin or customer)
email: VARCHAR(255) (Email address for communication)
phone: VARCHAR(20) (Phone number - optional)
created_at: DATETIME (Timestamp for when the user was created)
updated_at: DATETIME (Timestamp for when the user was last updated)

2. Cars Table
This table stores car details like make, model, rental price, and availability status.
Table: cars
id: INT (Primary Key, auto-incrementing ID)
make: VARCHAR(255) (Car's make, e.g., Toyota, Ford)
model: VARCHAR(255) (Car's model, e.g., Corolla, Focus)
year: INT (Year of manufacture)
price_per_day: DECIMAL(10,2) (Price per day for renting the car)
status: ENUM('available', 'booked', 'maintenance') (Current status of the car)

3. Bookings Table
This table stores booking details, including rental dates, customer information, and car booked.
Table: bookings
id: INT (Primary Key, auto-incrementing ID)
user_id: INT (Foreign Key linking to users(id), referencing the customer)
car_id: INT (Foreign Key linking to cars(id), referencing the car booked)
start_date: DATE (Date when the rental starts)
end_date: DATE (Date when the rental ends)
total_amount: DECIMAL(10,2) (Total amount for the booking)
status: ENUM('pending', 'confirmed', 'cancelled', 'completed') (Booking status)
created_at: DATETIME (Timestamp when the booking was created)
updated_at: DATETIME (Timestamp when the booking was last updated)

4. Payments Table
This table stores payment information related to bookings.
Table: payments
id: INT (Primary Key, auto-incrementing ID)
booking_id: INT (Foreign Key linking to bookings(id), referencing the associated booking)
amount: DECIMAL(10,2) (Amount paid for the booking)
payment_date: DATETIME (Date and time of payment)
payment_method: ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer') (Payment method used)
status: ENUM('pending', 'completed', 'failed') (Payment status)

Merging booking_payments
The booking_payments table is designed to store comprehensive information about car rental bookings and their associated payments. It includes the following fields:

id (Primary Key, auto-increment): A unique identifier for each booking and payment entry.
user_id (Foreign Key): Links to the users table, identifying the customer who made the booking.
car_id (Foreign Key): Links to the cars table, referencing the specific car being rented.
start_date (DATE): The start date of the car rental.
end_date (DATE): The end date of the car rental.
total_amount (DECIMAL): The total price for the booking, including any extra features.
status (ENUM: 'pending', 'confirmed', 'cancelled', 'completed'): The current status of the booking.
payment_status (ENUM: 'pending', 'completed', 'failed'): The status of the payment for the booking.
payment_method (ENUM: 'credit_card', 'debit_card', 'paypal', 'bank_transfer'): The payment method used by the customer.
payment_date (DATETIME): The date and time when the payment was made.
extra_features (JSON or VARCHAR): A field storing any extra services or features opted for by the customer, such as GPS, additional drivers, or insurance.


Relationships:
Users ↔ Bookings: One user (customer) can have multiple bookings. Each booking is linked to a single user (customer).
Cars ↔ Bookings: One car can be associated with multiple bookings over time. Each booking corresponds to one car.
Bookings ↔ Payments: One booking can have one payment. Each payment corresponds to one booking.

Use case diagram with actors performing actions on the system




Login:
Actor: Customer or Admin.
Database Table Affected: users.
Description: User logs into the system, which checks the credentials stored in the users table.
Search Cars:
Actor: Customer.
Database Table Affected: cars.
Description: Customers search for cars available for rental by applying filters such as make, model, price, or availability (though availability can be checked indirectly through bookings).
View Car Details:
Actor: Customer.
Database Table Affected: cars.
Description: Customer views more details of the selected car, such as make, model, price, and status.
Make a Booking:
Actor: Customer.
Database Table Affected: bookings.
Description: A customer makes a booking by selecting a car, specifying rental dates, and confirming the booking. A new booking entry is created in the bookings table.
View Booking Details:
Actor: Customer.
Database Table Affected: bookings.
Description: A customer can view the details of their current or past booking, which will pull data from the bookings table.
Cancel a Booking:
Actor: Customer.
Database Table Affected: bookings.
Description: A customer cancels their booking, which updates the booking status in the bookings table (e.g., from confirmed to cancelled).
Update Booking Status:
Actor: Admin.
Database Table Affected: bookings.
Description: Admin can change the booking status (e.g., pending to confirmed or cancelled).
Add Car to Rental Fleet:
Actor: Admin.
Database Table Affected: cars.
Description: Admin adds a new car to the fleet by providing details like make, model, year, and price. This information is stored in the cars table.
Update Car Information:
Actor: Admin.
Database Table Affected: cars.
Description: Admin updates car information, such as price, model, or status. Changes are reflected in the cars table.
Delete Car from Fleet:
Actor: Admin.
Database Table Affected: cars.
Description: Admin removes a car from the rental fleet by deleting it from the cars table.
Process Payment:
Actor: Customer.
Database Table Affected: payments, bookings.
Description: Customer processes payment for a booking, which records the payment details in the payments table. Once the payment is completed, the booking status is updated.
View Payment Details:
Actor: Customer.
Database Table Affected: payments.
Description: A customer can view the details of their payment, which will pull data from the payments table.
Generate Report on Bookings:
Actor: Admin.
Database Table Affected: bookings, payments.
Description: Admin can generate reports based on the bookings table, such as filtering by date, car, customer, etc. Payments associated with bookings can also be included.
Generate Report on Payments:
Actor: Admin.
Database Table Affected: payments.
Description: Admin can generate reports on payment transactions, including payment amounts, methods, and statuses.







