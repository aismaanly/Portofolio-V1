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
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

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

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchEndX(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;
        const diff = touchStartX - touchEndX;
        const minSwipeDistance = 50; // pixels

        if (diff > minSwipeDistance) {
            // Swiped left -> next image
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        } else if (diff < -minSwipeDistance) {
            // Swiped right -> prev image
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
        
        setTouchStartX(null);
        setTouchEndX(null);
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
                className="relative w-full max-w-5xl bg-[#f5f5f5] dark:bg-[#1a1523] border border-black/10 dark:border-white/[0.08] rounded-2xl shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[480px] max-h-[90vh] my-auto"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-[100] p-2 rounded-full bg-white/90 hover:bg-white dark:bg-[#1a1523]/90 dark:hover:bg-[#1a1523] text-violet-950 dark:text-violet-200 border border-black/10 dark:border-white/10 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Close modal"
                >
                    <MdClose size={20} />
                </button>

                {/* Left Column: Project Image Slider */}
                <div className="w-full h-[35%] md:h-full md:w-[50%] bg-violet-100/30 dark:bg-violet-950/20 flex items-center justify-center border-b md:border-b-0 md:border-r border-black/10 dark:border-white/[0.05] relative select-none rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
                    <div 
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="relative w-full h-full overflow-hidden group/slider flex items-center justify-center rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl cursor-grab active:cursor-grabbing"
                    >
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

                                                {/* Image Navigation Arrows (inside overflow-hidden inner container) - Hidden on Mobile */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white dark:bg-[#1a1523]/90 dark:hover:bg-[#1a1523] text-violet-950 dark:text-violet-200 border border-black/10 dark:border-white/10 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-10 items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                                            aria-label="Previous image"
                                        >
                                            <MdChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white dark:bg-[#1a1523]/90 dark:hover:bg-[#1a1523] text-violet-950 dark:text-violet-200 border border-black/10 dark:border-white/10 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-10 items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                                            aria-label="Next image"
                                        >
                                            <MdChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Indicator Dots (Inside overflow-hidden to overlay the image) */}
                                {images.length > 1 && (
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
                <div className="w-full md:w-[50%] pl-6 pr-3 py-6 md:p-8 flex flex-col flex-1 gap-4 text-black dark:text-white min-h-0 bg-[#f5f5f5] dark:bg-[#1a1523] rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
                    <div className="flex-1 overflow-y-auto pr-3 flex flex-col gap-4">
                        {/* Category tag & Project Index */}
                        <div className="flex items-center gap-3">
                            <span className="inline-block text-[10px] font-extrabold tracking-[0.25em] uppercase text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/40 rounded-full px-3 py-1">
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
                        <div className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
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
                    <div className="flex flex-nowrap items-center gap-1.5 md:gap-2 pt-4 border-t border-black/5 dark:border-white/[0.05] w-full overflow-x-auto scrollbar-none flex-shrink-0">
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
                                className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2 bg-violet-700 dark:bg-violet-700 text-white rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 hover:bg-violet-800 dark:hover:bg-violet-800 cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
                            >
                                <BiLinkExternal size={12} className="md:w-[13px] md:h-[13px]" />
                                <span>Go Live</span>
                            </Link>
                        )}
                        {project.links.video.trim() && (
                            <Link
                                href={project.links.video}
                                target="_blank"
                                className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2 bg-violet-100/50 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 text-violet-800 dark:text-violet-300 rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 hover:bg-violet-200/60 dark:hover:bg-violet-500/30 cursor-pointer whitespace-nowrap flex-shrink-0"
                            >
                                <FaVideo size={12} className="md:w-[13px] md:h-[13px]" />
                                <span>Video</span>
                            </Link>
                        )}
                        {project.links.report && project.links.report.trim() && (
                            <Link
                                href={project.links.report}
                                target="_blank"
                                className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2 border border-black/25 dark:border-white/25 text-black dark:text-white rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 hover:border-violet-600 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer whitespace-nowrap flex-shrink-0"
                            >
                                <BiLinkExternal size={12} className="md:w-[13px] md:h-[13px]" />
                                <span>Report</span>
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
