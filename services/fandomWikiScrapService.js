import { writeResult } from "../utils/writeResult.js";
import { JSDOM } from "jsdom";

// weapon, armor, helmet, ranged_weapon, rarity, faction

const test = {
	common: {
		rarity: "common",
		description: "",
		sets: [
			{
				faction: {
					name: "",
					image_url: "",
				},
				weapon: {
					name: "",
					image_url: "",
				},
				armor: {
					name: "",
					image_url: "",
				},
				helmet: {
					name: "",
					image_url: "",
				},
				ranged_weapon: {
					name: "",
					image_url: "",
				},
			},
		],
	},
	legendary: {
		rarity: "legendary",
		description: "",
		sets: [
			{
				setInfo: {
					name: "",
					description: "",
					ability: "",
				},
				faction: {
					name: "",
					image_url: "",
				},
				weapon: {
					name: "",
					image_url: "",
				},
				armor: {
					name: "",
					image_url: "",
				},
				helmet: {
					name: "",
					image_url: "",
				},
				ranged_weapon: {
					name: "",
					image_url: "",
				},
			},
		],
	},
};

const data = {
	about: "This data refers to Equipment Sets in Shadow Fight 3",
	common: {},
	rare: {},
	epic: {},
	unique: {},
	legendary: {},
};

export async function fandomWikiScrapService(url) {
	const res = await fetch(url);
	const result = await res.text();

	const dom = new JSDOM(result);

	const allHeadings = dom.window.document.querySelectorAll(".mw-headline");
	const allDescriptions = dom.window.document.querySelectorAll("h2 + p");

	const allImages = dom.window.document.querySelectorAll(".center > .floatnone > .image");

	const allTables = dom.window.document.querySelectorAll(".article-table.article-table-selected");

	allHeadings.forEach((info, index) => {
		const heading = info?.textContent || "";
		const description = allDescriptions[index]?.textContent || "";

		const sets = [];

		for (let i = index * 3; i < (index + 1) * 3 && i < allTables.length; i++) {
			const table = allTables[i];
			const allRows = table.querySelectorAll("tbody tr"); // This will work as we are still using NodeList
			// Do something with allRows

			allRows.forEach((row, serial) => {
				if (serial === 0) return;

				const tds = row.querySelectorAll("td[style]");

				const info = {
					setInfo: {
						name: "",
						description: "",
						ability: "",
					},
					faction: {
						name: allImages[i].querySelector("img")?.alt.split(" ")[0],
						image_url: allImages[i].href.split(".png")[0].concat(".png"),
					},
					weapon: {
						name: tds[0]?.textContent?.trim() || "",
						image_url: getTdImage(0),
					},
					armor: {
						name: tds[1]?.textContent?.trim() || "",
						image_url: getTdImage(1),
					},
					helmet: {
						name: tds[2]?.textContent?.trim() || "",
						image_url: getTdImage(2),
					},
					ranged_weapon: {
						name: tds[3]?.textContent?.trim() || "",
						image_url: getTdImage(3),
					},
				}; // set information

				sets.push(info); // push the single set
			});
		}

		data[heading.toLowerCase()] = { rarity: heading, description, sets };
	});

	// writeResult(data);

	console.log(data.unique.sets);
}

// custom function for selecting image
function getTdImage(tds, index) {
	return tds[index]?.querySelector("figure > a")?.href.split(".png")[0].concat(".png") || "";
}

function getNormalSetInfo(allImages, tds, factionNo) {
	// factionNo === i
	if (tds.length > 4) {
		return {
			setInfo: {
				name: "",
				description: "",
				ability: "",
			},
			faction: {
				name: allImages[factionNo].querySelector("img")?.alt.split(" ")[0],
				image_url: allImages[factionNo].href.split(".png")[0].concat(".png"),
			},
			...["weapon", "armor", "helmet", "ranged_weapon"].map((name, index) => {
				return {
					[name]: {
						name: tds[index]?.textContent?.trim() || "",
						image_url: getTdImage(tds, index),
					},
				};
			}),
		};
	}

	return {
		faction: {
			name: allImages[i].querySelector("img")?.alt.split(" ")[0],
			image_url: allImages[i].href.split(".png")[0].concat(".png"),
		},
		weapon: {
			name: tds[0]?.textContent?.trim() || "",
			image_url: getTdImage(tds, 0),
		},
		armor: {
			name: tds[1]?.textContent?.trim() || "",
			image_url: getTdImage(tds, 1),
		},
		helmet: {
			name: tds[2]?.textContent?.trim() || "",
			image_url: getTdImage(tds, 2),
		},
		ranged_weapon: {
			name: tds[3]?.textContent?.trim() || "",
			image_url: getTdImage(tds, 3),
		},
	};
}
