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
	body: "Software engineering student. Building modern web apps and developer tools with a focus on motion, interaction, and craft. Currently open to opportunities.",
	stats: [
		{ value: "3+", label: "Years" },
		{ value: "12", label: "Projects" },
		{ value: "∞", label: "Curiosity" },
	],
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
			{ label: "React", featured: true },
			{ label: "TypeScript", featured: true },
			{ label: "Next.js", featured: false },
			{ label: "Tailwind", featured: false },
			{ label: "Three.js", featured: false },
			{ label: "GSAP", featured: false },
		],
	},
	{
		category: "Backend",
		items: [
			{ label: "Java", featured: true },
			{ label: "Python", featured: true },
			{ label: "Ruby", featured: true },
			{ label: "Haskell", featured: false },
			{ label: "REST", featured: false },
		],
	},
	{
		category: "Database",
		items: [
			{ label: "PostgreSQL", featured: true },
			{ label: "Prisma", featured: false },
			{ label: "MongoDB", featured: false },
			{ label: "Redis", featured: false },
		],
	},
	{
		category: "Tooling",
		items: [
			{ label: "Git", featured: false },
			{ label: "Docker", featured: false },
			{ label: "Linux", featured: false },
			{ label: "Figma", featured: false },
			{ label: "CI/CD", featured: false },
		],
	},
];

export const projects = [
	{
		id: "habitflow",
		name: "HabitFlow",
		desc: "Full-stack habit tracker with AI insights, social feeds, and a GitHub-style heatmap.",
		tags: ["React", "TypeScript", "Tailwind"],
		icon: "◎",
		github: "#",
		live: "#",
	},
	{
		id: "neighbourly",
		name: "Neighbourly",
		desc: "Community app connecting neighbours with volunteers via real-time chat and maps.",
		tags: ["SvelteKit", "Tailwind", "Maps API"],
		icon: "◈",
		github: "#",
		live: "#",
	},
	{
		id: "client-delivery",
		name: "Client Delivery",
		desc: "End-to-end website for a local business. Requirements → prototype → deployment.",
		tags: ["Web Dev", "UI/UX", "Prototyping"],
		icon: "◇",
		github: "#",
		live: "#",
	},
];

export const contact = {
	heading: "Let's Connect.",
	body: "Open to full-time roles and freelance work. Reach out through any of the links below.",
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
