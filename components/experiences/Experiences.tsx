'use client';
import { volunteer, experience, education } from "@/types/main"
import { useState } from "react"
import { Link } from "react-scroll"
import { motion } from "framer-motion"
import ExperienceCard from "./ExperienceCard"

interface Props {
    experienceData: experience[]
    volunteerData: volunteer[]
    educationData: education[]
}

const Experiences = ({ experienceData, volunteerData, educationData }: Props) => {

    const [show, setShow] = useState("Experience")
    const [viewAll, setViewAll] = useState(false)

    const experiences = [...(experienceData || [])].reverse() as experience[]
    const volunteers = [...(volunteerData || [])].reverse() as volunteer[]
    const educations = [...(educationData || [])].reverse() as education[]

    const activeList = show === "Experience" ? experiences : show === "Volunteer" ? volunteers : educations

    return (
        <section
            id="experience"
            className="py-16 md:py-20 bg-[#f5f5f5] dark:bg-[#120f16] text-black dark:text-white transition-colors duration-300"
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
                                Experience
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-black dark:text-white">
                            Where I've
                        </h2>
                        <p className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal text-violet-600 dark:text-violet-400 mt-2 leading-[1.2] tracking-tight">
                            Grown & Learned
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
                        My professional journey, roles, and collaborative contributions.
                    </motion.p>
                </div>

                {/* ── Toggle tabs ── */}
                <div className="inline-flex items-center p-[3px] bg-violet-100/50 dark:bg-violet-900/20 border border-violet-300 dark:border-violet-700 rounded-full mb-6 overflow-x-auto max-w-full scroll-hide">
                    {['Experience', 'Education', 'Volunteer'].map((e, i) => (
                        <button
                            key={i}
                            onClick={() => { setShow(e); setViewAll(false); }}
                            className={`px-5 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full whitespace-nowrap cursor-pointer transition-all duration-300 ${show === e
                                    ? "bg-violet-600 text-white shadow-md"
                                    : "bg-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>

                {/* ── Timeline ── */}
                <div className="relative">
                    {/* Vertical line - centered precisely */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-black/10 dark:bg-white/[0.09] md:-translate-x-[1px]" />

                    <div className="flex flex-col gap-6 md:gap-10">
                        {activeList.slice(0, viewAll ? activeList.length : 2).map((e, i) => (
                            // @ts-ignore
                            <ExperienceCard key={i} {...e} index={i} isVolunteer={show === 'Volunteer'} isEducation={show === 'Education'} />
                        ))}
                    </div>
                </div>

                {/* ── View All ── */}
                {activeList.length > 2 && (
                    <div className="flex justify-center mt-10">
                        {viewAll ? (
                            <Link
                                to="experience"
                                className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                                offset={-20}
                                smooth={true}
                                duration={500}
                                onClick={() => setViewAll(false)}
                            >
                                Show Less
                            </Link>
                        ) : (
                            <button
                                onClick={() => setViewAll(true)}
                                className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg animate-bounce"
                            >
                                View All
                            </button>
                        )}
                    </div>
                )}

            </div>
        </section>
    )
}

export default Experiences