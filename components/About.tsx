'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import TiltedCard from './TiltedCard';
import ScrollReveal from './ScrollReveal';
import ScrollVelocity from './ScrollVelocity';
import { about } from "@/types/main";
import PdfModal from './PdfModal';

interface Props {
    aboutData: about,
    name: string,
    projectsCount?: number,
    certificationsCount?: number,
    experienceCount?: number
}

export default function About({
    aboutData,
    name,
    projectsCount = 0,
    certificationsCount = 0,
    experienceCount = 0
}: Props) {
    const { aboutImage, aboutImageCaption, title, about, resumeUrl, resumeUrlId, callUrl } = aboutData;
    const displayImage = aboutImage || '/hero-about.jpg';

    const getUrls = (url: string) => {
        if (!url) return { previewUrl: "", downloadUrl: "" };
        
        // 1. Google Drive PDF File
        if (url.includes("drive.google.com/file/d/")) {
            const fileId = url.split("/file/d/")[1]?.split("/")[0] || "";
            return {
                previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
                downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`
            };
        }
        
        // 2. Google Doc
        if (url.includes("docs.google.com/document/d/")) {
            const docId = url.split("/document/d/")[1]?.split("/")[0] || "";
            return {
                previewUrl: `https://docs.google.com/document/d/${docId}/preview`,
                downloadUrl: `https://docs.google.com/document/d/${docId}/export?format=pdf`
            };
        }
        
        // Default fallback (e.g. if they put a direct PDF link or local link)
        return {
            previewUrl: url,
            downloadUrl: url
        };
    };

    const { previewUrl: previewUrlEn, downloadUrl: downloadUrlEn } = getUrls(resumeUrl);
    const { previewUrl: previewUrlId, downloadUrl: downloadUrlId } = getUrls(resumeUrlId || "");
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Animate stats numbers counting up when section is visible
        const section = sectionRef.current;
        const content = contentRef.current;
        if (!section || !content) return;

        const statNumbers = section.querySelectorAll<HTMLElement>('[data-count]');

        const animateCount = (el: HTMLElement) => {
            const target = parseInt(el.getAttribute('data-count') || '0', 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1800;
            const start = performance.now();

            const tick = (now: number) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out expo
                const eased = 1 - Math.pow(1 - progress, 4);
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        statNumbers.forEach((el) => animateCount(el));
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(section);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const imgWidth = isMobile ? '195px' : '300px';
    const imgHeight = isMobile ? '260px' : '400px';

    return (
        <section
            id="about"
            ref={sectionRef}
            className="about-section bg-[#ece8f5] text-black dark:bg-[#1a1523] dark:text-white transition-colors duration-300"
            aria-label={`About ${name}`}
        >
            {/* Ghost background text */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 'clamp(100px, 20vw, 280px)',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    color: 'rgba(0,0,0,0.045)',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                    zIndex: 0,
                    fontFamily: 'inherit',
                }}
                className="about-ghost-text dark:!text-white/[0.045]"
            >
                ABOUT
            </div>

            <div className="about-inner">
                <div className="container" ref={contentRef}>
                    <div className="about-grid">

                        <div className="about-label-col fade-up-init">
                            <TiltedCard
                                imageSrc={displayImage}
                                altText={name}
                                captionText={aboutImageCaption || "Hi guys"}
                                containerWidth={imgWidth}
                                containerHeight={imgHeight}
                                imageWidth={imgWidth}
                                imageHeight={imgHeight}
                                rotateAmplitude={12}
                                scaleOnHover={1.08}
                                showMobileWarning={false}
                                showTooltip={true}
                            />
                        </div>

                        <div className="about-content">
                            <div className="space-y-3 md:space-y-4">
                                <motion.h3 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="font-serif italic font-bold text-violet-600 dark:text-violet-400 text-3xl md:text-4xl lg:text-5xl select-none"
                                >
                                    About me
                                </motion.h3>

                                <ScrollReveal
                                    textClassName="text-[9.5px] min-[360px]:text-[10.5px] min-[480px]:text-[12px] md:text-[17px] lg:text-[20px] font-bold leading-[1.3] min-[360px]:leading-[1.35] min-[480px]:leading-[1.4] md:leading-[1.5] lg:leading-[1.55] text-black/85 dark:text-white/85 tracking-[-0.01em] text-justify [text-justify:inter-word] break-words [hyphens:auto] [-webkit-hyphens:auto] [-ms-hyphens:auto]"
                                    baseOpacity={0.15}
                                    enableBlur={true}
                                    blurStrength={6}
                                    baseRotation={0}
                                    highlightWords={["intelligent", "data-driven", "AI-powered", "insights", "analytical", "scalable", "solutions"]}
                                >
                                    {about}
                                </ScrollReveal>
                            </div>

                            <div className="about-stats fade-up-init">
                                <div className="about-buttons justify-center flex flex-row flex-wrap gap-3 md:gap-4 md:flex-col md:flex-nowrap">
                                    {resumeUrl?.trim() && (
                                        <>
                                            <button
                                                onClick={() => setIsPdfOpen(true)}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-black/40 dark:border-white/40 bg-black/5 dark:bg-white/10 hover:bg-black dark:hover:bg-white hover:border-black dark:hover:border-white text-black dark:text-white hover:text-white dark:hover:text-black rounded-full text-xs font-semibold transition-all duration-300 group cursor-pointer w-auto md:w-full text-center whitespace-nowrap"
                                            >
                                                <svg className="w-3.5 h-3.5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                <span>Download CV</span>
                                            </button>
                                            <PdfModal
                                                isOpen={isPdfOpen}
                                                onClose={() => setIsPdfOpen(false)}
                                                previewUrlEn={previewUrlEn}
                                                previewUrlId={previewUrlId}
                                                downloadUrlEn={downloadUrlEn}
                                                downloadUrlId={downloadUrlId}
                                            />
                                        </>
                                    )}
                                    {callUrl?.trim() && (
                                        <a
                                            href={callUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-black dark:hover:bg-white border border-violet-600 hover:border-black dark:hover:border-white text-white hover:text-white dark:hover:text-black rounded-full text-xs font-semibold transition-all duration-300 group cursor-pointer shadow-md hover:shadow-none w-auto md:w-full text-center whitespace-nowrap"
                                        >
                                            <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:stroke-white dark:group-hover:stroke-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <span>PPT Portfolio</span>
                                        </a>
                                    )}
                                </div>
                                <div className="stat-item">
                                    <span
                                        className="stat-number"
                                        data-count={projectsCount}
                                        data-suffix="+"
                                    >
                                        0+
                                    </span>
                                    <span className="stat-label">Projects Delivered</span>
                                </div>
                                <div className="stat-item">
                                    <span
                                        className="stat-number"
                                        data-count={experienceCount}
                                        data-suffix="+"
                                    >
                                        0+
                                    </span>
                                    <span className="stat-label">Year Experience</span>
                                </div>
                                <div className="stat-item">
                                    <span
                                        className="stat-number"
                                        data-count={certificationsCount}
                                        data-suffix="+"
                                    >
                                        0+
                                    </span>
                                    <span className="stat-label">Certifications</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}