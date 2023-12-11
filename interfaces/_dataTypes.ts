export const data = {
	country_list: ["bulgaria"],
	city_list: ["sofia", "pazardjik", "yambol"],
	aboutEntry_type_list: ["employment", "resume", "education", "portfolio"],
} as const;

export const countryTuple = data.country_list;
export const cityTuple = data.city_list;
export const aboutEntryTuple = data.aboutEntry_type_list;

export type DataTuples = (typeof data)[keyof typeof data];

export type CountryItem = (typeof data.country_list)[number];
export type CityItem = (typeof data.city_list)[number];
export type AboutEntryItem = (typeof data.aboutEntry_type_list)[number];
