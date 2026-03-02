const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log('--- MongoDB Connection Test ---');
console.log('URI:', uri ? uri.replace(/:([^@]+)@/, ':****@') : 'NOT DEFINED'); // Hide password
console.log('Attempting to connect...');

const directUri = uri.replace('mongodb+srv://', 'mongodb://')
    .replace('cluster0.la5bw0i.mongodb.net', 'ac-mo1r3ia-shard-00-01.la5bw0i.mongodb.net')
    + (uri.includes('?') ? '&' : '?') + 'ssl=true&authSource=admin';

console.log('Attempting direct connection to shard 01...');
mongoose.connect(directUri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB Atlas directly!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE: Could not connect.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);

        if (err.message.includes('ECONNREFUSED')) {
            console.log('\nPossible causes:');
            console.log('1. Your IP address is not whitelisted in MongoDB Atlas.');
            console.log('2. Your network (firewall) is blocking port 27017.');
        } else if (err.message.includes('querySrv ENOTFOUND')) {
            console.log('\nPossible causes:');
            console.log('1. DNS issues. Your network might not support SRV records.');
            console.log('2. The hostname in your connection string is incorrect.');
        }

        process.exit(1);
    });
