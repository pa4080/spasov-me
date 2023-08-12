type PathType = {
	[key: string]: { [key: string]: string };
};

export const Path: PathType = {
	public: {
		HOME: "/",
		PORTFOLIO: "/portfolio",
		CV: "/curriculum-vitae",
		BLOG: "/blog",
		CONTACT: "/contact",
	},
	private: {
		FILES: "/manage-files",
	},
	api: {
		POSTS: "/api/data/posts",
		PAGES: "/api/data/pages",
	},
	deprecated: {
		PROFILE: "/user-profile",
		POSTS: "/user-posts",
		POST_CREATE: "/post-create",
		POST_UPDATE: "/post-update",
		POST_DELETE: "/post-delete",
	},
};
