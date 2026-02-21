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
    console.warn('WARNING: MONGO_URI is not defined. Database features will fail.');
}

// Optimization for Vercel: Re-use connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Connect immediately (useful for local), but also on every request if needed
connectDB();

// Middleware to ensure DB is connected for API calls
app.use(async (req, res, next) => {
    if (!isConnected && MONGO_URI) {
        await connectDB();
    }
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));

app.get('/', (req, res) => {
    res.send('Essence Elegance Server Running');
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
