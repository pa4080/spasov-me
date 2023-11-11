/**
 * @usage
 * 		const services = messages.Services.items;
 * 		const pick4Services = fourRandomItems({ items: services });
 */

export function arrayRandomItems<T>({ items, count = 4 }: { items: T[]; count: number }) {
	const fourNumbers: T[] = [];
	const actualCount = Math.min(count, items.length);

	while (fourNumbers.length < actualCount) {
		const randomIndex = Math.floor(Math.random() * items.length);

		if (fourNumbers.includes(items[randomIndex])) {
			continue;
		}

		fourNumbers.push(items[randomIndex]);
	}

	return fourNumbers;
}
