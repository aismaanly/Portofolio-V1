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
    const [currentSection, setCurrentSection] = useState<SectionType>('hero')
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const HEADER_H = 64

        const updateScroll = () => {
            // Check if contact footer is revealed
            const scrollableDiv = document.querySelector('[data-scroll-content]') as HTMLElement
            if (scrollableDiv) {
                const rect = scrollableDiv.getBoundingClientRect()
                // Only make header transparent when the main container is scrolled past the header height (80px)
                if (rect.bottom <= 80) {
                    setAtContact(true)
                    setCurrentSection('contact')
                    return
                }
                setAtContact(false)
            }

            const headerMidpoint = HEADER_H / 2

            // Detect all main sections
            const aboutEl    = document.getElementById('about')
            const skillsEl   = document.getElementById('skills')
            const projectsEl = document.getElementById('project')
            const expEl      = document.getElementById('experience')
            const certEl     = document.getElementById('certification')

            const getRect = (el: HTMLElement | null) => el?.getBoundingClientRect()

            const aboutRect    = getRect(aboutEl)
            const skillsRect   = getRect(skillsEl)
            const projectsRect = getRect(projectsEl)
            const expRect      = getRect(expEl)
            const certRect     = getRect(certEl)

            // Helper: is the header inside this section?
            const inSection = (rect?: DOMRect) =>
                rect && rect.top <= headerMidpoint && rect.bottom > headerMidpoint

            if (inSection(certRect)) {
                // certification: warm (#ece8f5 / #1a1523)
                setCurrentSection('warm')
            } else if (inSection(expRect)) {
                // experience: cool (#f5f5f5 / #120f16)
                setCurrentSection('cool')
            } else if (inSection(projectsRect)) {
                // projects: warm (#ece8f5 / #1a1523)
                setCurrentSection('warm')
            } else if (inSection(skillsRect)) {
                // skills: cool (#f5f5f5 / #120f16)
                setCurrentSection('cool')
            } else if (inSection(aboutRect)) {
                // about: warm (#ece8f5 / #1a1523)
                setCurrentSection('warm')
            } else if (aboutRect && aboutRect.top > HEADER_H) {
                // above about → hero zone
                setCurrentSection('hero')
            } else {
                setCurrentSection('cool')
            }
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
        if (!mounted) {
            // Default blurred solid styling for server-side rendering and initial hydration
            return 'bg-[#f5f5f5]/85 text-black backdrop-blur-xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.08)] dark:bg-[#120f16]/85 dark:text-white dark:shadow-[0_2px_20px_-8px_rgba(0,0,0,0.4)]'
        }
        if (atContact) {
            // Use translucent blur matching the contact footer's color theme
            return 'bg-[#f5f5f5]/85 text-black backdrop-blur-xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.08)] dark:bg-[#120f16]/85 dark:text-white dark:shadow-[0_2px_20px_-8px_rgba(0,0,0,0.4)]'
        }
        switch (currentSection) {
            case 'hero':
                return 'bg-transparent text-black dark:text-white'
            case 'warm':
                // about, projects, certification background: #ece8f5 (light) / #1a1523 (dark)
                return 'bg-[#ece8f5]/80 text-black backdrop-blur-xl dark:bg-[#1a1523]/80 dark:text-white shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_-8px_rgba(0,0,0,0.4)]'
            case 'cool':
                // skills & experience background: #f5f5f5 (light) / #120f16 (dark)
                return 'bg-[#f5f5f5]/85 text-black backdrop-blur-xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.08)] dark:bg-[#120f16]/85 dark:text-white dark:shadow-[0_2px_20px_-8px_rgba(0,0,0,0.4)]'
            default:
                return 'bg-transparent text-black dark:text-white'
        }
    }

    const navHoverClass = currentSection === 'warm'
        ? 'hover:text-violet-600 dark:hover:text-violet-400'
        : 'hover:text-violet-700 dark:hover:text-violet-500'

    const themeToggleClass = currentSection === 'warm'
        ? 'hover:bg-black/10 dark:hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors'
        : 'hover:bg-black/10 dark:hover:bg-violet-700 p-1.5 rounded-full cursor-pointer transition-colors'

    const getOffset = (section: string) => {
        if (section === 'about') return -20
        return -20
    }

    return (
        <header className={`transition-all duration-300 ${getHeaderClass()} z-30 min-w-full flex flex-col fixed`}>
            <nav className='lg:w-11/12 2xl:w-4/5 w-full md:px-6 2xl:px-0 mx-auto py-4 hidden sm:flex items-center justify-between'>

                <Link href={'/'} className={`transition-colors duration-300`}>
                    <span className='text-xl font-bold tracking-tighter text-violet-600 dark:text-violet-500'>AISMA</span>
                </Link>

                <ul className='flex items-center gap-8'>
                    {navs.map((e, i) => (
                        <li key={i}>
                            <ScrollLink
                                className={`${navHoverClass} transition-colors capitalize cursor-pointer`}
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
                            className={`${navHoverClass} transition-colors capitalize cursor-pointer bg-transparent border-0 font-inherit text-inherit p-0`}
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
            <nav className='p-4 flex sm:hidden items-center justify-between'>
                <span className='text-xl font-bold tracking-tighter text-violet-600 dark:text-violet-500'>AISMA</span>

                <div className='flex items-center gap-4'>
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
            <div className={`sm:hidden bg-[#f5f5f5]/95 dark:bg-[#120f16]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden ${
                !navCollapse ? 'max-h-[380px] opacity-100 border-t border-neutral-200 dark:border-neutral-800' : 'max-h-0 opacity-0 pointer-events-none'
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