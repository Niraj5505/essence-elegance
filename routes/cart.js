const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get Cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.params.userId, items: [] });
            await cart.save();
        } else {
            // Filter out items where product no longer exists
            const originalLength = cart.items.length;
            cart.items = cart.items.filter(item => item.product !== null);
            if (cart.items.length !== originalLength) {
                await cart.save();
            }
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to Cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Find index using string comparison to be safe
        const itemIndex = cart.items.findIndex(item =>
            item.product && item.product.toString() === productId.toString()
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity) || 1;
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity) || 1 });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error("Cart Add Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Update Quantity
router.post('/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item =>
            item.product && item.product.toString() === productId.toString()
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = Number(quantity);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: "Product not in cart" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove Item from Cart
router.delete('/remove/:userId/:productId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item =>
            item.product && item.product.toString() !== req.params.productId
        );

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Clear Cart
router.delete('/:userId', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.params.userId });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
