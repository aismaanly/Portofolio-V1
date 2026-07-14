'use client';

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFileDownload } from "react-icons/md";

interface PdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    previewUrlEn: string;
    previewUrlId: string;
    downloadUrlEn: string;
    downloadUrlId: string;
    title?: string;
}

const PdfModal = ({
    isOpen,
    onClose,
    previewUrlEn,
    previewUrlId,
    downloadUrlEn,
    downloadUrlId,
    title = "Curriculum Vitae"
}: PdfModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeLanguage, setActiveLanguage] = useState<"id" | "en">("en");
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Monitor container size for responsive scaling on mobile
    useEffect(() => {
        if (!isOpen) return;

        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        // Delay slightly to ensure elements are rendered
        const timer = setTimeout(updateWidth, 100);

        // Listen for resize using ResizeObserver
        const observer = new ResizeObserver(() => {
            updateWidth();
        });
        
        let targetEl = containerRef.current;
        if (targetEl) {
            observer.observe(targetEl);
        }

        window.addEventListener("resize", updateWidth);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener("resize", updateWidth);
        };
    }, [isOpen]);

    // Set loading state when switching language
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
        }
    }, [activeLanguage, isOpen]);

    // Handle body scroll locking
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const previewUrl = activeLanguage === "id" ? previewUrlId : previewUrlEn;
    const downloadUrl = activeLanguage === "id" ? downloadUrlId : downloadUrlEn;
    
    // Calculate dynamic scaling style for the iframe.
    // If the screen/container is narrow, we force a 1024px desktop viewport inside the iframe,
    // and scale it down using CSS transform. This tricks Google Docs into rendering in standard
    // desktop print layout instead of a reflowed/zoomed mobile view.
    const targetWidth = 1024;
    const isMobileView = containerWidth > 0 && containerWidth < 768;
    const scale = isMobileView ? containerWidth / targetWidth : 1;

    const iframeStyle: React.CSSProperties = isMobileView ? {
        width: `${targetWidth}px`,
        height: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        border: "none",
    } : {
        width: "100%",
        height: "100%",
        border: "none",
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative z-10 w-full max-w-5xl h-[85vh] md:h-[90vh] bg-white dark:bg-[#18151f] rounded-2xl overflow-hidden border border-black/10 dark:border-white/[0.08] shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/[0.05] bg-white/80 dark:bg-[#18151f]/80 backdrop-blur-sm z-20">
                        <div className="flex items-center gap-3">
                            {/* Custom language selector tabs in the UI (English on the left) */}
                            <div className="flex bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/[0.08] p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveLanguage("en")}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                        activeLanguage === "en"
                                            ? "bg-violet-600 text-white shadow-sm"
                                            : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                                    }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setActiveLanguage("id")}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                        activeLanguage === "id"
                                            ? "bg-violet-600 text-white shadow-sm"
                                            : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                                    }`}
                                >
                                    Indonesia
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Download Active Tab Button */}
                            <a
                                href={downloadUrl}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-lg"
                                title={`Download CV (${activeLanguage === "id" ? "Indonesia" : "English"})`}
                            >
                                <MdFileDownload size={16} />
                                <span className="hidden sm:inline">Download CV</span>
                            </a>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>
                    </div>

                    {/* PDF Frame Area */}
                    <div 
                        ref={containerRef}
                        className="relative flex-1 bg-neutral-100 dark:bg-[#0f0d14] overflow-hidden w-full h-full"
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#18151f] z-10">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-black/40 dark:text-white/40">
                                        Loading {activeLanguage === "id" ? "Indonesian" : "English"} CV...
                                    </span>
                                </div>
                            </div>
                        )}

                        <iframe
                            src={previewUrl}
                            style={iframeStyle}
                            title={title}
                            onLoad={() => setIsLoading(false)}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default PdfModal;
