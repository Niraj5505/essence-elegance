require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
    process.exit(1);
}

let isConnected = false;
let isConnecting = false;

const connectDB = async () => {
    if (isConnected) return;
    if (isConnecting) {
        // Wait for current connection attempt if one is in progress
        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
    }

    isConnecting = true;
    console.log('Connecting to MongoDB...');

    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        isConnected = true;
        isConnecting = false;
        console.log('MongoDB connected successfully');
    } catch (err) {
        isConnecting = false;
        const errorMsg = err.message;
        if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ENOTFOUND')) {
            console.error('DNS/Network Error: Your network is likely blocking MongoDB Atlas connections.');
            console.error('TIP: Try a different Wi-Fi network or check if a VPN/Firewall is active.');
        } else {
            console.error('MongoDB connection error:', errorMsg);
        }
    }
};

// Connect immediately
connectDB();

// Middleware to ensure DB is connected for API calls
app.use('/api', async (req, res, next) => {
    if (!isConnected) {
        await connectDB();
    }

    if (!isConnected) {
        return res.status(503).json({
            msg: 'Database unavailable. Your network may be blocking the connection (ECONNREFUSED).',
            error: 'Database Unavailable',
            tip: 'If you are on a restricted network, use a mobile hotspot or different Wi-Fi.'
        });
    }
    next();
});

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));

app.get('/', (req, res) => {
    res.send('Essence Elegance Server Running');
});

// 404 handler for API routes
app.use('/api', (req, res) => {
    res.status(404).json({ msg: 'API endpoint not found' });
});

// Basic error handler to return JSON instead of HTML
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    if (!res.headersSent) {
        res.status(500).json({
            msg: 'Internal Server Error',
            error: err.message
        });
    }
});

// Process handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Backend API available at http://localhost:${PORT}/api`);
    });
}

module.exports = app;
