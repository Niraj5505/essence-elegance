import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, Heart, Gift, ChevronRight, X, Clock, HelpCircle, ShieldCheck } from 'lucide-react';

const CartPage = () => {
    const { cart, loading, removeFromCart, updateQuantity, fetchCart } = useCart();
    const [promoCode, setPromoCode] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const validItems = cart.filter(item => item && item.product);

    const subtotal = React.useMemo(() => {
        return validItems.reduce((total, item) => total + (item.product?.price * item.quantity), 0);
    }, [validItems]);


    const shipping = 0; // Standard shipping is FREE
    const tax = 0; // Simplified for this demo
    const total = subtotal + shipping + tax;

    if (loading && cart.length === 0) {
        return (
            <div className="pt-40 text-center font-serif italic text-3xl h-screen bg-white flex flex-col items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="tracking-[0.5em] uppercase text-xs font-bold"
                >
                    Reviewing Selection...
                </motion.div>
            </div>
        );
    }

    if (validItems.length === 0) {
        return (
            <div className="pt-40 text-center px-6 min-h-screen bg-white">
                <h1 className="text-4xl font-bold mb-8">My Bag (0)</h1>
                <p className="text-zinc-500 mb-12 italic font-light">Your collection is currently empty.</p>
                <a href="/shop" className="inline-block px-12 py-4 bg-black text-white text-[10px] tracking-[0.4em] font-bold uppercase hover:bg-zinc-800 transition-all">
                    Start Exploration
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

                {/* Left Column: Bag Content */}
                <div className="flex-1 space-y-12">
                    <h1 className="text-3xl font-bold tracking-tight mb-8">
                        My Bag ({validItems.length})
                    </h1>

                    <div className="space-y-8">
                        <AnimatePresence mode="popLayout">
                            {validItems.map((item, index) => (
                                <motion.div
                                    key={item._id || `${item.product?._id}-${index}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col md:flex-row items-start gap-8 pb-8 border-b border-zinc-100 relative group"
                                >
                                    {/* Image Container */}
                                    <div className="w-full md:w-48 aspect-square bg-zinc-100 overflow-hidden relative">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 flex flex-col md:flex-row justify-between h-full pt-1">
                                        <div className="space-y-2">
                                            <h3 className="text-base font-bold tracking-wide uppercase leading-tight">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-xs text-zinc-500 italic font-light">
                                                Family: {item.product?.scentFamily}
                                            </p>

                                            <div className="flex items-center gap-6 mt-6">
                                                <button className="flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase hover:underline underline-offset-4 decoration-1 decoration-zinc-300">
                                                    <Clock className="w-3 h-3" />
                                                    Pickup Instead
                                                </button>
                                                <button className="flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase hover:underline underline-offset-4 decoration-1 decoration-zinc-300">
                                                    <Heart className="w-3 h-3" />
                                                    Save
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 mt-6 md:mt-0">
                                            {/* Top Row: Price & Remove */}
                                            <div className="flex items-center gap-4">
                                                <p className="text-sm font-bold tracking-wide">
                                                    ₹{(item.product?.price * item.quantity).toLocaleString()}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.product?._id)}
                                                    className="p-1 text-zinc-400 hover:text-black transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Bottom Row: Quantity Selector */}
                                            <div className="relative mt-2">
                                                <select
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.product?._id, parseInt(e.target.value))}
                                                    className="appearance-none border border-zinc-200 px-6 py-2 pr-10 text-xs font-bold focus:outline-none focus:border-black cursor-pointer bg-white"
                                                >
                                                    {[1, 2, 3, 4, 5].map(num => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">▼</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Gifting Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold">Gifting Options</h2>
                        <button className="w-full flex items-center justify-between border border-zinc-200 p-6 hover:border-black transition-all group">
                            <div className="flex items-center gap-4">
                                <Gift className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" />
                                <span className="text-[11px] tracking-widest font-bold uppercase">Add a Gift Message/Gift Wrap</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[400px] shrink-0">
                    <div className="sticky top-32 space-y-8">

                        {/* Promo Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                <h3 className="text-[11px] font-black tracking-[0.2em] uppercase">Apply Promos</h3>
                                <ChevronRight className="w-4 h-4 rotate-90" />
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Enter Promo Code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-1 border border-zinc-200 px-4 py-3 text-[10px] tracking-widest font-bold focus:outline-none focus:border-black"
                                />
                                <button className="px-8 py-3 bg-black text-white text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-zinc-800 transition-all">
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Wall */}
                        <div className="bg-zinc-50/50 p-8 rounded-sm space-y-8">
                            <h3 className="text-[11px] font-black tracking-[0.2em] uppercase border-b border-zinc-100 pb-4">Order Summary</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                                    <span>Standard Shipping</span>
                                    <span className="text-black font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                                    <span>Estimated Tax</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-200 flex justify-between items-baseline">
                                <span className="text-base font-bold tracking-tighter">Total</span>
                                <span className="text-xl font-bold">₹{total.toLocaleString()}</span>
                            </div>

                            <p className="text-[9px] text-zinc-500 font-medium italic text-center px-4 leading-relaxed">
                                From ₹2,400/month, or 4 payments at 0% interest with <span className="text-black font-bold not-italic">Klarna</span>.
                            </p>
                        </div>

                        {/* Express Checkout */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-[#ffc439] py-3 rounded-sm flex items-center justify-center hover:brightness-95 transition-all">
                                    <span className="text-sm italic font-bold text-[#003087]">PayPal</span>
                                </button>
                                <button className="bg-[#5a31f4] py-3 rounded-sm flex items-center justify-center hover:brightness-95 transition-all">
                                    <span className="text-sm font-bold text-white">shopPay</span>
                                </button>
                                <button className="bg-[#ff9900] py-3 rounded-sm flex items-center justify-center hover:brightness-95 transition-all">
                                    <span className="text-sm font-bold text-[#232f3e]">amazon pay</span>
                                </button>
                                <button className="bg-[#ffb3c7] py-3 rounded-sm flex items-center justify-center hover:brightness-95 transition-all">
                                    <span className="text-sm font-bold text-black">Klarna.</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 py-8">
                                <div className="flex-1 h-px bg-zinc-100" />
                                <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-300">OR</span>
                                <div className="flex-1 h-px bg-zinc-100" />
                            </div>

                            <button className="w-full bg-black text-white py-5 text-[10px] tracking-[0.4em] font-bold uppercase overflow-hidden relative group">
                                <span className="relative z-10">Proceed to Checkout</span>
                                <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-8 grid grid-cols-3 gap-4 border-t border-zinc-100">
                            {[
                                { icon: ShieldCheck, text: "Secure Checkout" },
                                { icon: HelpCircle, text: "Live Concierge" },
                                { icon: Gift, text: "Maison Gift" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center gap-2">
                                    <badge.icon className="w-4 h-4 text-zinc-300" />
                                    <span className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
