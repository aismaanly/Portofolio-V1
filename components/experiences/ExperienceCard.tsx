'use client';
import { MdWork, MdGroups, MdSchool } from 'react-icons/md'
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ExperienceProps {
    index: number;
    company?: string;
    position?: string;
    degree?: string;
    institute?: string;
    duration?: string;
    desc?: string[];
    isVolunteer?: boolean;
    isEducation?: boolean;
}

const ExperienceCard = ({ index, company, position, degree, institute, duration, desc, isVolunteer, isEducation }: ExperienceProps) => {

    const displayPosition = isEducation ? degree : position;
    const displayCompany = isEducation ? institute : company;

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const isLeft = index % 2 === 0;

    const cardVariants = {
        hidden: { x: isLeft ? 30 : -30, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className={`relative flex w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>

            {/* Timeline dot — absolutely centered on the vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 z-10 -translate-x-1/2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 ring-8 ring-[#f5f5f5] dark:ring-[#120f16] border border-violet-200 dark:border-violet-700">
                    {isEducation ? (
                        <MdSchool className="text-sm text-violet-600 dark:text-violet-600" />
                    ) : isVolunteer ? (
                        <MdGroups className="text-sm text-violet-600 dark:text-violet-600" />
                    ) : (
                        <MdWork className="text-sm text-violet-600 dark:text-violet-600" />
                    )}
                </span>
            </div>

            {/* Card */}
            <motion.div
                ref={ref}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 md:p-6 rounded-xl border border-black/10 dark:border-white/[0.08]
                    bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm
                    hover:border-violet-300/60 dark:hover:border-violet-700/50
                    transition-all duration-300
                    ml-12 md:ml-0
                `}
            >
                {/* Duration badge */}
                {duration && (
                    <span className="inline-block mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-3 py-0.5">
                        {duration}
                    </span>
                )}

                <h3 className="font-bold text-base md:text-lg text-black dark:text-white mb-1 leading-snug">
                    {displayPosition}
                </h3>
                <p className="text-sm font-medium text-black/50 dark:text-white/50 mb-3">
                    {displayCompany}
                </p>

                {desc && desc.length > 0 && (
                    <ul className="space-y-1.5">
                        {desc.map((d, i) => (
                            <li key={i} className="text-sm text-black/65 dark:text-white/60 flex items-start gap-2">
                                <span className="mt-[7px] w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
                                {d}
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>
        </div>
    )
}

export default ExperienceCard