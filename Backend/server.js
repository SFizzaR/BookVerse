const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
const homepageroutes=require('./homepageroutes');
const authroutes=require('./authroutes');
const readerRoutes=require('./readerRoutes');
const readinglistroutes=require('./readingListRoutes');
const pprofileRoutes=require('./profileRoutes');
const badgesRoutes=require('./badgeRoutes');
//const path = require('path');
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
app.use('/reader',readerRoutes);
app.use('/readinglist',readinglistroutes);
app.use('/profile',pprofileRoutes);
app.use('/badges',badgesRoutes);
//app.use('/assets', express.static(path.join(__dirname, '../Frontend/src/assets')));

// Start the server
app.listen(port, '0.0.0.0', () => {
console.log(`Server is running on port ${port}`);
});