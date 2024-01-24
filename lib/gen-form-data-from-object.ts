export function generateFormDataFromObject(data: Record<string, unknown>) {
	const newFormData = Object.keys(data).reduce((formData, key) => {
		if (typeof data[key] === "string") {
			formData.append(key, data[key] as string);
		} else if (data[key] instanceof Blob) {
			formData.append(key, data[key] as Blob);
		} else if (typeof data[key] === "object") {
			// if (Array.isArray(data[key]) || data[key] instanceof Date) {
			if (data[key] instanceof Date) {
				formData.append(key, String(data[key]));
			} else {
				formData.append(key, JSON.stringify(data[key]));
			}
		} else {
			formData.append(key, String(data[key]));
		}

		return formData;
	}, new FormData());

	return newFormData;
}
