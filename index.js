import { dinoDataScrapService } from "./services/dinoDataScrapService.js";
import { fandomWikiScrapService } from "./services/fandomWikiScrapService.js";
import { webSearchService } from "./services/webSearchService.js";

(async () => {
	// 1. Web search based scrapper, collect the search result's information
	// await webSearchService("https://google.com", "Shadow fight arena");
	// 2. Collect SF3 all set's data from fandom.com
	// await fandomWikiScrapService("https://shadowfight.fandom.com/wiki/Equipment_Sets_(SF3)");
	// 3. Gain dinosaur data
	await dinoDataScrapService("https://developer-rana-sharif.github.io/age-of-dino/index.html");
})();
