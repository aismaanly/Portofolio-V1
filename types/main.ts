type skill = {
    name: string,
    image?: string,
    category: string
}

type project = {
    name: string,
    image: string,
    techstack: string,
    category: string,
    description?: string,
    links: {
        visit: string,
        code: string,
        video: string
    }
}

type experience = {
    company: string,
    position: string,
    duration: string,
    desc: string[]
}

type volunteer = {
    company: string,
    position: string,
    duration?: string,
    desc?: string[]
}

type education = {
    degree: string,
    institute: string,
    duration: string,
    desc?: string[]
}

type main = {
    name: string,
    titles: string[],
    heroImage: string,
    shortDesc: string,
    techStackImages: string[],
}

type about = {
    aboutImage: string,
    aboutImageCaption: string,
    title: string[],
    about: string,
    resumeUrl: string,
    resumeUrlId?: string,
    callUrl: string
}

type social = {
    name: string,
    icon: string,
    link: string
}

type data = {
    main: main,
    about: about,
    skills: skill[],
    projects: project[],
    certifications?: project[],
    experiences: experience[],
    educations?: education[],
    volunteers?: volunteer[]
    contact?: social[]
    socials?: social[]
}

export type { data, main, about, skill, project, experience, volunteer, education, social };