import project1Image from "../assets/project1.png";
import project2Image from "../assets/sorts.png";
// import project3Image from ",,/assets/project3.png";

export const projectsMeta = {
	heading: "Featured Projects",
	tagline: "Turning ideas into scalable and functional products.",
};

export const projects = [
	{
		id: "project1",
		name: "Project 1",
		desc: "Blah Blah Blah.",
		tags: ["React", "JavaScript", "Tailwind"],
		image: project1Image,
		github: "#",
		live: "",
	},
	{
		id: "project2",
		name: "Project 2",
		desc: "Blah Blah Blah",
		tags: ["Ruby", "Ruby on Rails", "Postgresql"],
		image: project2Image,
		github: "#",
		live: "",
	},
	{
		id: "project3",
		name: "Project 3",
		desc: "Blah Blah Blah",
		tags: ["Java", "SpringBoot", "SQLite3"],
		// image: project3Image,
		icon: "project 3",
		github: "#",
		live: "#",
	},
];
