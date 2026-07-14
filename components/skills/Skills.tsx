'use client';
import { skill } from '@/types/main';
import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
    skillData: skill[]
}

interface MousePos {
    x: number;
    y: number;
}

const Skills = ({ skillData }: Props) => {
    const grouped = skillData.reduce((acc: Record<string, string[]>, s: skill) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s.name);
        return acc;
    }, {});

    const categories = Object.entries(grouped);
    const COLS = 3;

    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <section
            id="skills"
            className="py-16 md:py-20 bg-[#f5f5f5] dark:bg-[#120f16] transition-colors duration-300"
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
                                Skills
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-black dark:text-white">
                            Technologies I Use
                        </h2>
                        <p className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal text-violet-600 dark:text-violet-400 mt-2 leading-[1.2] tracking-tight">
                            To Build Products
                        </p>
                    </motion.div>

                    {/* Right: subtitle */}
                    <motion.p 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-sm md:text-base text-black/75 dark:text-white/75 max-w-xs md:max-w-[260px] md:text-right leading-relaxed flex-shrink-0"
                    >
                        Core technologies I build with. All production-tested.
                    </motion.p>
                </div>

                {/* ── Skills grid ── */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="relative rounded-2xl border border-black/10 dark:border-white/[0.09] overflow-hidden"
                >
                    {/* Global spotlight overlay */}
                    {isHovering && (
                        <div
                            className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
                            style={{
                                background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.06), transparent 60%)`,
                            }}
                        />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map(([cat, names], i) => {
                            const rowIndex = Math.floor(i / COLS);
                            const colIndex = i % COLS;
                            const isFirstRow = rowIndex === 0;
                            const isLastCol = colIndex === COLS - 1;

                            return (
                                <SkillCard
                                    key={cat}
                                    cat={cat}
                                    names={names}
                                    isFirstRow={isFirstRow}
                                    isLastCol={isLastCol}
                                    containerMousePos={mousePos}
                                    isContainerHovering={isHovering}
                                />
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

interface SkillCardProps {
    cat: string;
    names: string[];
    isFirstRow: boolean;
    isLastCol: boolean;
    containerMousePos: MousePos;
    isContainerHovering: boolean;
}

const SkillCard = ({
    cat,
    names,
    isFirstRow,
    isLastCol,
}: SkillCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [localMouse, setLocalMouse] = useState<MousePos>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setLocalMouse({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const borderClasses = [
        !isFirstRow ? 'border-t border-black/10 dark:border-white/[0.09]' : '',
        !isLastCol ? 'border-r border-black/10 dark:border-white/[0.09]' : '',
    ].join(' ');

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative p-5 md:p-7 flex flex-col gap-4 transition-all duration-300 ${borderClasses}
                bg-[#f0eef8] dark:bg-[#120f16]
                ${isHovered ? 'bg-[#e8e4f5] dark:bg-[#1c1828]' : ''}
            `}
        >
            {/* Top accent line on hover */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{ originX: 0 }}
                className="absolute top-0 left-0 right-0 h-[2.5px] bg-violet-600 dark:bg-violet-400"
            />

            {/* Mouse-following glow spotlight */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: `radial-gradient(260px circle at ${localMouse.x}px ${localMouse.y}px, rgba(139, 92, 246, 0.12) 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* Category title */}
            <h3 className="relative z-10 text-[10px] font-bold tracking-[0.25em] uppercase text-violet-600 dark:text-violet-400">
                {cat}
            </h3>

            {/* Skill name tags */}
            <div className="relative z-10 flex flex-wrap gap-1.5">
                {names.map((name) => (
                    <span
                        key={name}
                        className={`
                            inline-block px-2.5 py-1
                            text-[11px] md:text-[12px] font-medium
                            rounded-md
                            border
                            transition-all duration-200
                            cursor-default select-none
                            ${isHovered
                                ? 'border-violet-400/50 dark:border-violet-500/50 text-black dark:text-white bg-white/70 dark:bg-[#2a2440]/80'
                                : 'border-black/15 dark:border-white/[0.12] text-black/70 dark:text-white/70 bg-black/[0.04] dark:bg-white/[0.06]'
                            }
                            hover:border-violet-500 dark:hover:border-violet-400
                            hover:text-violet-700 dark:hover:text-white
                            hover:bg-violet-100/80 dark:hover:bg-[#2a2440]
                            hover:scale-[1.06]
                            hover:shadow-[0_0_10px_rgba(124,58,237,0.2)]
                            dark:hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]
                        `}
                    >
                        {name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Skills;