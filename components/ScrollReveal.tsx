'use client';

import React, { useEffect, useRef, useMemo, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  highlightWords?: string[];
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'top center-=15%',
  highlightWords = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [resizeKey, setResizeKey] = React.useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setResizeKey(prev => prev + 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
      const isHighlighted = highlightWords.some(
        hWord => cleanWord.toLowerCase() === hWord.toLowerCase()
      );

      return (
        <span className={`word ${isHighlighted ? 'about-highlight' : ''}`} key={index}>
          {word}
        </span>
      );
    });
  }, [children, highlightWords]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    if (isMobile) return;

    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    // Create GSAP animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      );

      const wordElements = el.querySelectorAll('.word');
      if (wordElements.length === 0) return;

      // Group elements by their offsetTop to identify lines
      const lineMap = new Map<number, HTMLElement[]>();
      wordElements.forEach((word) => {
        const htmlWord = word as HTMLElement;
        const top = htmlWord.offsetTop;
        
        // Find if there is an existing line within a small threshold (e.g., 5px)
        const foundKey = Array.from(lineMap.keys()).find(k => Math.abs(k - top) < 5);
        if (foundKey !== undefined) {
          lineMap.get(foundKey)!.push(htmlWord);
        } else {
          lineMap.set(top, [htmlWord]);
        }
      });

      // Sort lines by their offsetTop key
      const sortedTops = Array.from(lineMap.keys()).sort((a, b) => a - b);
      const lines = sortedTops.map(top => lineMap.get(top)!);

      // Animate each line individually based on its scroll position
      lines.forEach((lineWords) => {
        gsap.fromTo(
          lineWords,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.02,
            scrollTrigger: {
              trigger: lineWords[0],
              scroller,
              start: 'top 85%',
              end: 'top 65%',
              scrub: true,
            }
          }
        );

        if (enableBlur) {
          gsap.fromTo(
            lineWords,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.02,
              scrollTrigger: {
                trigger: lineWords[0],
                scroller,
                start: 'top 85%',
                end: 'top 65%',
                scrub: true,
              }
            }
          );
        }
      });
    }, el);

    return () => {
      ctx.revert(); // Safely cleans up all ScrollTriggers on unmount/re-render
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, isMobile, resizeKey]);

  if (isMobile) {
    return (
      <div className={`scroll-reveal ${containerClassName}`}>
        <p className={`scroll-reveal-text ${textClassName}`}>
          {typeof children === 'string' ? (
            children.split(/(\s+)/).map((word, index) => {
              if (word.match(/^\s+$/)) return word;
              const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
              const isHighlighted = highlightWords.some(
                hWord => cleanWord.toLowerCase() === hWord.toLowerCase()
              );
              if (isHighlighted) {
                return (
                  <span className="about-highlight" key={index}>
                    {word}
                  </span>
                );
              }
              return word;
            })
          ) : (
            children
          )}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <div className={`scroll-reveal-text ${textClassName}`}>{splitText}</div>
    </div>
  );
};

export default ScrollReveal;
