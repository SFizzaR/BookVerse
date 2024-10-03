const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
const homepageroutes=require('./homepageroutes');
const authroutes=require('./authroutes');

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;
// Middleware for form data
app.use(express.urlencoded({ extended: true }));
// Middleware for JSON objects
app.use(express.json());
app.use('/', routes);
app.use('/home',homepageroutes);
app.use('/author',authroutes);
// Start the server
app.listen(port, '0.0.0.0', () => {
console.log(`Server is running on port ${port}`);
});
