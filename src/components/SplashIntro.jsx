import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashIntro = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                    className="fixed inset-0 z-10000 bg-[#1a1c2c] flex items-center justify-center overflow-hidden"
                >
                    {/* Liquid Filling Animation */}
                    <motion.div
                        initial={{ height: "0%" }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.5, ease: "power2.inOut" }}
                        className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-[#c5a059]/20 to-[#c5a059]/5 backdrop-blur-3xl"
                    />

                    {/* Logo/Text Reveal */}
                    <div className="relative z-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, letterSpacing: "1em", y: 20 }}
                            animate={{ opacity: 1, letterSpacing: "2em", y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-white text-lg md:text-2xl font-light tracking-[2em] uppercase"
                        >
                            ESSENCE ELEGANCE
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
                            className="h-px bg-white/20 mt-6 mx-auto"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashIntro;
