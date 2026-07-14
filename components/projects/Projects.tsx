'use client';
import { project } from "@/types/main";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

interface Props {
    projectsData: project[]
}

const Projects = ({ projectsData }: Props) => {

    const [projects] = useState(projectsData || [])
    const categories = [...Array.from(new Set(projects.map((s) => s.category)))]
    const [category, setCategory] = useState(categories[0])
    const [filteredProjects, setFilteredProjects] = useState(projects as project[])
    const [viewAll, setViewAll] = useState(false)
    const [selectedProject, setSelectedProject] = useState<project | null>(null)

    const filterProjects = (cat: string) => {
        setViewAll(false)
        setCategory(cat)
        setFilteredProjects(projects.filter((p: project) => p.category.toLowerCase() === cat.toLowerCase()));
    }

    useEffect(() => {
        filterProjects(categories.includes('MERN Stack') ? "MERN Stack" : categories[0])
    }, [])

    return (
        <section
            id="project"
            className="py-16 md:py-20 bg-[#ece8f5] dark:bg-[#1a1523] text-black dark:text-white transition-colors duration-300"
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
                                Project
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-black dark:text-white">
                            Things I've
                        </h2>
                        <p className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal text-violet-600 dark:text-violet-400 mt-2 leading-[1.2] tracking-tight">
                            Built & Shipped
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
                        A curated showcase of applications and digital experiences.
                    </motion.p>
                </div>

                {/* ── Category Filter Tabs ── */}
                <div className="inline-flex items-center p-[3px] bg-violet-100/50 dark:bg-violet-900/20 border border-violet-300 dark:border-violet-700 rounded-full mb-6 overflow-x-auto max-w-full scroll-hide">
                    {categories.map((c: string = "", i: number) => (
                        <button
                            key={i}
                            onClick={() => filterProjects(c)}
                            className={`px-5 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full whitespace-nowrap cursor-pointer transition-all duration-300 ${
                                category.toLowerCase() === c.toLowerCase()
                                    ? "bg-violet-600 text-white shadow-md"
                                    : "bg-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* ── Project Grid ── */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
                    {filteredProjects.slice(0, viewAll ? filteredProjects.length : 6).map((p: project, i: number) => (
                        <ProjectCard key={i} {...p} onClick={() => setSelectedProject(p)} />
                    ))}
                </div>

                {/* ── View All ── */}
                {filteredProjects.length > 6 && (
                    <ViewAll
                        scrollTo="project"
                        title={viewAll ? 'Show Less' : 'View All'}
                        handleClick={() => setViewAll(!viewAll)}
                    />
                )}
            </div>

            {/* ── Project Details Modal ── */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        onPrev={() => {
                            const currentIndex = filteredProjects.findIndex(p => p.name === selectedProject.name);
                            if (currentIndex !== -1) {
                                const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
                                setSelectedProject(filteredProjects[prevIndex]);
                            }
                        }}
                        onNext={() => {
                            const currentIndex = filteredProjects.findIndex(p => p.name === selectedProject.name);
                            if (currentIndex !== -1) {
                                const nextIndex = (currentIndex + 1) % filteredProjects.length;
                                setSelectedProject(filteredProjects[nextIndex]);
                            }
                        }}
                        currentIndex={filteredProjects.findIndex(p => p.name === selectedProject.name)}
                        totalProjects={filteredProjects.length}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}

export default Projects

type MouseEventHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

export const ViewAll = ({ handleClick, title, scrollTo }: { handleClick: MouseEventHandler, title: string, scrollTo: string }) => {
    return (
        <div className="flex justify-center mt-10">
            {title === 'View All' ? (
                <button
                    onClick={handleClick}
                    className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg animate-bounce"
                >
                    {title}
                </button>
            ) : (
                <Link
                    to={scrollTo}
                    className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                    offset={-60}
                    smooth={true}
                    duration={500}
                    // @ts-ignore
                    onClick={() => handleClick()}
                >{title}</Link>
            )}
        </div>
    )
}