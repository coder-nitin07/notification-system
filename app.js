const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

// config the dotenv file
dotenv.config();

const app = express();

// morgan for maintain logs
app.use(morgan('dev'));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('Connected to MongoDB'))
.catch((err)=> console.log('MongoDB connection error', err));

// userRoutes for routing
app.use('/users', userRoutes);

app.use((err, req, res, next)=>{
    console.log(err);

    res.status(500).json({ message: 'Something went wrong, Please try again leter' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${ PORT }`);
});
