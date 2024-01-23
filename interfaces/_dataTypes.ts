export const data = {
	country_list: ["bulgaria"],
	city_list: ["sofia", "pazardjik", "yambol", "plovdiv"],
	aboutEntry_type_list: ["businessCard", "resume", "employment", "education", "spokenLanguages"],
	tag_type_list: [
		"informationTechnologies",
		"mechanicalEngineering",
		"officeApplications",
		"system",
		"skills",
	],
} as const;

export const countryTuple = data.country_list;
export const cityTuple = data.city_list;
export const aboutEntryTuple = data.aboutEntry_type_list;
export const tagTuple = data.tag_type_list;

export type DataTuples = (typeof data)[keyof typeof data];

export type CountryType = (typeof data.country_list)[number];
export type CityType = (typeof data.city_list)[number];
export type AboutEntryType = (typeof data.aboutEntry_type_list)[number];
export type TagType = (typeof data.tag_type_list)[number];
