'use client';
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Link as ScrollLink } from 'react-scroll'
import { FiSun, FiMoon } from 'react-icons/fi'
import { CgClose, CgMenuRight } from 'react-icons/cg'

// Section bg groups:
// 'warm'  → #ece8f5 (light) / #1a1523 (dark) → about, projects, certification
// 'cool'  → #f5f5f5 (light) / #120f16 (dark) → hero, skills, experience
type SectionType = 'hero' | 'warm' | 'cool' | 'contact'

export default function Header({ logo }: { logo: string }) {
    const [navCollapse, setNavCollapse] = useState(true)
    const [atContact, setAtContact] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeNav, setActiveNav] = useState<string>('')
    const [currentSection, setCurrentSection] = useState<SectionType>('hero')
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const HEADER_H = 64

        const updateScroll = () => {
            // Check if contact footer is visible
            // Since contact is a fixed parallax footer, we calculate its visibility based on the main scrollable container bottom boundary
            let contactInView = false
            const docHeight = document.documentElement.scrollHeight
            const winHeight = window.innerHeight
            // We are in the contact section only if we scroll to the very bottom area of the page (within 50px of the absolute bottom)
            if (window.scrollY >= docHeight - winHeight - 50 && window.scrollY > 100) {
                contactInView = true
            }
            setAtContact(contactInView)

            const headerMidpoint = HEADER_H / 2

            // Detect all main sections
            const aboutEl = document.getElementById('about')
            const skillsEl = document.getElementById('skills')
            const projectsEl = document.getElementById('project')
            const expEl = document.getElementById('experience')
            const certEl = document.getElementById('certification')

            const getRect = (el: HTMLElement | null) => el?.getBoundingClientRect()

            const aboutRect = getRect(aboutEl)
            const skillsRect = getRect(skillsEl)
            const projectsRect = getRect(projectsEl)
            const expRect = getRect(expEl)
            const certRect = getRect(certEl)

            // Helper: is the header inside this section?
            const inSection = (rect?: DOMRect) =>
                rect && rect.top <= headerMidpoint && rect.bottom > headerMidpoint

            let inHero = false
            let detected: string = ''

            if (contactInView) {
                setCurrentSection('contact')
            } else if (inSection(certRect)) {
                setCurrentSection('warm')
                detected = 'certification'
            } else if (inSection(expRect)) {
                setCurrentSection('cool')
                detected = 'experience'
            } else if (inSection(projectsRect)) {
                setCurrentSection('warm')
                detected = 'project'
            } else if (inSection(skillsRect)) {
                setCurrentSection('cool')
                detected = 'skills'
            } else if (inSection(aboutRect)) {
                setCurrentSection('warm')
                detected = 'about'
            } else if (aboutRect && aboutRect.top > HEADER_H) {
                setCurrentSection('hero')
                inHero = true
            } else {
                setCurrentSection('cool')
            }

            if (!contactInView) {
                if (detected) {
                    setActiveNav(detected)
                } else if (inHero) {
                    setActiveNav('')
                }
            } else {
                setActiveNav('contact')
            }

            // "scrolled" state — triggered as soon as user leaves the hero zone
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', updateScroll, { passive: true })
        updateScroll()
        return () => window.removeEventListener('scroll', updateScroll)
    }, [])

    const navs = ['about', 'skills', 'project', 'experience', 'certification']

    const scrollToContact = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
        setNavCollapse(true)
    }

    const getHeaderClass = () => {
        const isDark = resolvedTheme === 'dark';
        
        // Seamless state (no bg, no shadow, no border, no blur)
        // when at the hero (top of page, not scrolled)
        const isSeamless = !scrolled;
        
        if (isSeamless) {
            return `bg-transparent backdrop-blur-none border-b border-transparent shadow-none text-black dark:text-white`;
        }
        
        // Active scrolled state (glassmorphism: bg with transparency, blur, shadow, border)
        const bgClass = isDark ? 'bg-[#120f16]/80' : 'bg-white/80';
        
        return `${bgClass} backdrop-blur-md border-b border-black/10 dark:border-white/10 shadow-lg text-black dark:text-white`;
    }

    const navHoverClass = 'hover:text-violet-600 dark:hover:text-violet-400'

    const themeToggleClass = 'hover:bg-black/10 dark:hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors'

    const getOffset = (section: string) => {
        if (section === 'about') return -20
        return -20
    }

    const getNavActiveClass = (nav: string) => {
        const baseClass = 'transition-colors capitalize cursor-pointer'
        const activeClass = 'text-violet-700 dark:text-violet-400' // removed bold to prevent shift
        const inactiveClass = navHoverClass
        return activeNav === nav ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`
    }

    return (
        <header className={`transition-all duration-300 ${getHeaderClass()} z-30 min-w-full flex flex-col fixed`}>
            <nav className='lg:w-11/12 2xl:w-4/5 w-full md:px-6 2xl:px-0 mx-auto py-4 hidden sm:flex items-center justify-between'>

                <Link href={'/'} className="transition-colors duration-300 pl-4">
                    <span className='text-xl font-bold tracking-tighter text-violet-600 dark:text-violet-500'>AISMA</span>
                </Link>

                <ul className='flex items-center gap-8 pr-8'>
                    {navs.map((e, i) => (
                        <li key={i}>
                            <ScrollLink
                                className={getNavActiveClass(e)}
                                to={e}
                                offset={getOffset(e)}
                                smooth={true}
                                duration={500}
                                isDynamic={true}
                            >
                                {e}
                            </ScrollLink>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={scrollToContact}
                            className={getNavActiveClass('contact') + ' bg-transparent border-0 font-inherit text-inherit p-0'}
                        >
                            contact
                        </button>
                    </li>

                    {mounted && (
                        <span
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={themeToggleClass}>
                            {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        </span>
                    )}
                </ul>
            </nav>

            {/* Mobile nav bar */}
            <nav className='pl-6 pr-6 py-4 flex sm:hidden items-center justify-between'>
                <span className='text-xl font-bold tracking-tighter text-violet-600 dark:text-violet-500'>AISMA</span>

                <div className='flex items-center gap-2'>
                    {mounted && (
                        <span
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={themeToggleClass}>
                            {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        </span>
                    )}
                    <button
                        onClick={() => setNavCollapse(!navCollapse)}
                        className="border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-800 dark:text-neutral-200 rounded-lg px-3 py-1 text-[10px] font-sans tracking-widest uppercase hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer font-bold"
                    >
                        MENU
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            <div className={`sm:hidden bg-[#f5f5f5]/95 dark:bg-[#120f16]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden ${!navCollapse ? 'max-h-[380px] opacity-100 border-t border-neutral-200 dark:border-neutral-800' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                <div className="flex flex-col p-6 gap-4">
                    {navs.map((e) => (
                        <ScrollLink
                            key={e}
                            className="text-neutral-800 dark:text-neutral-200 hover:text-violet-600 dark:hover:text-violet-400 font-sans tracking-widest text-[11px] font-bold transition-colors uppercase cursor-pointer py-1.5"
                            to={e}
                            offset={-20}
                            smooth={true}
                            duration={500}
                            isDynamic={true}
                            onClick={() => setNavCollapse(true)}
                        >
                            {e}
                        </ScrollLink>
                    ))}
                    <button
                        onClick={() => {
                            setNavCollapse(true);
                            scrollToContact();
                        }}
                        className="text-neutral-800 dark:text-neutral-200 hover:text-violet-600 dark:hover:text-violet-400 font-sans tracking-widest text-[11px] font-bold transition-colors uppercase cursor-pointer py-1.5 text-left bg-transparent border-none"
                    >
                        contact
                    </button>
                </div>
            </div>

        </header>
    )
}