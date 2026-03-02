import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductService } from '../utils/api';
import { ShoppingCart, ArrowLeft, ShieldCheck, Clock, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await ProductService.getOne(id);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            // Recently Viewed Logic
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const updated = [product, ...viewed.filter(p => p._id !== product._id)].slice(0, 4);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        }
    }, [product]);

    if (loading) {
        return (
            <div className="pt-40 text-center font-serif italic text-3xl h-screen bg-zinc-50 flex items-center justify-center">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Unveiling Essence...
                </motion.div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-40 text-center h-screen flex flex-col items-center justify-center gap-6">
                <h2 className="text-3xl font-serif italic">This Essence has vanished.</h2>
                <button onClick={() => navigate('/shop')} className="text-xs tracking-[0.3em] font-bold border-b border-black pb-1 uppercase">Back to Collection</button>
            </div>
        );
    }

    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        .filter(p => p._id !== id);

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] tracking-[0.3em] font-bold uppercase mb-12 hover:text-gold transition-colors group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Visual Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="aspect-4/5 overflow-hidden bg-white shadow-2xl">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-2000 hover:scale-105"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-gold/20 hidden md:block" />
                        <div className="absolute -top-10 -left-10 w-40 h-40 border border-zinc-200/50 hidden md:block" />
                    </motion.div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold mb-4 block">{product.category} Essence</span>
                            <h1 className="text-6xl font-serif italic tracking-tight mb-8">{product.name}</h1>

                            <div className="flex items-baseline gap-4 mb-10">
                                <span className="text-3xl font-serif italic text-zinc-900">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-zinc-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>

                            <p className="text-zinc-600 text-lg font-light leading-relaxed italic mb-12 border-l-2 border-gold/20 pl-8">
                                "{product.description}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="p-6 bg-white border border-zinc-100">
                                    <h4 className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase mb-4 flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Performance
                                    </h4>
                                    <p className="font-serif italic text-lg">{product.longevity}</p>
                                </div>
                                <div className="p-6 bg-white border border-zinc-100">
                                    <h4 className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Availability
                                    </h4>
                                    <p className="font-serif italic text-lg">{product.stock > 0 ? `${product.stock} Bottles Left` : 'Out of Stock'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className={`w-full py-5 text-[10px] tracking-[0.4em] font-bold uppercase transition-all duration-500 overflow-hidden relative group ${product.stock > 0
                                        ? 'bg-zinc-900 text-white hover:bg-gold'
                                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <ShoppingCart className="w-4 h-4" />
                                        {product.stock > 0 ? 'Inscribe into Collection' : 'Rare Commodity Exhausted'}
                                    </span>
                                </button>

                                <button className="w-full py-5 border border-zinc-200 text-[10px] tracking-[0.4em] font-bold uppercase hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all flex items-center justify-center gap-3">
                                    <Share2 className="w-4 h-4" />
                                    Invite to Witness
                                </button>
                            </div>
                        </motion.div>

                        {/* Olfactory Notes */}
                        <div className="mt-20 pt-20 border-t border-zinc-100">
                            <h3 className="text-sm tracking-[0.4em] text-zinc-400 uppercase font-black mb-12">The Olfactory Architecture</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div>
                                    <p className="text-[9px] tracking-widest text-gold font-bold uppercase mb-4">Top Layer</p>
                                    <ul className="text-zinc-500 font-light italic text-sm space-y-2">
                                        {product.topNotes?.map(note => <li key={note}>{note}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-[9px] tracking-widest text-gold font-bold uppercase mb-4">Heart Layer</p>
                                    <ul className="text-zinc-500 font-light italic text-sm space-y-2">
                                        {product.heartNotes?.map(note => <li key={note}>{note}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-[9px] tracking-widest text-gold font-bold uppercase mb-4">Foundation</p>
                                    <ul className="text-zinc-500 font-light italic text-sm space-y-2">
                                        {product.baseNotes?.map(note => <li key={note}>{note}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Viewed Section */}
                {recentlyViewed.length > 0 && (
                    <div className="mt-40 pt-20 border-t border-zinc-200">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <span className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold mb-4 block">Continuing the Journey</span>
                                <h2 className="text-4xl font-serif italic">Witnessed Recently</h2>
                            </div>
                            <button onClick={() => navigate('/shop')} className="hidden md:block text-[9px] tracking-widest font-bold uppercase border-b border-zinc-300 pb-1 hover:border-black transition-all">Explore Full Maison</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {recentlyViewed.map((viewedProduct, idx) => (
                                <motion.div
                                    key={viewedProduct._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => navigate(`/product/${viewedProduct._id}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden bg-zinc-100 mb-6 relative">
                                        <img
                                            src={viewedProduct.image}
                                            alt={viewedProduct.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-serif italic tracking-wide group-hover:text-gold transition-colors">{viewedProduct.name}</h4>
                                    <p className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase mt-2">₹{viewedProduct.price.toLocaleString()}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
