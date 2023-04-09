const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//Connect to db
mongoose.connect(process.env.DB_CONNECT);

//Middleware
app.use(express.json());

//Importing routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

//Here i can add another routes like the product route
// app.use('/api/products', authProduct);


app.listen(3000, () => console.log('Server listening on port 3000'));