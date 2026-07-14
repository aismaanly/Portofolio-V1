'use client';
import { useTheme } from 'next-themes';
import { Link as ScrollLink } from 'react-scroll';
import Typewriter from 'typewriter-effect';
import { IoIosArrowForward } from 'react-icons/io';
import { main } from '@/types/main';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
    mainData: main;
    visible?: boolean;
    startAnimation?: boolean;
}

const Hero = ({ mainData, visible = true, startAnimation = true }: HeroProps) => {
    const { resolvedTheme } = useTheme();
    const { name, titles } = mainData;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const nameParts = name.split(' ');
    const firstName = nameParts[0] || 'Aisma';
    const lastName = nameParts.slice(1).join(' ') || 'Nurlaili';

    const isDark = mounted && resolvedTheme === 'dark';

    return (
        <section
            id='home'
            className={`sticky top-0 h-screen w-full mx-auto overflow-hidden will-change-transform flex flex-col justify-center ${isDark ? "bg-[#120f16]" : "bg-[#f5f5f5]"}`}
            style={{
                zIndex: visible ? 15 : 0,
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
                transition: 'opacity 0.4s ease'
            }}
        >
            {/* Background */}
            <div className="absolute -z-10 h-full w-full">
                <div className={`w-full h-full ${isDark ? 'bg-[#120f16]' : 'bg-[#f5f5f5]'}`}></div>
            </div>

            {/* Mobile Hero View */}
            <div className="flex md:hidden flex-col items-center justify-center h-full pt-[4vh] pb-[6vh] px-6 select-none text-center gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-48 h-48 flex justify-center items-end overflow-hidden"
                >
                    <img
                        src="/hero-home.png"
                        alt={name}
                        className="w-full h-full object-contain object-bottom select-none pointer-events-none"
                        style={{
                            maskImage: 'radial-gradient(ellipse 150% 100% at 50% 0%, black 75%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 150% 100% at 50% 0%, black 75%, transparent 100%)'
                        }}
                    />
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-extrabold leading-[1.1] tracking-tight text-black dark:text-white text-4xl min-[360px]:text-5xl"
                >
                    <span className="font-serif italic font-normal text-violet-600 dark:text-violet-400 block mb-1">Hi, I'm</span>
                    {firstName}<br />{lastName}
                </motion.h1>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-row items-center gap-1.5 justify-center"
                >
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">I am into</span>
                    <Typewriter
                        options={{
                            strings: titles,
                            autoStart: true,
                            loop: true,
                            deleteSpeed: 50,
                            delay: 50,
                            wrapperClassName: "text-violet-700 dark:text-violet-600 text-sm font-medium",
                            cursorClassName: "text-violet-700 dark:text-violet-600 text-sm"
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <ScrollLink
                        className="w-fit text-xs py-2 px-4 cursor-pointer flex items-center gap-1 rounded-md bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 hover:dark:bg-violet-800 transition-colors group text-white"
                        to={'about'}
                        offset={-60}
                        smooth={true}
                        duration={500}
                    >
                        About Me
                        <IoIosArrowForward className='group-hover:translate-x-1 transition-transform' />
                    </ScrollLink>
                </motion.div>
            </div>

            {/* Desktop Hero View */}
            <div className="hidden md:grid grid-cols-[42%_58%] max-w-[1200px] mx-auto h-full w-full relative items-center">
                {/* Left Column: Text */}
                <div className="flex flex-col gap-5 text-left pl-8 lg:pl-16 pr-6 pt-20 pb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-black dark:text-white"
                    >
                        <span className="font-serif italic font-normal text-violet-600 dark:text-violet-400 block mb-2">Hi, I'm</span>
                        {firstName}<br />{lastName}
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-row items-center gap-1.5"
                    >
                        <h2 className="text-lg md:text-2xl text-neutral-800 dark:text-white">I am into</h2>
                        <Typewriter
                            options={{
                                strings: titles,
                                autoStart: true,
                                loop: true,
                                deleteSpeed: 50,
                                delay: 50,
                                wrapperClassName: "text-violet-700 dark:text-violet-600 text-lg md:text-2xl font-medium",
                                cursorClassName: "text-violet-700 dark:text-violet-600 text-lg md:text-2xl"
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ScrollLink
                            className="w-fit text-sm md:text-base py-2.5 px-5 cursor-pointer flex items-center gap-1.5 rounded-md bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 hover:dark:bg-violet-800 transition-colors group text-white shadow-md"
                            to={'about'}
                            offset={-60}
                            smooth={true}
                            duration={500}
                        >
                            About Me
                            <IoIosArrowForward className='group-hover:translate-x-1 transition-transform' />
                        </ScrollLink>
                    </motion.div>
                </div>

                {/* Right Column: Image Cutout with bottom blur */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-[72%] max-h-[480px] lg:max-h-[530px] flex items-end justify-center overflow-hidden"
                    >
                        <img
                            src="/hero-home.png"
                            alt={name}
                            className="object-contain object-bottom w-full h-full select-none pointer-events-none"
                            style={{
                                maskImage: 'radial-gradient(ellipse 150% 100% at 50% 0%, black 75%, transparent 100%)',
                                WebkitMaskImage: 'radial-gradient(ellipse 150% 100% at 50% 0%, black 75%, transparent 100%)'
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;