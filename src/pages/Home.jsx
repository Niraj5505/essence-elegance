import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LiquidEther from '../components/LiquidEther';
import Aurora from '../components/Aurora';

const ScentFamilyCard = ({ family, delay }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay }}
            className="relative aspect-3/4 cursor-pointer group perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full h-full"
            >
                {/* Front Side */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden overflow-hidden bg-zinc-100"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <motion.img
                        key={family.liveImg}
                        src={family.liveImg}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            scale: [1, 1.05, 1],
                            x: [0, -10, 0],
                        }}
                        transition={{
                            opacity: { duration: 0.8 },
                            scale: { duration: 25, repeat: Infinity, ease: "linear" },
                            x: { duration: 20, repeat: Infinity, ease: "linear" }
                        }}
                        className="w-[110%] h-[110%] max-w-none object-cover brightness-[0.85] group-hover:brightness-50 transition-all duration-700"
                        alt={`Experience the ${family.title.toLowerCase()} scent`}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-[8px] tracking-[0.4em] text-white/60 font-bold uppercase">Live Experience</span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <h3 className="text-3xl font-serif text-white mb-4 tracking-tighter uppercase italic">{family.title}</h3>
                        <p className="text-white/80 text-[10px] text-center tracking-[0.3em] uppercase mb-8">{family.character}</p>
                        <span className="text-white text-[11px] font-semibold border border-white/30 px-6 py-2 tracking-widest uppercase hover:bg-white hover:text-black transition-all">Explore Scent</span>
                    </div>

                    <div className="absolute bottom-10 left-10 transition-all duration-500 group-hover:opacity-0">
                        <span className="text-gold text-[8px] tracking-[0.4em] uppercase font-bold mb-2 block">Maison Collection</span>
                        <h3 className="text-xl font-serif text-white tracking-widest uppercase italic">{family.title}</h3>
                    </div>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden overflow-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    {/* Background Visual for Back */}
                    <img src={family.img} className="absolute inset-0 w-full h-full object-cover brightness-[0.3] scale-110" alt="" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                    <div className="relative h-full w-full p-8 flex flex-col items-center justify-center border border-white/10">
                        <div className="w-full space-y-6">
                            <div className="text-center group-hover:reveal">
                                <div className="mb-4 mx-auto w-24 h-24 rounded-full border border-gold/30 p-2 overflow-hidden bg-white/5 backdrop-blur-md">
                                    <img src={family.bottleImg} className="w-full h-full object-contain drop-shadow-2xl" alt={family.title} />
                                </div>
                                <span className="text-gold text-[9px] tracking-[0.4em] uppercase font-bold mb-2 block">Olfactory Character</span>
                                <h3 className="text-2xl font-serif italic mb-4 tracking-wide uppercase text-white">{family.title}</h3>
                                <p className="text-zinc-300 text-[11px] leading-6 font-light italic px-4">
                                    {family.description}
                                </p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-baseline px-2">
                                    <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-medium">Top Notes</span>
                                    <span className="text-[10px] italic text-gold">{family.notes.top}</span>
                                </div>
                                <div className="flex justify-between items-baseline px-2">
                                    <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-medium">Heart Notes</span>
                                    <span className="text-[10px] italic text-gold">{family.notes.heart}</span>
                                </div>
                                <div className="flex justify-between items-baseline px-2">
                                    <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-medium">Base Notes</span>
                                    <span className="text-[10px] italic text-gold">{family.notes.base}</span>
                                </div>
                            </div>

                            <div className="pt-4 px-4">
                                <button className="w-full py-2.5 border border-white/20 bg-white/5 backdrop-blur-sm text-[9px] text-white tracking-[0.3em] font-bold uppercase hover:bg-white hover:text-black transition-all duration-500">
                                    View Collection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
                {/* Liquid Ether Effect Background */}
                <div className="absolute inset-0 z-0">
                    <LiquidEther
                        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                        mouseForce={45}
                        cursorSize={100}
                        isViscous
                        viscous={30}
                        iterationsViscous={24}
                        iterationsPoisson={24}
                        resolution={0.4}
                        dt={0.02}
                        isBounce={false}
                        autoDemo
                        autoSpeed={0.5}
                        autoIntensity={2.2}
                        takeoverDuration={0.15}
                        autoResumeDelay={3000}
                        autoRampDuration={0.6}
                        color0="#5227FF"
                        color1="#FF9FFC"
                        color2="#B19EEF"
                    />
                </div>

                {/* Gradients for readability */}
                <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />

                <div className="relative z-10 text-center text-white px-6">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-[12px] tracking-[0.6em] mb-4 font-light uppercase text-zinc-300"
                    >
                        Established 2026
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="text-6xl md:text-9xl font-serif mb-8 tracking-tighter italic"
                    >
                        Fragrances
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="max-w-xl mx-auto text-sm md:text-lg tracking-widest leading-relaxed font-light opacity-90 mb-10"
                    >
                        THE FEEL-GOOD SCENTS THAT YOU FEEL A PERSONAL CONNECTION TO.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        <a href="/shop" className="px-10 py-4 border border-white text-xs tracking-[0.3em] font-medium hover:bg-white hover:text-primary transition-all duration-300 pointer-events-auto">
                            EXPLORE COLLECTION
                        </a>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-white/40 flex flex-col items-center gap-4 z-10">
                    <span>SCROLL TO DISCOVER</span>
                    <div className="w-px h-12 bg-white/20" />
                </div>
            </section>

            {/* Signature Essences Section */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-end justify-between mb-20"
                    >
                        <div>
                            <span className="text-xs text-gold font-semibold tracking-widest uppercase mb-2 block">Our Finest Selection</span>
                            <h2 className="text-4xl font-serif tracking-tight">Signature Essences</h2>
                        </div>
                        <p className="max-w-md text-sm text-zinc-500 font-light mt-6 md:mt-0 leading-relaxed italic">
                            Crafted in secret, bottled for the bold. Our signature collection defines the new era of olfactory elegance.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            {
                                img: "/perfumes/mystic_oud.png",
                                name: "MYSTIC OUD",
                                desc: "A deep, velvety journey through nocturnal gardens.",
                                delay: 0.2
                            },
                            {
                                img: "/perfumes/royal_citrus.png",
                                name: "ROYAL CITRUS",
                                desc: "Brilliant bergamot paired with vintage sandalwood.",
                                delay: 0.4
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: item.delay }}
                                className="group cursor-pointer overflow-hidden"
                            >
                                <div className="aspect-4/5 overflow-hidden mb-8">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif mb-2 tracking-wide uppercase italic">{item.name}</h3>
                                <p className="text-zinc-500 text-sm font-light mb-6 opacity-70 italic">{item.desc}</p>
                                <a href="/shop" className="text-[10px] tracking-widest font-semibold border-b border-black pb-1 hover:text-gold hover:border-gold transition-all uppercase">
                                    Discover Essence
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Olfactory Journey - Redesigned */}
            <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-24"
                    >
                        <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-medium">Learn the Art</span>
                        <h2 className="text-5xl font-serif mt-4 italic">The Olfactory Journey</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "TOP NOTES",
                                duration: "0-15 MINS",
                                desc: "The initial burst of fragrance. Light, volatile molecules like citrus, ginger, and light florals define this awakening.",
                                icon: "fa-leaf"
                            },
                            {
                                title: "HEART NOTES",
                                duration: "4-6 HOURS",
                                desc: "The 'soul' of the perfume. Lavender, rose, and spices form the enduring core as the top notes gracefully fade.",
                                icon: "fa-heart"
                            },
                            {
                                title: "BASE NOTES",
                                duration: "8-12 HOURS",
                                desc: "The final, enduring impression. Rich, heavy molecules like sandalwood, vanilla, and oud fix the fragrance.",
                                icon: "fa-anchor"
                            }
                        ].map((note, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                                className="p-12 border border-zinc-800 hover:border-zinc-700 transition-colors group bg-zinc-900/40 backdrop-blur-sm"
                            >
                                <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center mb-10 group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                                    <i className={`fas ${note.icon} text-sm group-hover:text-white transition-colors`}></i>
                                </div>
                                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-medium">{note.duration}</span>
                                <h3 className="text-2xl font-serif mt-2 mb-6 tracking-wide italic uppercase">{note.title}</h3>
                                <p className="text-zinc-500 text-sm leading-8 font-light italic">
                                    {note.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scent Families Collection */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs text-gold font-semibold tracking-widest uppercase mb-2 block">The Olfactory Families</span>
                        <h2 className="text-4xl font-serif tracking-tight">Discover Your Scent Sanctuary</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "FLORAL",
                                img: "perfumes/floral.png",
                                liveImg: "perfumes/floral_live_v2.png",
                                bottleImg: "perfumes/midnight_jasmine.png",
                                description: "A garden of eternal spring. Our floral family is a tribute to the delicate balance of nature's beauty.",
                                notes: { top: "Jasmine, Peony", heart: "Damask Rose, Iris", base: "White Musk, Amber" },
                                character: "Romantic & Elegant"
                            },
                            {
                                title: "WOODY",
                                img: "perfumes/woody.png",
                                liveImg: "perfumes/woody_live_v2.png",
                                bottleImg: "perfumes/bois_marocain.png",
                                description: "The deep, soulful resonance of ancient forests. Earthy, robust, and profoundly grounding.",
                                notes: { top: "Cedar, Pine", heart: "Sandalwood, Vetiver", base: "Oud, Pachouli" },
                                character: "Earthy & Timeless"
                            },
                            {
                                title: "FRESH",
                                img: "perfumes/fresh.png",
                                liveImg: "perfumes/fresh_live_v2.png",
                                bottleImg: "perfumes/royal_citrus.png",
                                description: "The crisp vitality of a sea breeze. Clean, citrusy, and eternally invigorating.",
                                notes: { top: "Lemon, Bergamot", heart: "Sea Salt, Neroli", base: "Light Oakmoss" },
                                character: "Crisp & Energetic"
                            }
                        ].map((family, idx) => (
                            <ScentFamilyCard key={idx} family={family} delay={idx * 0.15} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Invitation */}
            <section className="py-40 bg-[#0a0a0a] text-white relative flex items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Aurora
                        colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
                        blend={0.5}
                        amplitude={1.2}
                        speed={0.5}
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-transparent to-zinc-950/80 z-10" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="relative z-20 max-w-2xl"
                >
                    <h2 className="text-5xl font-serif mb-6 tracking-tight italic">Join the Elite</h2>
                    <p className="text-zinc-400 text-sm font-light mb-12 tracking-widest italic">
                        Be the first to receive invitation to private events and exclusive access to unreleased essence barrels.
                    </p>
                    <form className="flex flex-col md:flex-row gap-4 items-stretch group max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your E-mail ADDRESS"
                            className="flex-1 bg-transparent border-b border-zinc-700 py-3 px-2 text-xs tracking-widest focus:outline-none focus:border-white transition-all uppercase placeholder:italic"
                        />
                        <button className="bg-white text-black text-[10px] font-bold px-10 py-4 tracking-widest uppercase hover:bg-gold hover:text-white transition-all">
                            Subscribe
                        </button>
                    </form>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
