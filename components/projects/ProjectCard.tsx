import { project } from "@/types/main"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaVideo, FaFileAlt } from "react-icons/fa"
import { BiLinkExternal } from "react-icons/bi"
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } }
};

interface ProjectCardProps extends project {
    onClick?: () => void;
}

const Project = ({ name, image, category, techstack, links, onClick }: ProjectCardProps) => {

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const displayImage = Array.isArray(image) ? image[0] : image;
    const hasImage = typeof displayImage === "string" && displayImage.trim() !== "";

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial='hidden'
            animate={inView ? 'visible' : 'hidden'}
            whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
            onClick={onClick}
            className="flex flex-col gap-2 bg-white/80 dark:bg-[#201a2e]/80 backdrop-blur-sm rounded-2xl p-4 border border-black/20 dark:border-white/20 hover:border-violet-300 dark:hover:border-violet-700 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6),_0_2px_6px_rgba(168,85,247,0.1),_0_6px_12px_-3px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),_0_4px_12px_rgba(168,85,247,0.2),_0_14px_24px_-4px_rgba(168,85,247,0.45)] transition-[border-color,box-shadow,background-color] duration-200 ease-out text-black dark:text-white cursor-pointer select-none">

            <div className="relative group rounded-xl bg-violet-50 dark:bg-violet-950/40 overflow-hidden">
                {hasImage ? (
                    <Image alt={name} width={1000} height={1000} className="max-w-full h-48 max-h-full object-cover object-top rounded-xl" src={displayImage} />
                ) : (
                    <div className="w-full h-48 rounded-xl bg-[#e5e0f0] dark:bg-[#130f1b] flex items-center justify-center text-black/40 dark:text-white/40 font-medium text-xs">
                        No Image Available
                    </div>
                )}
                {(links.visit.trim() || links.code.trim() || links.video.trim()) &&
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 scale-x-0 group-hover:scale-100 transition-transform origin-left duration-200 ease-linear bg-gray-800 bg-opacity-60 w-full h-full rounded-xl flex items-center gap-4 justify-center"
                    >
                        {links.visit.trim() &&
                            <Link href={links.visit} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <BiLinkExternal size={20} />
                            </Link>
                        }
                        {links.code.trim() &&
                            <Link href={links.code} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <FaGithub size={20} />
                            </Link>
                        }
                        {links.video.trim() &&
                            <Link href={links.video} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <FaVideo size={20} />
                            </Link>
                        }
                        {links.report?.trim() &&
                            <Link href={links.report} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <FaFileAlt size={20} />
                            </Link>
                        }
                    </div>
                }
            </div>

            <div className="my-2 flex flex-col gap-1.5">
                <h3 className="text-base font-semibold leading-snug line-clamp-1">{name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"> <span className="font-medium">Skills:</span> {techstack}</p>
            </div>

        </motion.div>
    )
}

export default Project