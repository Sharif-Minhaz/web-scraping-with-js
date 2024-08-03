import { webSearchService } from "./services/webSearchService.js";

(async () => {
	await webSearchService("https://google.com", "Shadow fight arena");
})();
