export function generateFormDataFromObject(data: Record<string, unknown>) {
	const newFormData = Object.keys(data).reduce((formData, key) => {
		formData.append(key, String(data[key]));

		return formData;
	}, new FormData());

	return newFormData;
}
