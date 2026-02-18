require('dotenv').config();
const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']); // Attempt to use Google DNS
    console.log('Using Google DNS for resolution');
} catch (e) {
    console.log('Could not set custom DNS servers');
}
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

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
