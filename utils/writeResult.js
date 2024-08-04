import fs from "fs";

export function writeResult(result, result_for) {
	fs.writeFile(
		`public/json/${result_for}_result_${Date.now()}.json`,
		JSON.stringify(result),
		(err) => {
			// Checking for errors
			if (err) throw err;

			// Success
			console.log("Done writing result for", result_for);
		}
	);
}
