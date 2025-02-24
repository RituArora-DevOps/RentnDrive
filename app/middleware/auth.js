/*
The file to handle JWT authentication. This middleware will verify JWT tokens and attach the decoded user information to the request object. 
*/
const jwt = require("jsonwebtoken");
const log = require("../../logger");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        log.warn(`Token verification failed: ${error.message}`);
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = { verifyToken };

/*
Explanation:

const jwt = require("jsonwebtoken"); and const log = require("../logger");
These lines import the necessary modules: jsonwebtoken for JWT verification and your logging module.
  
const verifyToken = (req, res, next) => { ... }
This defines the verifyToken middleware function.
It takes three arguments: req (request object), res (response object), and next (function to call the next middleware or route handler).
const token = req.header("Authorization");
This line retrieves the JWT token from the Authorization header of the request.
The token is expected to be in the format "Bearer <token>".
if (!token) { ... }
This if block checks if a token is present in the header.
If no token is found, it sends a 401 (Unauthorized) response with an error message.
try { ... } catch (error) { ... }
This try-catch block handles token verification.
const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
This line verifies the JWT token using jwt.verify().
token.replace("Bearer ", "") removes the "Bearer " prefix from the token.
process.env.JWT_SECRET is your secret key used to sign the token.
If the token is valid, jwt.verify() returns the decoded payload (user information).
req.user = decoded;
This line attaches the decoded user information to the req.user property.
This allows subsequent middleware or route handlers to access the user's information.
next();
This line calls the next() function, which proceeds to the next middleware or route handler.
catch (error) { ... }
If the token is invalid or verification fails, this catch block executes.
It logs the error and sends a 400 (Bad Request) response with an error message.
module.exports = { verifyToken };
This line exports the verifyToken middleware function.
How to Use It:

Import the verifyToken middleware into your route files.
Apply the middleware to routes that require authentication.
*/