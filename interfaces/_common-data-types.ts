export const data = {
	country_name_list: ["bulgaria"],
	city_name_list: ["sofia", "pazardjik", "yambol", "plovdiv"],
	about_type_list: ["businessCard", "resume", "employment", "education", "spokenLanguages"],
	tag_type_list: [
		"informationTechnologies",
		"mechanicalEngineering",
		"officeApplications",
		"system",
		"skills",
	],
} as const;

export const countryTuple = data.country_name_list;
export const cityTuple = data.city_name_list;
export const aboutEntryTuple = data.about_type_list;
export const tagTuple = data.tag_type_list;

export type DataTuples = (typeof data)[keyof typeof data];

export type CountryType = (typeof data.country_name_list)[number];
export type CityType = (typeof data.city_name_list)[number];
export type AboutEntryType = (typeof data.about_type_list)[number];
export type TagType = (typeof data.tag_type_list)[number];

export type ModelType = "About" | "Post" | "Project" | "Page" | "File" | "Tag" | "User";
