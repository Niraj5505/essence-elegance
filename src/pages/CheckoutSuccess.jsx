import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
    return (
        <div className="min-h-screen bg-white pt-40 px-6 flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="mb-8"
            >
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-white mx-auto">
                    <CheckCircle className="w-12 h-12" />
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-6"
            >
                <h1 className="text-4xl font-bold tracking-tight uppercase">Order Received</h1>
                <p className="text-zinc-500 font-light italic max-w-md mx-auto">
                    Your selection has been curated and is being prepared for its journey.
                    A confirmation email has been sent to your registered address.
                </p>

                <div className="pt-12 space-y-4">
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-4 px-12 py-5 bg-black text-white text-[10px] tracking-[0.4em] font-bold uppercase overflow-hidden relative group"
                    >
                        <span className="relative z-10">Return to Exploration</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                        <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>

                    <div className="block pt-8 text-[9px] tracking-[0.2em] font-bold uppercase text-zinc-300">
                        Order ID: #{Math.floor(Math.random() * 999999).toString().padStart(6, '0')}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckoutSuccess;
