import { project } from "@/types/main"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaVideo } from "react-icons/fa"
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
    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial='hidden'
            animate={inView ? 'visible' : 'hidden'}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className="flex flex-col gap-2 bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm rounded-xl p-4 border border-black/10 dark:border-white/[0.08] hover:border-violet-300/60 dark:hover:border-violet-700/50 shadow-sm hover:shadow-lg transition-colors duration-300 text-black dark:text-white cursor-pointer select-none">

            <div className="relative group rounded-lg bg-violet-50 dark:bg-violet-950/40">
                <Image alt={name} width={1000} height={1000} className="max-w-full h-48 max-h-full object-cover object-top rounded-lg" src={image} />
                {(links.visit.trim() || links.code.trim() || links.video.trim()) &&
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 scale-x-0 group-hover:scale-100 transition-transform origin-left duration-200 ease-linear bg-gray-800 bg-opacity-60 w-full h-full rounded-lg flex items-center gap-4 justify-center"
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
                    </div>
                }
            </div>

            <div className="my-2 flex flex-col gap-1.5">
                <h3 className="text-base font-semibold leading-snug line-clamp-1">{name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2"> <span className="font-medium">Skills:</span> {techstack}</p>
            </div>

        </motion.div>
    )
}

export default Project