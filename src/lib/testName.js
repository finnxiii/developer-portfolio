export function deriveTestName(principle) {
	let s = principle.replace(/\.$/, "").replace(/all of /g, "");
	const words = s.split(/[\s,–-]+/).filter(Boolean);
	if (!words.length) return "";
	const firstWord = words[0].toLowerCase() + "s";
	const rest = words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
	return firstWord + rest.join("");
}

if (import.meta.env.DEV) {
	const checks = [
		["Start with the constraint, not the framework.", "startsWithTheConstraintNotTheFramework"],
		["Make the trade-off visible.",                   "makesTheTradeOffVisible"],
		["Build the smallest reliable version first.",    "buildsTheSmallestReliableVersionFirst"],
		["Treat failure modes as part of the design.",    "treatsFailureModesAsPartOfTheDesign"],
		["Validate the direction before building all of it.", "validatesTheDirectionBeforeBuildingIt"],
	];
	for (const [input, expected] of checks) {
		const got = deriveTestName(input);
		console.assert(got === expected, `testName: "${input}" → "${got}", expected "${expected}"`);
	}
}
