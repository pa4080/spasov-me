import slugify from "slugify";

export const sanitizeHtmlTagIdOrClassName = (str: string) =>
  str
    ? slugify(str.replace(/\./g, "-"), {
        lower: true,
        remove: /[*+~()'"!:@]/g,
        locale: "en",
      })
    : str;
