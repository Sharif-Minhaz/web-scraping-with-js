import fs from "fs";

export function writeResult(result) {
	fs.writeFile(`public/json/result_${Date.now()}.json`, JSON.stringify(result), (err) => {
		// Checking for errors
		if (err) throw err;

		// Success
		console.log("Done writing result");
	});
}
