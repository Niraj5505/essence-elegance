 import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'The Maison does not recognize these credentials.');
            }
        } catch (err) {
            setError('The scent trail has gone cold. Please try later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/50 p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                    <div className="text-center mb-12">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[9px] tracking-[0.5em] text-gold uppercase font-black mb-4 block"
                        >
                            Member Entry
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-serif italic tracking-tight"
                        >
                            Welcome Back
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-zinc-400 text-[10px] tracking-widest uppercase mt-4 font-semibold"
                        >
                            Enter your private sanctum
                        </motion.p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="bg-red-50 border-l-2 border-red-500 p-4 mb-8 flex items-center gap-3"
                            >
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-[10px] text-red-800 font-bold tracking-wider uppercase">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[9px] tracking-[0.3em] uppercase font-black text-zinc-400 ml-1">E-mail Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-gold transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-transparent border-b border-zinc-200 py-3 pl-8 text-sm focus:outline-none focus:border-gold transition-all duration-300 placeholder:italic placeholder:text-zinc-300"
                                    placeholder="Your artisanal email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[9px] tracking-[0.3em] uppercase font-black text-zinc-400">Secret Identity</label>
                                <Link to="/forgot-password" title="Recover Secret" className="text-[9px] tracking-widest uppercase font-bold text-zinc-400 hover:text-gold transition-colors italic">Forgotten?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-gold transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-transparent border-b border-zinc-200 py-3 pl-8 text-sm focus:outline-none focus:border-gold transition-all duration-300 placeholder:italic placeholder:text-zinc-300"
                                    placeholder="Your hidden key"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-zinc-900 text-white py-5 flex items-center justify-center gap-3 group relative overflow-hidden transition-all duration-500 hover:bg-gold disabled:opacity-50"
                            >
                                <span className="relative z-10 text-[10px] tracking-[0.4em] font-black uppercase">
                                    {isSubmitting ? 'Verifying Identity...' : 'Inscribe Entrance'}
                                </span>
                                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />}
                                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
                        <p className="text-zinc-400 text-[10px] tracking-widest uppercase font-bold mb-4">New to the Maison?</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 text-gold hover:text-zinc-900 transition-all font-serif italic text-lg"
                        >
                            Inscribe for Membership
                            <UserPlus className="w-4 h-4 translate-y-0.5" />
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link to="/" className="text-[9px] tracking-[0.4em] font-black text-zinc-400 hover:text-gold transition-colors uppercase border-b border-transparent hover:border-gold pb-1">
                        Return to Discovery
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
