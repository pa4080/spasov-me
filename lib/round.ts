export function roundTo(numString: string | number, to = 3) {
	const num = parseFloat(String(numString));

	if (isNaN(num)) {
		throw new Error("Invalid input. Expected a number in string format.");
	}

	return +(Math.round(num * 100) / 100).toFixed(to);
}
