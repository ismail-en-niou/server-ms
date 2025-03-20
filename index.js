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

// ✅ Use CORS Middleware (Must Be First!)
app.use(cors({
    origin: 'https://studious-goldfish-9pwrwvp777x3qqq-5174.app.github.dev', // Allow frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

// ✅ Manually Handle Preflight Requests (OPTIONS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://studious-goldfish-9pwrwvp777x3qqq-5174.app.github.dev');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // ✅ Respond to preflight with "No Content"
    }

    next();
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
