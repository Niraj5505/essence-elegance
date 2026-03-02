import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = React.createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userId = user.id || user._id;
            const response = await api.get(`/cart/${userId}`);
            // Safety: filter out any broken items immediately
            const rawItems = response.data.items || [];
            const sanitizedItems = rawItems.filter(item => item.product !== null);
            setCart(sanitizedItems);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productOrId, quantity = 1) => {
        if (!user) {
            alert("Please login to add items to cart.");
            window.location.href = "/login";
            return;
        }

        const productId = typeof productOrId === 'object' ? productOrId._id : productOrId;

        try {
            const userId = user.id || user._id;
            await api.post('/cart/add', {
                userId,
                productId,
                quantity
            });
            await fetchCart(); // Refresh cart data
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (!user || newQuantity < 1) return;
        try {
            const userId = user.id || user._id;
            await api.post('/cart/update', {
                userId,
                productId,
                quantity: newQuantity
            });
            await fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeFromCart = async (productId, itemId = null) => {
        if (!user) return;
        try {
            const userId = user.id || user._id;
            // If productId is missing (broken item), we can still try to remove it if we had an itemId route, 
            // but for now let's focus on the productId route.
            if (!productId) {
                console.warn("Attempting to remove item without productId");
                return;
            }
            await api.delete(`/cart/remove/${userId}/${productId}`);
            await fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            const userId = user.id || user._id;
            await api.delete(`/cart/${userId}`);
            setCart([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
