import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '../utils/api';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cart, addToCart } = useCart();
    const [viewMode, setViewMode] = useState(3);
    const [selectedCategory, setSelectedCategory] = useState("VIEW ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductService.getAll();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        "VIEW ALL",
        "WOODY FAMILIES",
        "FLORAL FAMILIES",
        "FRESH FAMILIES",
        "ORIENTAL",
        "LEATHER",
        "NEW ARRIVALS",
        "DISCOVERY SETS"
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "VIEW ALL" ||
            product.category?.toUpperCase() === selectedCategory.replace(" FAMILIES", "") ||
            product.scentFamily?.toUpperCase().includes(selectedCategory.replace(" FAMILIES", ""));

        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="pt-40 text-center font-serif italic text-3xl h-screen bg-white flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="tracking-[0.5em] uppercase text-xs font-bold"
                >
                    Maison Preparation...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-24 flex px-8 md:px-12 gap-12 relative">
            {/* Left Sidebar: Categories */}
            <aside className="hidden lg:flex flex-col w-64 sticky top-32 h-fit shrink-0">
                <div className="flex flex-col gap-2 mb-12">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-[10px] tracking-[0.2em] font-bold uppercase py-1 text-left transition-all ${selectedCategory === cat ? 'text-black underline underline-offset-8 decoration-2' : 'text-zinc-400 hover:text-black hover:underline underline-offset-4'}`}
                        >
                            <span className="mr-2">|{String(idx + 1).padStart(2, '0')}|</span>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="mt-auto">
                    <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase block mb-6">Filters</span>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="text-[9px] tracking-[0.2em] font-bold uppercase">View</span>
                            <div className="flex gap-4">
                                {[2, 3].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setViewMode(num)}
                                        className={`text-xs font-bold transition-all ${viewMode === num ? 'underline underline-offset-4' : 'text-zinc-400'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content: Product Grid */}
            <main className="flex-1">
                <div className={`grid grid-cols-1 ${viewMode === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-x-6 gap-y-12`}>
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="group flex flex-col cursor-pointer"
                        >
                            <a href={`/product/${product._id}`} className="block relative aspect-4/5 mb-6 overflow-hidden bg-zinc-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {product.isSale && (
                                    <span className="absolute top-4 left-4 bg-black text-white text-[8px] font-bold tracking-[0.2em] px-2 py-1 uppercase">
                                        Limited
                                    </span>
                                )}
                            </a>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase leading-tight max-w-[80%]">
                                        {product.name} {product.scentFamily && `• ${product.scentFamily.toUpperCase()}`}
                                    </h3>
                                    <button
                                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                        className="text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-[11px] tracking-tight font-medium text-zinc-900 mt-1">
                                    ₹{product.price.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Right Sidebar: Utilities */}
            <aside className="hidden lg:flex flex-col w-56 sticky top-32 h-fit text-right shrink-0">
                <div className="mb-20">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="SEARCH"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-right bg-transparent border-b border-black py-1 text-[10px] tracking-[0.3em] font-bold focus:outline-none placeholder:text-black"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6 text-[10px] tracking-[0.3em] font-bold uppercase">
                    <a href="/cart" className="hover:underline underline-offset-4 decoration-1">
                        Shopping Bag ({cart.length})
                    </a>
                    <a href="/login" className="hover:underline underline-offset-4 decoration-1 text-zinc-500 hover:text-black transition-colors">
                        Log In
                    </a>
                    <a href="#" className="hover:underline underline-offset-4 decoration-1 text-zinc-500 hover:text-black transition-colors">
                        Help
                    </a>
                </div>

                <div className="mt-40 text-left opacity-30 pointer-events-none">
                    <p className="text-[8px] tracking-[0.5em] leading-loose uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        Essence Elegance / 2026 Edition
                    </p>
                </div>
            </aside>
        </div>
    );
};

export default Shop;
