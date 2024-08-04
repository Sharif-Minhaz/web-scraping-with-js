import { writeResult } from "../utils/writeResult.js";
import { JSDOM } from "jsdom";

// weapon, armor, helmet, ranged_weapon, rarity, faction
const data = {
	about: "This data refers to Equipment Sets in Shadow Fight 3",
	common: {}, // a heading
	rare: {},
	epic: {},
	unique: {},
	legendary: {},
};

export async function fandomWikiScrapService(url) {
	try {
		// get the raw text form the url
		const res = await fetch(url);
		const result = await res.text(); // transform to the raw text

		const dom = new JSDOM(result); // convert to backend workable dom tree

		// get all the headings
		const allHeadings = dom.window.document.querySelectorAll(".mw-headline");

		// get all the descriptions
		const allDescriptions = dom.window.document.querySelectorAll("h2 + p");

		// get all the faction image information
		const allImages = dom.window.document.querySelectorAll(
			".center > .floatnone > .image:has(img[alt$=Small])"
		);

		// get all the set's table
		const allTables = dom.window.document.querySelectorAll(
			".article-table.article-table-selected"
		);

		// simulate based on the number of headings [5 times this case]
		allHeadings.forEach((info, index) => {
			const heading = info?.textContent || ""; // extract heading text
			const description = allDescriptions[index]?.textContent.trim() || ""; // extract description text

			const sets = []; // empty set's array

			// simulate 3 tables at a time [dynasty, hearalds, legion]
			for (let i = index * 3; i < (index + 1) * 3 && i < allTables.length; i++) {
				const table = allTables[i]; // grab a single table

				const allRows = table.querySelectorAll("tbody tr:has(td)"); // NOTE: use has selector for parent selecting based on children

				allRows.forEach((row) => {
					const tds = row.querySelectorAll("td[style]"); // getting all table data [td] from the row

					const info = getFullSetInfo(allImages, tds, i); // a full set information

					sets.push(info); // push the single set
				});
			}

			// insert the respective data based on the heading [common/rare/unique/epic etc]
			data[heading.toLowerCase()] = { rarity: heading, description, sets };
		});

		writeResult(data, "fandom_wiki"); // write result to a json file, public/json/result.json
	} catch (error) {
		console.error(error.message);
	}
}

// for extracting image from <a href=""> note: img src is dynamic in fandom wiki
function getTdImage(tds, index) {
	return tds[index]?.querySelector("figure > a")?.href?.split(".png")[0].concat(".png") || "";
}

// for extracting image for set icon
function getSetIcon(td) {
	return td?.querySelector("div.floatnone > a")?.href?.split(".png")[0].concat(".png") || "";
}

// get the appropriate fiction for the set
function getFiction(allImages, factionNo) {
	return {
		name: allImages[factionNo].querySelector("img")?.alt.split(" ")[0],
		image_url: allImages[factionNo]?.href?.split(".png")[0].concat(".png"),
	};
}

// fetch the td value
function getFieldValue(tds, index, increment = 0) {
	return {
		name: tds[index + increment]?.textContent?.trim() || "",
		image_url: getTdImage(tds, index + increment),
	};
}

// get special set's power/ability information
function getSetPowerInfo(tds) {
	return {
		name: tds[0]?.querySelector("b")?.textContent || "",
		icon: getSetIcon(tds[0]),
		ability: tds[1]?.textContent.trim() || "",
	};
}

// get a single full information
function getFullSetInfo(allImages, tds, factionNo) {
	// table heading count
	switch (tds.length) {
		case 4: // common / rare / epic
			return {
				faction: getFiction(allImages, factionNo),
				...["weapon", "armor", "helmet", "ranged_weapon"].reduce((acc, name, index) => {
					acc[name] = getFieldValue(tds, index);
					return acc;
				}, {}),
			};
		case 6: // legendary
			return {
				setInfo: getSetPowerInfo(tds),
				faction: getFiction(allImages, factionNo),
				...["weapon", "armor", "helmet", "ranged_weapon"].reduce((acc, name, index) => {
					acc[name] = getFieldValue(tds, index, 2);
					return acc;
				}, {}),
			};
		case 7: // unique
			return {
				setInfo: getSetPowerInfo(tds),
				...["weapon", "armor", "helmet", "ranged_weapon"].reduce((acc, name, index) => {
					acc[name] = getFieldValue(tds, index, 2);
					return acc;
				}, {}),
				event: tds[6]?.textContent.trim(),
			};
		default:
			return {};
	}
}
