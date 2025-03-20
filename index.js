const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
let port = process.env.PORT || 5000;
let url = process.env.ATLAS_URI;

// ✅ Trust proxy (important for rate limiting)
app.set('trust proxy', 1);

// ✅ CORS Middleware
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

// ✅ Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use(limiter);

// ✅ Handle Preflight CORS Requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
});

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Routers
const UserRoute = require('./routers/userRoute');
const chatRoute = require('./routers/chatRoute');
const msgRoute = require('./routers/msgRoute');

app.use("/api/v1/users", UserRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/messages", msgRoute);

// ✅ Default route
app.get('/', (req, res) => {
    res.send('Welcome to our chat app');
});

// ✅ Database connection
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    });

// ✅ Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${port}`);
});
