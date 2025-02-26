/*
The file to handle JWT authentication. This middleware will verify JWT tokens and attach the decoded user information to the request object. 
*/
const authController = require('../controllers/auth.controller');

module.exports = authController;

