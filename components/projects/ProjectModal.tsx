'use client';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaVideo } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { project } from "@/types/main";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ProjectModalProps {
    project: project;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
    currentIndex?: number;
    totalProjects?: number;
}

const ProjectModal = ({
    project,
    onClose,
    onPrev,
    onNext,
    currentIndex,
    totalProjects
}: ProjectModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const rawImages = Array.isArray(project.image) ? project.image : [project.image];
    const images = rawImages.filter((img): img is string => typeof img === "string" && img.trim() !== "");

    // Handle out-of-bounds index during project transitions to prevent rendering undefined sources
    const activeImageSrc = (currentImageIndex >= 0 && currentImageIndex < images.length)
        ? images[currentImageIndex]
        : (images[0] || null);

    // Lock body scroll when modal is open
    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Reset active image index when project changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [project.name]);

    // Handle keyboard navigation (Arrow keys & Escape key)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (currentImageIndex < images.length - 1) {
                    setCurrentImageIndex((prev) => prev + 1);
                } else if (onNext) {
                    onNext();
                }
            } else if (e.key === "ArrowLeft") {
                if (currentImageIndex > 0) {
                    setCurrentImageIndex((prev) => prev - 1);
                } else if (onPrev) {
                    onPrev();
                }
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentImageIndex, images.length, onNext, onPrev, onClose]);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    if (!mounted) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        >
            {/* Previous Project Button (Outside the modal container) - Hidden on Mobile */}
            {onPrev && (
                <button
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="hidden md:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 text-white transition-all cursor-pointer z-30 shadow-lg border border-white/10 items-center justify-center"
                    aria-label="Previous project"
                >
                    <MdChevronLeft size={32} />
                </button>
            )}

            {/* Next Project Button (Outside the modal container) - Hidden on Mobile */}
            {onNext && (
                <button
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="hidden md:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 text-white transition-all cursor-pointer z-30 shadow-lg border border-white/10 items-center justify-center"
                    aria-label="Next project"
                >
                    <MdChevronRight size={32} />
                </button>
            )}

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-[#f5f5f5] dark:bg-[#1a1523] border border-black/10 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] my-auto"
            >
                {/* Mobile Navigation Controls */}
                {totalProjects && totalProjects > 1 && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 md:hidden bg-black/70 dark:bg-black/80 p-1 rounded-xl backdrop-blur-md border border-white/10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onPrev) onPrev();
                            }}
                            className="p-1.5 rounded-lg text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
                            aria-label="Previous project"
                        >
                            <MdChevronLeft size={16} />
                        </button>
                        {totalProjects && typeof currentIndex === "number" && (
                            <span className="text-[10px] font-extrabold text-white/95 select-none px-1 tracking-wider">
                                {currentIndex + 1}/{totalProjects}
                            </span>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onNext) onNext();
                            }}
                            className="p-1.5 rounded-lg text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
                            aria-label="Next project"
                        >
                            <MdChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/25 hover:bg-black/35 dark:bg-white/10 dark:hover:bg-white/20 text-white dark:text-gray-300 transition-colors cursor-pointer"
                    aria-label="Close modal"
                >
                    <MdClose size={20} />
                </button>

                {/* Left Column: Project Image Slider */}
                <div className="w-full md:w-1/2 bg-violet-100/30 dark:bg-violet-950/20 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/[0.05] min-h-[250px] md:min-h-0 relative select-none">
                    <div className="relative w-full h-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-md group/slider flex items-center justify-center w-full">
                        {activeImageSrc ? (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImageSrc}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={activeImageSrc}
                                            alt={`${project.name} image`}
                                            fill
                                            className="object-contain w-full h-full hover:scale-[1.02] transition-transform duration-500 bg-[#e5e0f0] dark:bg-[#130f1b]"
                                            sizes="(max-w-768px) 100vw, 50vw"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Image Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/45 hover:bg-black/60 dark:bg-white/10 dark:hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 border border-white/10 shadow-md flex items-center justify-center"
                                            aria-label="Previous image"
                                        >
                                            <MdChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/45 hover:bg-black/60 dark:bg-white/10 dark:hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 border border-white/10 shadow-md flex items-center justify-center"
                                            aria-label="Next image"
                                        >
                                            <MdChevronRight size={20} />
                                        </button>

                                        {/* Indicator Dots */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 dark:bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex(idx);
                                                    }}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        idx === currentImageIndex 
                                                            ? "bg-white w-4" 
                                                            : "bg-white/50 hover:bg-white/80"
                                                    }`}
                                                    aria-label={`Go to image ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="text-black/40 dark:text-white/40 font-medium text-xs">
                                No Image Available
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Project Details */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6 overflow-y-auto text-black dark:text-white">
                    <div className="flex flex-col gap-4">
                        {/* Category tag & Project Index */}
                        <div className="flex items-center gap-3">
                            <span className="inline-block text-[10px] font-extrabold tracking-[0.25em] uppercase text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/40 rounded-full px-3 py-1">
                                {project.category}
                            </span>
                            {totalProjects && typeof currentIndex === "number" && (
                                <span className="inline-block text-[10px] font-bold text-black/50 dark:text-white/50 bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/[0.08] rounded-full px-2.5 py-1">
                                    {currentIndex + 1} of {totalProjects}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-extrabold leading-tight text-black dark:text-white">
                            {project.name}
                        </h2>

                        {/* Description */}
                        <div className="text-sm text-black/70 dark:text-white/70 leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                            {project.description || "No description available for this project."}
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-col gap-2 mt-2">
                            <span className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Tech Stack</span>
                            <div className="flex flex-wrap gap-1.5">
                                {project.techstack.split(",").map((tech) => (
                                    <span
                                        key={tech.trim()}
                                        className="px-2.5 py-1 text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/[0.08] rounded-md text-black/80 dark:text-white/80"
                                    >
                                        {tech.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-nowrap items-center gap-1.5 md:gap-2 pt-4 border-t border-black/5 dark:border-white/[0.05] w-full overflow-x-auto scrollbar-none">
                        {project.links.code.trim() && (
                            <Link
                                href={project.links.code}
                                target="_blank"
                                className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 hover:bg-violet-600 dark:hover:bg-violet-400 hover:text-white dark:hover:text-black cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
                            >
                                <FaGithub size={12} className="md:w-[13px] md:h-[13px]" />
                                <span>GitHub</span>
                            </Link>
                        )}
                        {project.links.visit.trim() && (
                            <Link
                                href={project.links.visit}
                                target="_blank"
                                className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2 bg-violet-600 dark:bg-violet-500 text-white rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 hover:bg-violet-700 dark:hover:bg-violet-600 cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
                            >
                                <BiLinkExternal size={12} className="md:w-[13px] md:h-[13px]" />
                                <span>Live Demo</span>
                            </Link>
                        )}
                        {project.links.video.trim() && (
                            <Link
                                href={project.links.video}
                                target="_blank"
                                className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2 border border-black/25 dark:border-white/25 text-black dark:text-white rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 hover:border-violet-600 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer whitespace-nowrap flex-shrink-0"
                            >
                                <FaVideo size={12} className="md:w-[13px] md:h-[13px]" />
                                <span>Watch Video</span>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
};

export default ProjectModal;
