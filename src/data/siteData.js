// ─────────────────────────────────────────────────────────────
//  All site content in one place.
//  Edit this file to update any text, links, or lists.
// ─────────────────────────────────────────────────────────────

export const hero = {
	name: "Finn",
	role: "Student Software Engineer",
};

export const about = {
	heading: "About Me",
	body: "Hi, I am Naing Htoo Lwin, a Software Engineering student at the University of Sheffield. I build modern web apps, developer tools, and purposeful software.",
};

export const experience = [
	{
		year: "Oct 2025 — Present",
		title: "IT Representative",
		place: "iForge Makerspace",
		desc: "Contributed in developing the new version of iForge Training platform, adminstrating IT problems over the makerspace.",
		side: "left",
	},
	{
		year: "Nov 2025 — Jan 2026",
		title: "AI Product QA Intern",
		place: "Kith AI Lab",
		desc: "",
		side: "right",
	},
	{
		year: "Oct 2025 — Present",
		title: "Mobile Developer",
		place: "Project Echo",
		desc: "Designed and Implemented an Android companion app for hearing aid.",
		side: "left",
	},
	{
		year: "2023",
		title: "First Line of Code",
		place: "",
		desc: 'print("Hello, World!")',
		side: "right",
	},
];

export const skills = [
	{
		category: "Frontend",
		items: [
			{ label: "React" },
			{ label: "TypeScript" },
			{ label: "Next.js" },
			{ label: "Tailwind" },
			{ label: "Three.js" },
			{ label: "GSAP" },
		],
	},
	{
		category: "Backend",
		items: [{ label: "Java" }, { label: "Python" }, { label: "Ruby" }, { label: "Haskell" }, { label: "REST" }],
	},
	{
		category: "Database",
		items: [{ label: "PostgreSQL" }, { label: "SQLite3" }, { label: "MongoDB" }, { label: "CRUD" }],
	},
	{
		category: "Tools",
		items: [
			{ label: "Git", featured: false },
			{ label: "Github", featured: false },
			{ label: "Gitlab", featured: false },
			{ label: "Docker", featured: false },
			{ label: "Linux", featured: false },
			{ label: "Figma", featured: false },
			{ label: "Insomnia", featured: false },
		],
	},
];

export const projects = [
	{
		id: "project1",
		name: "Project 1",
		desc: "Blah Blah Blah.",
		tags: ["React", "JavaScript", "Tailwind"],
		image: "/assets/image.png",
		github: "#",
		live: "",
	},
	{
		id: "project2",
		name: "Project 2",
		desc: "Blah Blah Blah",
		tags: ["Ruby", "Ruby on Rails", "Postgresql"],
		image: "/assets/sorts.png",
		github: "#",
		live: "",
	},
	{
		id: "project3",
		name: "Project 3",
		desc: "Blah Blah Blah",
		tags: ["Java", "SpringBoot", "SQLite3"],
		image: "◇",
		github: "#",
		live: "#",
	},
];

export const contact = {
	heading: "Let's Connect.",
	body: "Open to internships, placements and freelance oppportunities. Reach out through any of the links below.",
	links: [
		{ key: "Email", value: "nainghtoolwin1385@gmail.com", href: "mailto:nainghtoolwin1385@gmail.com" },
		{ key: "GitHub", value: "github.com/finnxiii", href: "https://github.com/finnxiii" },
		{ key: "LinkedIn", value: "linkedin.com/in/nainghtoolwin", href: "https://linkedin.com/in/nainghtoolwin" },
		{ key: "Resume", value: "finnxiii_cv.pdf", href: "/finnxiii_cv.pdf" },
	],
};

// Path drawing sequence for the hero SVG.
// delay and dur are in milliseconds.
export const heroPathSequence = [
	{ id: "p-F1", delay: 0, dur: 540 },
	{ id: "p-F2", delay: 160, dur: 380 },
	{ id: "p-F3", delay: 300, dur: 320 },
	{ id: "p-I1", delay: 460, dur: 540 },
	{ id: "p-N1a", delay: 640, dur: 540 },
	{ id: "p-N1b", delay: 800, dur: 600 },
	{ id: "p-N1c", delay: 980, dur: 540 },
	{ id: "p-N2a", delay: 1140, dur: 540 },
	{ id: "p-N2b", delay: 1300, dur: 600 },
	{ id: "p-N2c", delay: 1480, dur: 540 },
];

export const heroTextSequence = [{ id: "ht-role", delay: 1750, dur: 520 }];

// Sidebar section list — order must match DOM render order
export const sections = ["hero", "about", "skills", "projects", "contact"];
