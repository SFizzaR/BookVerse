const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();
const app = express();
const port = process.env.PORT;
// Middleware for form data
app.use(express.urlencoded({ extended: true }));
// Middleware for JSON objects
app.use(express.json());
app.use('/', routes);
// Start the server
app.listen(port, '0.0.0.0', () => {
console.log(`Server is running on port ${port}`);
});