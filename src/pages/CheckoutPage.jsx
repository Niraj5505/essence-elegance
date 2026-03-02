import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CreditCard, Truck, MapPin, Loader2 } from 'lucide-react';
import api from '../utils/api';

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        paymentMethod: 'Cash on Delivery'
    });

    if (!user) return <Navigate to="/login" />;
    if (cart.length === 0) return <Navigate to="/shop" />;

    const validItems = cart.filter(item => item && item.product);
    const subtotal = validItems.reduce((total, item) => total + (item.product?.price * item.quantity), 0);
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const orderData = {
                user: user.id || user._id,
                items: validItems.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                totalAmount: total,
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    zip: formData.zip,
                    state: formData.state,
                    country: formData.country
                },
                paymentMethod: formData.formData,
                paymentStatus: 'Pending'
            };

            await api.post('/orders', orderData);
            await clearCart();

            setTimeout(() => {
                navigate('/checkout-success');
            }, 1000);
        } catch (error) {
            console.error("Order failed:", error);
            alert("Payment gateway connection failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

                {/* Left Column: Form */}
                <div className="flex-1 space-y-12">
                    <div className="flex items-center gap-4 text-[10px] tracking-widest font-bold uppercase text-zinc-400 mb-4">
                        <span className="text-black">Information</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>Shipping</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>Payment</span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">Delivery Details</h1>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Shipping Address */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <MapPin className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-[11px] font-black tracking-widest uppercase">Shipping Address</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Street Address</label>
                                    <input
                                        required
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Flat/House No., Building, Street Name"
                                        className="w-full border-b border-zinc-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-300 italic font-light"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">City</label>
                                        <input
                                            required
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Mumbai"
                                            className="w-full border-b border-zinc-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Zip Code</label>
                                        <input
                                            required
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="400001"
                                            className="w-full border-b border-zinc-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-300"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">State / Province</label>
                                        <input
                                            required
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Maharashtra"
                                            className="w-full border-b border-zinc-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Country</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full border-b border-zinc-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent appearance-none"
                                        >
                                            <option value="India">India</option>
                                            <option value="UAE">UAE</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                            <option value="France">France</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-[11px] font-black tracking-widest uppercase">Payment Method</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'cod', label: 'Cash on Delivery', desc: 'Secure payment at your doorstep.' },
                                    { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, AMEX.', disabled: true },
                                    { id: 'upi', label: 'UPI / QR', desc: 'Pay via PhonePe, GPay, Paytm.', disabled: true }
                                ].map((method) => (
                                    <label key={method.id} className={`flex items-start gap-4 p-4 border transition-all ${method.disabled ? 'opacity-40 cursor-not-allowed' : 'border-zinc-100 hover:border-zinc-300 cursor-pointer'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            defaultChecked={method.id === 'cod'}
                                            disabled={method.disabled}
                                            className="mt-1 accent-black"
                                        />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">{method.label}</p>
                                            <p className="text-[9px] text-zinc-400 italic mt-1">{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-6 text-[10px] tracking-[0.4em] font-bold uppercase relative group disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Authenticating Payment...
                                        </>
                                    ) : (
                                        "Finalize My Order"
                                    )}
                                </span>
                                {!isSubmitting && <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Order Review */}
                <div className="w-full lg:w-[450px] shrink-0">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-zinc-50 p-8 rounded-sm space-y-8">
                            <h3 className="text-[11px] font-black tracking-widest uppercase border-b border-zinc-100 pb-4">In Your Collection</h3>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                {validItems.map((item) => (
                                    <div key={item.product?._id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white overflow-hidden">
                                            <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest">{item.product?.name}</p>
                                            <p className="text-[9px] text-zinc-400 italic">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-[10px] font-bold">₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-zinc-200 space-y-4">
                                <div className="flex justify-between text-[11px] uppercase tracking-widest text-zinc-500">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
                                    <span>Express Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="pt-4 flex justify-between items-baseline border-t border-zinc-100">
                                    <span className="text-sm font-bold tracking-widest uppercase">Total Amount</span>
                                    <span className="text-2xl font-bold">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 py-4 opacity-30">
                            {[Truck, ShieldCheck, CreditCard].map((Icon, idx) => (
                                <Icon key={idx} className="w-5 h-5" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
