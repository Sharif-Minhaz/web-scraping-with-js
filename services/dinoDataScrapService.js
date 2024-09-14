import puppeteer from "puppeteer";
import { writeResult } from "../utils/writeResult.js";

export async function dinoDataScrapService(url) {
	const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
	const page = await browser.newPage();
	await page.goto(url);

	// Wait for the page to load the desired elements
	await page.waitForSelector("a.active");

	// Use page.evaluate() to run DOM manipulation within the browser context
	const result = await page.evaluate(() => {
		// Use document.querySelectorAll in the browser's context to scrape the data
		const resultElements = document.querySelectorAll("section");

		// Extract text or other data from the DOM elements
		const data = [];
		resultElements.forEach((element) => {
			const name = element.querySelector("h2")?.textContent || "";
			const description = element.querySelector("p")?.textContent || "";
			const image = element.querySelector("img")?.src || "";
			data.push({
				name,
				description,
				image,
			});
		});
		return data;
	});

	// Log or process the scraped data
	writeResult(result, "dino");

	// Close the browser
	await browser.close();
}
