import { z } from "zod";

const kebabSlug = z
	.string()
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase-kebab (e.g. my-project)");

const NumberStat = z.object({
	value: z.string(),
	label: z.string(),
});

const CaseStudySections = z.object({
	problem: z.string(),
	investigation: z.string(),
	implementation: z.string(),
	whatBroke: z.string(),
	outcome: z.string(),
	learned: z.string(),
});

const Project = z.object({
	slug: kebabSlug,
	category: z.string(),
	title: z.string(),
	deck: z.string(),
	featured: z.boolean(),
	leadProject: z.boolean(),
	pullQuote: z.string().optional().default(""),
	numbers: z.array(NumberStat).optional().default([]),
	role: z.string(),
	timeframe: z.string(),
	team: z.string(),
	status: z.string(),
	stack: z.array(z.string()),
	github: z.string().optional().default(""),
	live: z.string().nullable().optional().default(null),
	screenshot: z.string().optional().default(""),
	relatedNote: z.string().optional(),
	figureCaption: z.string().optional().default(""),
	sections: CaseStudySections,
});

const Experience = z.object({
	dateRange: z.string(),
	org: z.string(),
	role: z.string(),
	bullets: z.array(z.string()),
	current: z.boolean(),
});

const PhilosophyItem = z.object({
	principle: z.string(),
	position: z.string(),
	example: z.string(),
	projectLink: z.string().optional().default(""),
});

const FieldNote = z.object({
	slug: kebabSlug,
	title: z.string(),
	date: z.string(),
	topic: z.string(),
	readTime: z.string(),
	deck: z.string().optional().default(""),
	relatedProject: z.string().optional(),
	body: z.string(),
});

const CurrentFocus = z.object({
	date: z.string(),
	buildingShort: z.string().optional().default(""),
	learningShort: z.string().optional().default(""),
	exploringShort: z.string().optional().default(""),
	buildingLink: z.string().optional().default(""),
	building: z.string(),
	learning: z.string(),
	exploring: z.string(),
});

const Meta = z.object({
	version: z.string(),
	lastUpdated: z.string(),
	editionLabel: z.string(),
});

const Availability = z.object({
	status: z.string().optional().default(""),
	detail: z.string().optional().default(""),
	cta: z.string().optional().default(""),
	href: z.string().optional().default(""),
});

const Profile = z.object({
	name: z.string(),
	role: z.string(),
	university: z.string(),
	graduation: z.string(),
	location: z.string(),
	bio: z.string(),
	interests: z.array(z.string()),
	heroHeadline: z.string(),
	heroStandfirst: z.string(),
	links: z.object({
		email: z.string(),
		github: z.string(),
		linkedin: z.string(),
		cv: z.string(),
	}),
	availability: Availability.optional(),
});

const ContentSchema = z.object({
	meta: Meta,
	profile: Profile,
	projects: z.array(Project),
	experience: z.array(Experience),
	philosophy: z.array(PhilosophyItem),
	fieldNotes: z.array(FieldNote),
	currentFocus: CurrentFocus,
});

export function validateContent(content) {
	const result = ContentSchema.safeParse(content);

	if (!result.success) {
		return {
			ok: false,
			errors: result.error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			})),
		};
	}

	const data = result.data;
	const errors = [];

	const projectSlugs = new Set(data.projects.map((p) => p.slug));
	const noteSlugs = new Set(data.fieldNotes.map((n) => n.slug));

	// Exactly one lead project
	const leadCount = data.projects.filter((p) => p.leadProject).length;
	if (leadCount !== 1) {
		errors.push({
			path: "projects",
			message: `Exactly one project must have leadProject: true (found ${leadCount})`,
		});
	}

	// Unique project slugs
	const projectSlugArr = data.projects.map((p) => p.slug);
	const projectDuplicates = projectSlugArr.filter((s, i) => projectSlugArr.indexOf(s) !== i);
	if (projectDuplicates.length > 0) {
		errors.push({ path: "projects", message: `Duplicate project slugs: ${projectDuplicates.join(", ")}` });
	}

	// Unique note slugs
	const noteSlugArr = data.fieldNotes.map((n) => n.slug);
	const noteDuplicates = noteSlugArr.filter((s, i) => noteSlugArr.indexOf(s) !== i);
	if (noteDuplicates.length > 0) {
		errors.push({ path: "fieldNotes", message: `Duplicate field note slugs: ${noteDuplicates.join(", ")}` });
	}

	// Cross-reference: relatedNote → existing note slug
	data.projects.forEach((project, i) => {
		if (project.relatedNote && !noteSlugs.has(project.relatedNote)) {
			errors.push({
				path: `projects.${i}.relatedNote`,
				message: `relatedNote "${project.relatedNote}" does not match any field note slug`,
			});
		}
	});

	// Cross-reference: relatedProject → existing project slug
	data.fieldNotes.forEach((note, i) => {
		if (note.relatedProject && !projectSlugs.has(note.relatedProject)) {
			errors.push({
				path: `fieldNotes.${i}.relatedProject`,
				message: `relatedProject "${note.relatedProject}" does not match any project slug`,
			});
		}
	});

	// Cross-reference: philosophy projectLink → /work/{slug} or /notes/{slug}
	data.philosophy.forEach((item, i) => {
		if (!item.projectLink) return;
		const workMatch = item.projectLink.match(/^\/work\/([^/]+)$/);
		const noteMatch = item.projectLink.match(/^\/notes\/([^/]+)$/);
		if (workMatch) {
			if (!projectSlugs.has(workMatch[1])) {
				errors.push({
					path: `philosophy.${i}.projectLink`,
					message: `projectLink "${item.projectLink}" does not match any project slug`,
				});
			}
		} else if (noteMatch) {
			if (!noteSlugs.has(noteMatch[1])) {
				errors.push({
					path: `philosophy.${i}.projectLink`,
					message: `projectLink "${item.projectLink}" does not match any note slug`,
				});
			}
		} else {
			errors.push({
				path: `philosophy.${i}.projectLink`,
				message: `projectLink must be /work/{slug} or /notes/{slug}`,
			});
		}
	});

	// Cross-reference: buildingLink → /work/{slug} or /notes/{slug}
	const buildingLink = data.currentFocus.buildingLink;
	if (buildingLink) {
		const workMatch = buildingLink.match(/^\/work\/([^/]+)$/);
		const noteMatch = buildingLink.match(/^\/notes\/([^/]+)$/);
		if (workMatch) {
			if (!projectSlugs.has(workMatch[1])) {
				errors.push({
					path: "currentFocus.buildingLink",
					message: `buildingLink "${buildingLink}" does not match any project slug`,
				});
			}
		} else if (noteMatch) {
			if (!noteSlugs.has(noteMatch[1])) {
				errors.push({
					path: "currentFocus.buildingLink",
					message: `buildingLink "${buildingLink}" does not match any note slug`,
				});
			}
		} else {
			errors.push({
				path: "currentFocus.buildingLink",
				message: "buildingLink must be /work/{slug} or /notes/{slug}",
			});
		}
	}

	if (errors.length > 0) return { ok: false, errors };
	return { ok: true, errors: [] };
}
