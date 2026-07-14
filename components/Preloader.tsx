'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
    onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const name = "AISMA NURLAILI";
    const letters = name.split("");
    const firstWord = "AISMA".split("");
    const secondWord = "NURLAILI".split("");

    useEffect(() => {
        // Disable body scroll when loader is active
        document.body.style.overflow = 'hidden';

        // Stage 1: Trigger Subtitle at allLettersDone - 140ms
        // Stagger for 14 chars finishes starting at: 0.3 + 13*0.056 + 169*0.0007 = 1.15s. 
        // We trigger subtitle around 1.1s.
        const subtitleTimeout = setTimeout(() => {
            setShowSubtitle(true);
        }, 1100);

        // Stage 2: Trigger Line Loader Wrapper at allLettersDone + 160ms (approx 1.4s)
        const loaderTimeout = setTimeout(() => {
            setShowLoader(true);
        }, 1400);

        // Stage 3: Animate progress bar width from 0% to 100% over 1100ms starting at 1.45s
        const progressStartTimeout = setTimeout(() => {
            const duration = 1100; // ms
            const startTime = performance.now();

            const animateProgress = (now: number) => {
                const elapsed = now - startTime;
                const p = Math.min(elapsed / duration, 1);

                // Ease-In-Out Quart easing function matching pshabreentaj.com
                const easedProgress = p < 0.5 
                    ? 8 * p * p * p * p 
                    : 1 - Math.pow(-2 * p + 2, 4) / 2;

                setProgress(easedProgress * 100);

                if (p < 1) {
                    requestAnimationFrame(animateProgress);
                }
            };

            requestAnimationFrame(animateProgress);
        }, 1450);

        // Stage 4: Exit animation triggers 360ms after loader reaches 100% (1.45s + 1.1s + 0.36s = 2.91s)
        const exitTimeout = setTimeout(() => {
            setIsExiting(true);
        }, 2910);

        // Stage 5: Call onComplete after exit transition finishes (2.91s + 0.85s = 3.76s)
        const completeTimeout = setTimeout(() => {
            document.body.style.overflow = '';
            onComplete();
        }, 3760);

        return () => {
            clearTimeout(subtitleTimeout);
            clearTimeout(loaderTimeout);
            clearTimeout(progressStartTimeout);
            clearTimeout(exitTimeout);
            clearTimeout(completeTimeout);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            animate={{ 
                opacity: isExiting ? 0 : 1, 
                filter: isExiting ? "blur(8px)" : "blur(0px)", 
                scale: isExiting ? 1.03 : 1 
            }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f5f5] dark:bg-[#120f16] text-black dark:text-white select-none pointer-events-none overflow-hidden"
        >
            <motion.div 
                animate={{ y: isExiting ? -8 : 0 }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center"
            >
                {/* Name / Title */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-y-2 md:gap-y-0 md:gap-x-4 px-4 max-w-4xl text-center">
                    {/* AISMA */}
                    <div className="flex items-center justify-center">
                        {firstWord.map((char, index) => {
                            const delay = 0.3 + (index * 0.056) + (index * index * 0.0007);
                            return (
                                <motion.span
                                    key={`first-${index}`}
                                    initial={{ opacity: 0, y: 22, scale: 0.96, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                    transition={{
                                        duration: 0.82,
                                        delay: delay,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[0.25em] font-sans text-violet-600 dark:text-violet-600"
                                >
                                    {char}
                                </motion.span>
                            );
                        })}
                    </div>
                    {/* NURLAILI */}
                    <div className="flex items-center justify-center pl-[0.25em] md:pl-0">
                        {secondWord.map((char, index) => {
                            const adjustedIndex = index + 6;
                            const delay = 0.3 + (adjustedIndex * 0.056) + (adjustedIndex * adjustedIndex * 0.0007);
                            return (
                                <motion.span
                                    key={`second-${index}`}
                                    initial={{ opacity: 0, y: 22, scale: 0.96, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                    transition={{
                                        duration: 0.82,
                                        delay: delay,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[0.25em] font-sans text-black dark:text-white"
                                >
                                    {char}
                                </motion.span>
                            );
                        })}
                    </div>
                </div>

                {/* Subtitle */}
                <div className="h-10 mt-4 flex items-center justify-center">
                    {showSubtitle && (
                        <motion.span
                            initial={{ opacity: 0, y: 7, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                            className="text-sm md:text-base font-bold tracking-[0.55em] uppercase text-violet-600/60 dark:text-violet-400/60 pl-[0.55em] font-mono"
                        >
                            Portfolio
                        </motion.span>
                    )}
                </div>

                {/* Loading Line */}
                <div className="h-6 mt-8 flex items-center justify-center">
                    {showLoader && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="w-48 sm:w-56 md:w-64 h-[1px] bg-black/5 dark:bg-white/5 relative overflow-hidden rounded-full"
                        >
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent via-violet-500/50 to-violet-600 dark:via-violet-400/50 dark:to-violet-400 shadow-[0_0_8px_rgba(124,58,237,0.3)] transition-all duration-75"
                                style={{ width: `${progress}%` }}
                            />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Preloader;
