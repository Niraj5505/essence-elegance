import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useSpring(0, { damping: 45, stiffness: 800 });
    const mouseY = useSpring(0, { damping: 45, stiffness: 800 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference border border-white rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                style={{ x: mouseX, y: mouseY }}
                animate={{ scale: isHovering ? 2.5 : 1 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9999] bg-[#c5a059] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{ x: mouseX, y: mouseY }}
            />
        </>
    );
};

export default CustomCursor;
