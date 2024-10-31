/**
 * TODO: We can have conditions only for Blob and Date, and stringify the rest...
 * In this case we must refactor the "_<type>.actions.ts" files to use "JSON.parse()"
 * This will be much unified approach.
 */
export function generateFormDataFromObject(data: Record<string, unknown>) {
  const newFormData = Object.keys(data).reduce((formData, key) => {
    if (typeof data[key] === "string") {
      formData.append(key, data[key]);
    } else if (data[key] instanceof Blob) {
      formData.append(key, data[key]);
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
