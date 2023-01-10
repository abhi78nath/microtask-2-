const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const port = 5000 || process.env.PORT;
const app = express();

// Database connection
dotenv.config({ path: './config.env' });
require('./db/conn');

// const User = require('./model/userSchema')
app.use(express.json());

app.use('/', require('./router/visitorCount'))
app.use('/auth', require('./router/auth'));
app.get("/", (req,res) =>{
    res.send('<h2>Welcome to Microtask 2')
})

app.listen(port, (req,res) =>{
    console.log(`Server has started at http://127.0.0.1:${port}`);
})
