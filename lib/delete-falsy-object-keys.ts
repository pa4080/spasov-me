/**
 * Delete falsy keys is used to sanitize data objects for mongo-db.
 * If some keys doesn't exist in the form data (data object) we delete them
 * thus they will not be sent to the database when the document is created,
 * or will be deleted from the database when the document is updated.
 *
 * This is used for optional keys in the document schema.
 *
 * The function accepts "object" and optionally an array
 * of keys, which will be deleted if they are falsy,
 * otherwise all falsy keys will be deleted.
 */
export default function deleteFalsyKeys<T extends object, K extends keyof T>(obj: T, keys?: K[]) {
	if (keys && keys.length > 0) {
		for (const key of keys) {
			if (
				obj[key] === null ||
				obj[key] === undefined ||
				obj[key] === "undefined" ||
				obj[key] === "null" ||
				obj[key] === ""
			) {
				delete obj[key];
			}

			// isArray, empty or have one falsy key
			if (obj[key] && Array.isArray(obj[key])) {
				const arr = obj[key] as string[];

				if (arr.length === 0 || (arr.length === 1 && (arr[0] === "" || arr[0] === undefined))) {
					delete obj[key];
				}
			}
		}

		return obj;
	}

	for (const key in obj) {
		if (
			obj[key] === null ||
			obj[key] === undefined ||
			obj[key] === "undefined" ||
			obj[key] === "null" ||
			obj[key] === ""
		) {
			delete obj[key];
		}

		// isArray, empty or have one falsy key
		if (obj[key] && Array.isArray(obj[key])) {
			const arr = obj[key] as string[];

			if (arr.length === 0 || (arr.length === 1 && (arr[0] === "" || arr[0] === undefined))) {
				delete obj[key];
			}
		}
	}

	return obj;
}
