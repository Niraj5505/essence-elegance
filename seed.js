const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']); // Attempt to use Google DNS
    console.log('Using Google DNS for resolution');
} catch (e) {
    console.log('Could not set custom DNS servers');
}
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        name: "BOIS MAROCAIN EAU DE PARFUM",
        price: 24289.08,
        description: "A spicy and stimulating scent.",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2504&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Perfume"
    },
    {
        name: "FUCKING FABULOUS ALL OVER BODY SPRAY DETAILS",
        price: 1.00,
        description: "A vibrant and iconic body spray.",
        image: "https://images.unsplash.com/photo-1512777190995-2d93d56f1406?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Body Spray"
    },
    {
        name: "Mandarino Di Amalfi Eau de Parfum • 50ml",
        price: 20500.00,
        description: "Effervescent. Textured. Luminous.",
        image: "https://images.unsplash.com/photo-1620917670397-a4ad774dc594?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Perfume"
    },
    {
        name: "OMBRE LEATHER EAU DE PARFUM",
        price: 13173.77,
        originalPrice: 13585.45,
        isSale: true,
        description: "Vast. Untethered. Driven.",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Perfume"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        await Product.deleteMany({}); // Clear existing products
        console.log('Products cleared');

        await Product.insertMany(products);
        console.log('Products seeded successfully');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDB();
