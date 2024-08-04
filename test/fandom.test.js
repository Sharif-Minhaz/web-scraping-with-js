const data = {
	faction: "gerFiction(allImages, factionNo)",
	...["weapon", "armor", "helmet", "ranged_weapon"].reduce((acc, name, index) => {
		acc[name] = index;
		return acc;
	}, {}),
};

console.log(data);
