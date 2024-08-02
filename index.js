import puppeteer from "puppeteer";
import fs from "fs";

const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
const page = await browser.newPage();
await page.goto("https://google.com");

// 'input' is a CSS selector.
await page.type(".gLFyf", "Shadow fight arena"); // change the second parameter (use any keyword you want to search in the google)
await page.keyboard.press("Enter");

const extractResults = async (page, number) => {
	return await page.evaluate((pageNumber) => {
		// temp array to hold the results
		const data = {
			[`page${pageNumber}`]: [],
		};

		// Get all the search result elements
		const resultElements = document.querySelectorAll(".g");

		// Loop through each result element and extract the necessary information
		resultElements.forEach((result) => {
			const sourceHeading = result.querySelector(".VuuXrf")?.textContent || "";
			const source = result.querySelector("cite.tjvcx")?.textContent || "";
			const heading = result.querySelector(".LC20lb")?.textContent || "";
			const description = result.querySelector(".VwiC3b > span")?.textContent || "";

			data[`page${pageNumber}`]?.push({
				source_heading: sourceHeading,
				source: source.split("›")[0]?.trim(),
				heading: heading,
				description: description,
			});
		});

		return data;
	}, number);
};

let pageCount = 1; // page counter to track the page number
const allResults = []; // final result array

while (true) {
	await page.waitForSelector("#res"); // Wait for the search results container

	// Extract results from the current page
	const results = await extractResults(page, pageCount);

	allResults.push(results); // push the result

	// Click the "Next" button to go to the next page
	const nextButton = await page.$("#pnnext");
	if (!nextButton) break; // Break if there is no "Next" button

	// if (pageCount === 2) break; // uncomment if you want to stop in a specific page

	await Promise.all([
		nextButton.click(),
		page.waitForNavigation({ waitUntil: "networkidle2" }), // Wait for the navigation to complete
	]);

	pageCount++;
}

fs.writeFile("result.json", JSON.stringify(allResults), (err) => {
	// Checking for errors
	if (err) throw err;

	// Success
	console.log("Done writing result");
});

await browser.close();

// source heading class -> .VuuXrf
// source class -> cite.tjvcx
// heading class -> .LC20lb
// description class -> .VwiC3b > span
