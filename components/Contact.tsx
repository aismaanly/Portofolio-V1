'use client';

import { motion } from "framer-motion";
import { social } from "@/types/main";
import React, { useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import { useTheme } from "next-themes";

interface ContactProps {
    contact?: social[];
    resumeUrl: string;
    name: string;
    visible?: boolean;
}

const Contact = ({ contact = [], resumeUrl, name, visible = false }: ContactProps) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getSocialName = (icon: string) => {
        if (icon.toLowerCase().includes('linkedin')) return 'LinkedIn';
        if (icon.toLowerCase().includes('github')) return 'GitHub';
        if (icon.toLowerCase().includes('instagram')) return 'Instagram';
        if (icon.toLowerCase().includes('twitter')) return 'Twitter';
        if (icon.toLowerCase().includes('youtube')) return 'YouTube';
        return 'Social';
    };

    // Filter out YouTube and Instagram from the contact list as requested
    const filteredContact = contact.filter(s => !s.icon.toLowerCase().includes('youtube') && !s.icon.toLowerCase().includes('instagram'));

    // Get LinkedIn URL from social links, falling back to a default if not found
    const linkedinSocial = contact.find(s => s.icon.toLowerCase().includes('linkedin'));
    const connectUrl = linkedinSocial ? linkedinSocial.link : "https://www.linkedin.com/in/aisma-nurlaili";

    const isDark = mounted && resolvedTheme === 'dark';

    return (
        <footer
            id="contact"
            className={`fixed bottom-0 left-0 w-full h-screen ${isDark ? 'bg-[#120f16]' : 'bg-[#f5f5f5]'} z-10 flex flex-col justify-between pt-32 pb-10 overflow-hidden transition-colors duration-300`}
        >
            {/* Grain Noise Overlay */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            ></div>

            {/* Gradient background light source */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-b ${isDark ? 'from-violet-600/10' : 'from-violet-500/5'} to-transparent blur-[120px] pointer-events-none rounded-full`}></div>

            {/* Main content grid */}
            <div className="lg:w-11/12 2xl:w-4/5 w-full px-6 md:px-6 2xl:px-0 mx-auto flex flex-col md:flex-row justify-between items-center z-10 gap-16 md:gap-0 mt-20">
                <div className="flex flex-col w-full md:w-auto items-center md:items-start">
                    <div className="overflow-hidden pb-4 pt-2 w-full flex justify-center md:justify-start">
                        <motion.h2
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: visible ? 0 : "100%", opacity: visible ? 1 : 0 }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            className={`font-sans text-3xl min-[360px]:text-4xl min-[480px]:text-5xl md:text-[4.2vw] lg:text-[5vw] ${isDark ? 'text-white' : 'text-neutral-900'} font-extrabold tracking-tight leading-none whitespace-nowrap`}
                        >
                            Build Something
                        </motion.h2>
                    </div>
                    <div className="overflow-hidden pb-4 pt-2 w-full flex justify-center md:justify-start">
                        <motion.h2
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: visible ? 0 : "100%", opacity: visible ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                            id="contact-cta"
                            className={`font-serif italic font-normal text-violet-500 dark:text-violet-400 text-3xl min-[360px]:text-4xl min-[480px]:text-5xl md:text-[4.2vw] lg:text-[5vw] leading-none whitespace-nowrap`}
                        >
                            Impactful Together
                        </motion.h2>
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: visible ? 1 : 0.8, opacity: visible ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="flex justify-start md:justify-end"
                >
                    <div className="inline-block">
                        <a
                            href={connectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center connect-btn group relative w-40 h-40 md:w-48 md:h-48 ${isDark ? 'bg-white border-white' : 'bg-neutral-900 border-neutral-900'} border rounded-full overflow-hidden transition-all duration-500 shadow-xl`}
                        >
                            <span className={`relative z-10 text-xs md:text-sm font-bold uppercase tracking-[0.2em] ${isDark ? 'text-black group-hover:text-white' : 'text-white group-hover:text-white'} transition-colors duration-500 select-none`}>
                                Let's Connect
                            </span>
                            {/* Hover fill: violet */}
                            <div className="absolute inset-0 bg-violet-600 translate-y-full rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Links and copyright section */}
            <div className="lg:w-11/12 2xl:w-4/5 w-full px-6 md:px-6 2xl:px-0 mx-auto flex flex-col md:flex-row justify-between items-center z-10 border-t border-neutral-300 dark:border-neutral-800 pt-8 mt-auto gap-6 md:gap-0">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-8">
                    {filteredContact.map((s: social) => (
                        <div className="inline-block" key={s.icon}>
                            <a
                                href={s.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center gap-1.5 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors duration-300 group`}
                            >
                                <span className={`text-neutral-400 ${isDark ? 'group-hover:text-white' : 'group-hover:text-black'} transition-colors duration-300 text-sm md:text-base`}>
                                    {/* @ts-ignore */}
                                    {Fa[s.icon] ? React.createElement(Fa[s.icon]) : <Fa.FaLink />}
                                </span>
                                <span className={`text-[10px] md:text-xs uppercase tracking-[0.2em] ${isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-600 group-hover:text-black'} transition-colors duration-300`}>
                                    {getSocialName(s.icon)}
                                </span>
                            </a>
                        </div>
                    ))}
                    <div className="inline-block">
                        <a
                            href="mailto:aisma.nurlaili24@gmail.com"
                            className={`inline-flex items-center justify-center gap-1.5 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors duration-300 group`}
                        >
                            <span className={`text-neutral-400 ${isDark ? 'group-hover:text-white' : 'group-hover:text-black'} transition-colors duration-300 text-sm md:text-base`}>
                                <Fa.FaEnvelope />
                            </span>
                            <span className={`text-[10px] md:text-xs uppercase tracking-[0.2em] ${isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-600 group-hover:text-black'} transition-colors duration-300`}>
                                Email
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Contact;