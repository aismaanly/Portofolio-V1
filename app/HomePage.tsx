'use client';
import { data } from "@/types/main";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
import Experiences from "@/components/experiences/Experiences";
import Certifications from "@/components/projects/Certifications";
import Contact from "@/components/Contact";
import Header from "./Header";
import Head from "./head";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "@/components/Preloader";

interface Props {
    data: data,
}

const HomePage = ({ data }: Props) => {
    const [heroVisible, setHeroVisible] = useState(true);
    const [footerRevealed, setFooterRevealed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Hero is visible when near top — fade in earlier for smooth return
            if (scrollY < window.innerHeight * 0.7) {
                setHeroVisible(true);
            } else {
                setHeroVisible(false);
            }

            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const threshold = docHeight - winHeight * 1.35;
            
            if (window.scrollY > threshold) {
                setFooterRevealed(true);
            } else {
                setFooterRevealed(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Head />
            <Header logo={data.main.name} />
            <Hero mainData={data.main} visible={heroVisible} startAnimation={!loading} />
            
            {/* Main scrollable content container */}
            <div className="relative z-20 bg-[#f5f5f5] dark:bg-[#120f16] mb-[100vh]" data-scroll-content>
                <About 
                    aboutData={data.about} 
                    name={data.main.name} 
                    projectsCount={data.projects && data.projects.length > 0 ? data.projects.length - 1 : 0}
                    certificationsCount={data.certifications && data.certifications.length > 0 ? data.certifications.length - 1 : 0}
                    experienceCount={(() => {
                        const experiences = data.experiences || [];
                        if (experiences.length === 0) return 1;

                        const parseDate = (dateStr: string): Date => {
                            const cleanStr = dateStr.trim().toLowerCase();
                            if (cleanStr === 'present' || cleanStr === 'now') {
                                return new Date();
                            }
                            const parts = cleanStr.split(/\s+/);
                            if (parts.length === 2) {
                                const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                                const month = monthNames.indexOf(parts[0].substring(0, 3));
                                const year = parseInt(parts[1], 10);
                                if (month !== -1 && !isNaN(year)) {
                                    return new Date(year, month);
                                }
                            }
                            return new Date();
                        };

                        let oldestDate = new Date();
                        let newestDate = new Date(0);

                        experiences.forEach(exp => {
                            if (!exp.duration) return;
                            const parts = exp.duration.split(/[-–]/);
                            if (parts.length === 2) {
                                const start = parseDate(parts[0]);
                                const end = parseDate(parts[1]);
                                if (start < oldestDate) oldestDate = start;
                                if (end > newestDate) newestDate = end;
                            }
                        });

                        const diffMonths = (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 + (newestDate.getMonth() - oldestDate.getMonth());
                        const years = (diffMonths + 1) / 12;
                        return Math.max(1, Math.round(years));
                    })()}
                />
                <Skills skillData={data.skills} />
                <Projects projectsData={data.projects} />
                <Experiences experienceData={data.experiences} volunteerData={data.volunteers || []} educationData={data.educations || []} />
                <Certifications certificationsData={data.certifications || []} />
            </div>

            {/* Fixed parallax contact footer */}
            <Contact contact={data.contact || data.socials} resumeUrl={data.about.resumeUrl} name={data.main.name} visible={footerRevealed} />

            {/* Floating Back To Top Button */}
            <AnimatePresence>
                {!heroVisible && !footerRevealed && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 backdrop-blur-md border border-violet-500 text-white hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg shadow-violet-500/30"
                        aria-label="Back to top"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Fullscreen Intro Preloader */}
            {loading && <Preloader onComplete={() => setLoading(false)} />}
        </>
    )
}

export default HomePage