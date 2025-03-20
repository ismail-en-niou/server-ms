const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Declaration of routers
const UserRoute = require('./routers/userRoute');
const chatRoute = require('./routers/chatRoute');
const msgRoute = require('./routers/msgRoute');

const app = express();
let port = process.env.PORT || 5000;
let url = process.env.ATLAS_URI;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

// ✅ Handle Preflight Requests Properly
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Version 1 of routers
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/messages", msgRoute);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to our chat app');
});

// Database connection
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`✅ Database connected successfully!`);
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    });

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${port}`);
});
