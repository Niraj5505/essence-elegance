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
        name: "BOIS MAROCAIN",
        price: 24289.00,
        description: "A spicy and stimulating scent that evokes the earthy richness of Moroccan cedarwood. This fragrance is a masterclass in woody sophistication, balancing raw nature with refined artistry.",
        image: "/perfumes/bois_marocain.png",
        category: "Woody",
        scentFamily: "Woody Spicy",
        topNotes: ["Pink Pepper", "Bergamot", "Black Pepper"],
        heartNotes: ["Cedarwood", "Artemisia", "Cypress"],
        baseNotes: ["Sandalwood", "Patchouli", "Thuja"],
        longevity: "8-10 Hours",
        stock: 12
    },
    {
        name: "MIDNIGHT JASMINE",
        price: 18500.00,
        description: "A nocturnal floral symphony. Midnight Jasmine captures the essence of blooming flowers under a full moon, offering a romantic and intoxicating aura that lingers beautifully.",
        image: "/perfumes/midnight_jasmine.png",
        category: "Floral",
        scentFamily: "Floral",
        topNotes: ["Neroli", "Mandarin", "Gardenia"],
        heartNotes: ["Jasmine Sambac", "Tuberose", "Orange Blossom"],
        baseNotes: ["White Musk", "Vanilla", "Amber"],
        longevity: "6-8 Hours",
        stock: 15
    },
    {
        name: "MANDARINO DI AMALFI",
        price: 20500.00,
        description: "Effervescent. Textured. Luminous. Inspired by the cliffside villas of the Amalfi coast, this scent blends zesty citrus with aromatic herbs for a refreshing Mediterranean escape.",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=2574",
        category: "Fresh",
        scentFamily: "Citrus Aromatic",
        topNotes: ["Mint", "Grapefruit", "Lemon", "Basil"],
        heartNotes: ["Black Pepper", "Coriander", "Orange Blossom"],
        baseNotes: ["Vetiver", "Amber", "Musk"],
        longevity: "5-7 Hours",
        stock: 8
    },
    {
        name: "OMBRE LEATHER",
        price: 13170.00,
        originalPrice: 15585.00,
        isSale: true,
        description: "Vast. Untethered. Driven. Ombre Leather is a deeply tactile fragrance that reveals itself like a landscape in motion, where rocks become sunrise and leather meets skin.",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2670",
        category: "Leather",
        scentFamily: "Leather",
        topNotes: ["Cardamom"],
        heartNotes: ["Leather", "Jasmine Sambac"],
        baseNotes: ["Amber", "Moss", "Patchouli"],
        longevity: "10-12 Hours",
        stock: 20
    },
    {
        name: "MYSTIC OUD",
        price: 32000.00,
        description: "A sacred journey in a bottle. Mystic Oud uses the rarest agarwood sourced from the depths of Southeast Asia, layered with smoky incense and rich spices for a transcendental experience.",
        image: "/perfumes/mystic_oud.png",
        category: "Oriental",
        scentFamily: "Woody Oriental",
        topNotes: ["Saffron", "Rosemary"],
        heartNotes: ["Oud", "Incense", "Cinnamon"],
        baseNotes: ["Leather", "Vanilla", "Sandalwood"],
        longevity: "12+ Hours",
        stock: 5
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
