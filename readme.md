car-rental-system/
├── backend/                           # Backend related files
│   ├── config/                        # Configuration files for database, JWT, etc.
│   │   ├── database.js                # Sequelize database connection setup
│   │   ├── dotenv.js                  # Environment variables setup
│   │   └── jwt.js                     # JWT configuration for token generation/verification
│   ├── controllers/                   # Controller files for business logic
│   │   ├── authController.js          # Handles authentication (login, register)
│   │   ├── carController.js           # Handles car management (add, update, delete)
│   │   ├── bookingController.js       # Handles booking management
│   │   └── paymentController.js       # Handles payment processing
│   ├── middleware/                    # Custom middlewares for authentication, validation, etc.
│   │   └── auth.js                    # JWT authentication middleware
│   ├── models/                        # Sequelize models for database tables
│   │   ├── User.js                    # User model (Users table)
│   │   ├── Car.js                     # Car model (Cars table)
│   │   └── BookingPayment.js          # BookingPayment model (Bookings and Payments table)
│   ├── routes/                        # API route files
│   │   ├── authRoutes.js              # Routes for authentication (login, register)
│   │   ├── carRoutes.js               # Routes for managing cars
│   │   ├── bookingRoutes.js           # Routes for handling bookings
│   │   └── paymentRoutes.js           # Routes for payment processing
│   ├── utils/                         # Utility files (helpers, services, etc.)
│   │   └── helpers.js                 # Helper functions (e.g., formatting dates, calculating costs)
│   ├── app.js                         # Main Express application setup
│   └── server.js                      # Server entry point
├── frontend/                          # Frontend related files
│   ├── assets/                        # Static assets like images, fonts, etc.
│   │   ├── css/
│   │   │   └── style.css              # General styles for the website
│   │   ├── js/
│   │   │   └── main.js                # JavaScript file for handling frontend logic (AJAX, form validation, etc.)
│   │   └── images/                    # Folder for storing images (e.g., car images)
│   ├── pages/                         # HTML pages
│   │   ├── index.html                 # Home page
│   │   ├── login.html                 # Login page
│   │   ├── register.html              # Register page
│   │   ├── dashboard.html             # Admin dashboard for managing cars and bookings
│   │   └── booking.html               # Customer booking page
│   └── api/                           # API interaction (AJAX/Fetch API)
│       └── api.js                     # Handles API calls (login, registration, fetching car data, etc.)
├── .env                               # Environment variables (DB credentials, JWT secret, etc.)
├── .gitignore                         # Git ignore file (to exclude unnecessary files)
├── package.json                       # Node.js project configuration (dependencies, scripts, etc.)
└── README.md                          # Project documentation (description, setup, etc.)
