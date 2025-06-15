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
  lab_entry: {
    type_list: ["application", "database", "service", "site"],
    visibility: ["private", "public"],
    property: ["own", "client", "shared", "third-party"],
    host: [
      "vps",
      "vps-docker",
      "vps-linux",
      "vps-linux-docker",
      "linux",
      "linux-docker",
      "docker",
      "self-hosted",
      "self-hosted-docker",
      "pve",
      "pve-vm",
      "pve-container",
      "aws",
      "cloudflare",
      "third-party",
    ],
  },
} as const;

export const countryTuple = data.country_name_list;
export const cityTuple = data.city_name_list;
export const tagTuple = data.tag_type_list;
export const aboutEntryTuple = data.about_type_list;
export const projectTuple = data.project_type_list;
export const postTuple = data.post_type_list;

export const labEntryTuple = data.lab_entry.type_list;
export const labEntryVisibilityTuple = data.lab_entry.visibility;
export const labEntryPropertyTuple = data.lab_entry.property;
export const labEntryHostTuple = data.lab_entry.host;

export const unitedLabEntryTuple = [
  ...labEntryTuple,
  ...labEntryVisibilityTuple,
  ...labEntryHostTuple,
];
export const unitedDataEntriesTuple = [
  ...aboutEntryTuple,
  ...projectTuple,
  ...postTuple,
  ...unitedLabEntryTuple,
];

export type DataTuples = (typeof data)[keyof typeof data];

export type CountryType = (typeof data.country_name_list)[number];
export type CityType = (typeof data.city_name_list)[number];
export type TagType = (typeof data.tag_type_list)[number];
export type AboutEntryType = (typeof data.about_type_list)[number];
export type ProjectType = (typeof data.project_type_list)[number];
export type PostType = (typeof data.post_type_list)[number];

export type LabEntryType = (typeof data.lab_entry.type_list)[number];
export type LabEntryVisibilityType = (typeof data.lab_entry.visibility)[number];
export type LabEntryPropertyType = (typeof data.lab_entry.property)[number];
export type LabEntryHostType = (typeof data.lab_entry.host)[number];

export type UnitedLabEntryType = (typeof unitedLabEntryTuple)[number];
export type UnitedDataEntriesType = (typeof unitedDataEntriesTuple)[number];

export type ModelType =
  | "AboutEntry"
  | "PageCard"
  | "Post"
  | "Project"
  | "File"
  | "Tag"
  | "User"
  | "LabEntry";

export interface AttachedToDocument {
  modelType: ModelType;
  title: string;
  _id: string;
}

// See @/next.config.js
export const nextConfigCDNSource =
  "/:all*(png|jpg|jpeg|svg|webp|gif|jfif|avif|pdf|pptx|xlsx|csv|txt|docx|webm|mkv|avi|mp4|eot|ttf|woff|woff2)";

export const regexFilesAll =
  /\.(png|jpg|jpeg|svg|webp|gif|jfif|avif|bmp|pdf|pptx|xlsx|csv|txt|docx)$/;
export const regexFilesImages = /\.(png|jpg|jpeg|svg|webp|gif|jfif|avif|bmp)$/;

export type FilesImagesExtensions =
  | "png"
  | "jpg"
  | "jpeg"
  | "svg"
  | "webp"
  | "gif"
  | "jfif"
  | "avif";
