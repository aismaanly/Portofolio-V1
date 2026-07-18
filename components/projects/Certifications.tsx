'use client';
import { project } from "@/types/main";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { ViewAll } from "./Projects";

interface Props {
    certificationsData: project[]
}

const Certifications = ({ certificationsData }: Props) => {
    const [certifications] = useState(certificationsData || []);
    const rawCategories = [...new Set(certifications.map((s) => s.category))];
    let categories = rawCategories;
    if (rawCategories.includes('Professional')) {
        categories = ['Professional', ...rawCategories.filter((c) => c !== 'Professional')];
    }
    if (rawCategories.includes('Course')) {
        categories = ['Course', ...categories.filter((c) => c !== 'Course')];
    }
    const [category, setCategory] = useState(categories[0] || "");
    const [filteredCertifications, setFilteredCertifications] = useState(certifications);
    const [viewAll, setViewAll] = useState(false);

    const filterCertifications = (cat: string) => {
        setViewAll(false);
        setCategory(cat);
        setFilteredCertifications(certifications.filter((p: project) => p.category.toLowerCase() === cat.toLowerCase()));
    };

    useEffect(() => {
        if (categories.length > 0) {
            filterCertifications(categories.includes('Internship') ? 'Internship' : categories[0]);
        }
    }, []);

    return (
        <section
            id="certification"
            className="py-16 md:py-20 bg-[#ece8f5] dark:bg-[#1a1523] text-black dark:text-white transition-colors duration-300 rounded-b-[32px] md:rounded-b-[40px] overflow-hidden"
        >
            <div className="container">

                {/* ── Two-column header ── */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12 mb-8 md:mb-12">

                    {/* Left: strip + label + big heading */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="block w-8 h-[2px] bg-violet-600 dark:bg-violet-400 rounded-full flex-shrink-0"
                            />
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-600 dark:text-violet-400">
                                Certification
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-black dark:text-white">
                            Credentials I've
                        </h2>
                        <p className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal text-violet-600 dark:text-violet-400 mt-2 leading-[1.2] tracking-tight">
                            Earned & Verified
                        </p>
                    </motion.div>

                    {/* Right: subtitle */}
                    <motion.p 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-sm md:text-base text-black/75 dark:text-white/75 max-w-xs md:max-w-[360px] md:text-right leading-relaxed flex-shrink-0"
                    >
                        Professional credentials and academic accomplishments I have achieved.
                    </motion.p>
                </div>

                {/* ── Category Filter Tabs ── */}
                {categories.length > 0 && (
                    <div className="flex w-full sm:inline-flex sm:w-auto items-center p-[3px] bg-violet-100/50 dark:bg-violet-900/20 border border-violet-300 dark:border-violet-700 rounded-full mb-6 overflow-x-auto max-w-full scroll-hide">
                        {categories.map((c: string = "", i: number) => (
                            <button
                                key={i}
                                onClick={() => filterCertifications(c)}
                                className={`flex-1 sm:flex-initial px-5 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full whitespace-nowrap cursor-pointer transition-all duration-300 ${
                                    category.toLowerCase() === c.toLowerCase()
                                        ? "bg-violet-600 text-white shadow-md"
                                        : "bg-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Certifications Grid ── */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
                    {filteredCertifications.slice(0, viewAll ? filteredCertifications.length : 6).map((p: project, i: number) => (
                        <ProjectCard key={i} {...p} />
                    ))}
                </div>

                {/* ── View All ── */}
                {filteredCertifications.length > 6 && (
                    <ViewAll
                        scrollTo="certification"
                        title={viewAll ? 'Show Less' : 'View All'}
                        handleClick={() => setViewAll(!viewAll)}
                    />
                )}
            </div>
        </section>
    )
}

export default Certifications;
