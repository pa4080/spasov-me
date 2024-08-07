export const data = {
	country_name_list: ["bulgaria"],
	city_name_list: ["sofia", "pazardjik", "yambol", "plovdiv"],
	tag_type_list: [
		"informationTechnologies",
		"mechanicalEngineering",
		"officeApplications",
		"system",
		"blog",
		"skills",
	],
	about_type_list: ["employment", "businessCard", "resume", "education", "spokenLanguages"],
	project_type_list: [
		"informationTechnologies",
		"mechanicalEngineering",
		"managementConsultancy",
		"education_prj",
		"officeApplications",
	],
	post_type_list: ["blog", "reference", "manual", "note", "lifestyle"],
} as const;

export const countryTuple = data.country_name_list;
export const cityTuple = data.city_name_list;
export const tagTuple = data.tag_type_list;
export const aboutEntryTuple = data.about_type_list;
export const projectTuple = data.project_type_list;
export const postTuple = data.post_type_list;
export const unitedDataEntriesTuple = [...aboutEntryTuple, ...projectTuple, ...postTuple];

export type DataTuples = (typeof data)[keyof typeof data];

export type CountryType = (typeof data.country_name_list)[number];
export type CityType = (typeof data.city_name_list)[number];
export type TagType = (typeof data.tag_type_list)[number];
export type AboutEntryType = (typeof data.about_type_list)[number];
export type ProjectType = (typeof data.project_type_list)[number];
export type PostType = (typeof data.post_type_list)[number];
export type UnitedDataEntriesType = (typeof unitedDataEntriesTuple)[number];

export type ModelType = "AboutEntry" | "PageCard" | "Post" | "Project" | "File" | "Tag" | "User";

export interface AttachedToDocument {
	modelType: ModelType;
	title: string;
	_id: string;
}
