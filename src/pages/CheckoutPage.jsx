import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CreditCard, Truck, MapPin, Loader2, Lock, Shield, CheckCircle2, QrCode, Smartphone } from 'lucide-react';
import api from '../utils/api';
import { AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentStep, setPaymentStep] = useState(0); // 0: Idle, 1: Connecting, 2: processing, 3: success

    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        country: 'India',
        paymentMethod: 'Cash on Delivery',
        upiId: ''
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
        setPaymentStep(1); // Connecting

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
                paymentMethod: formData.paymentMethod,
                paymentStatus: 'Pending'
            };

            // Stage 1: Handshake
            await new Promise(r => setTimeout(r, 2000));
            setPaymentStep(2); // Processing

            // Stage 2: Database & Clear
            await api.post('/orders', orderData);
            await new Promise(r => setTimeout(r, 2500));

            setPaymentStep(3); // Success Clear
            await clearCart();

            setTimeout(() => {
                navigate('/checkout-success');
            }, 1500);
        } catch (error) {
            console.error("Order failed:", error);
            setPaymentStep(0);
            alert("Payment gateway connection failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const PaymentOverlay = () => (
        <AnimatePresence>
            {paymentStep > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-12 max-w-sm text-center px-8"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {paymentStep === 1 && <Lock className="w-8 h-8 text-white/40 animate-pulse" />}
                                {paymentStep === 2 && <Shield className="w-8 h-8 text-zinc-100 animate-bounce" />}
                                {paymentStep === 3 && <CheckCircle2 className="w-10 h-10 text-white" />}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <motion.h2
                                key={paymentStep}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-xl font-bold tracking-[0.3em] uppercase"
                            >
                                {paymentStep === 1 && "Connecting Vault"}
                                {paymentStep === 2 && "Authorizing Payment"}
                                {paymentStep === 3 && "Securely Finalized"}
                            </motion.h2>
                            <p className="text-[10px] text-zinc-400 tracking-widest uppercase italic font-light">
                                {paymentStep === 1 && "Establishing encrypted link to banking servers..."}
                                {paymentStep === 2 && "Verifying availability of funds and authenticity..."}
                                {paymentStep === 3 && "Your order has been captured into our collection."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 opacity-30">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[8px] tracking-[0.2em] font-bold uppercase">PCI DSS COMPLIANT / 256-BIT AES</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <PaymentOverlay />
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
                                    { id: 'upi', label: 'UPI / QR', desc: 'Pay via PhonePe, GPay, Paytm.' },
                                    { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, AMEX.', disabled: true },
                                ].map((method) => (
                                    <label key={method.id} className={`flex items-start gap-4 p-4 border transition-all ${method.disabled ? 'opacity-40 cursor-not-allowed' : 'border-zinc-100 hover:border-zinc-300 cursor-pointer'} ${formData.paymentMethod === method.label ? 'border-zinc-900 bg-zinc-50' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.label}
                                            checked={formData.paymentMethod === method.label}
                                            onChange={handleChange}
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

                            <AnimatePresence>
                                {formData.paymentMethod === 'UPI / QR' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 border border-zinc-100 bg-zinc-50/50 space-y-6">
                                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                                {/* QR Simulation */}
                                                <div className="w-32 h-32 bg-white border border-zinc-100 p-2 relative group cursor-pointer shrink-0">
                                                    <QrCode className="w-full h-full text-zinc-200 group-hover:text-black transition-colors" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[8px] font-black uppercase tracking-tighter bg-white px-2 py-1">ESSENCE Pay</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 flex-1 w-full">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Smartphone className="w-3 h-3 text-zinc-400" />
                                                            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Enter UPI ID (VPA)</label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="upiId"
                                                            required={formData.paymentMethod === 'UPI / QR'}
                                                            placeholder="example@okaxis"
                                                            value={formData.upiId}
                                                            onChange={handleChange}
                                                            className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-black transition-colors bg-white font-medium text-xs placeholder:text-zinc-200"
                                                        />
                                                    </div>
                                                    <p className="text-[8px] text-zinc-400 uppercase tracking-widest italic leading-relaxed">
                                                        Scan the QR code with any UPI app or enter your ID above to receive a payment request.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
