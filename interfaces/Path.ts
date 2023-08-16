type PathType = {
	public: Record<string, string>;
	private: Record<string, string>;
	api: Record<string, string>;
	deprecated: Record<string, string>;
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
		FILES: "/files",
	},
	api: {
		PAGES: "/api/data/pages",
		POSTS: "/api/data/posts",
		FILES: "/api/files",
	},
	deprecated: {
		PROFILE: "/user-profile",
		POSTS: "/user-posts",
		POST_CREATE: "/post-create",
		POST_UPDATE: "/post-update",
		POST_DELETE: "/post-delete",
	},
};
