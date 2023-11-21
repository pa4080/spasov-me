export const Route = {
	public: {
		HOME: {
			inFeed: false,
			inNavbar: true,
			uri: "/",
			visible: true,
		},
		PORTFOLIO: {
			inFeed: true,
			inNavbar: true,
			uri: "/portfolio",
			visible: false,
		},
		CV: {
			inFeed: true,
			inNavbar: true,
			uri: "/curriculum-vitae",
			visible: true,
		},
		BLOG: {
			inFeed: true,
			inNavbar: true,
			uri: "/blog",
			visible: false,
		},
		SERVICES: {
			inFeed: true,
			inNavbar: true,
			uri: "/services",
			visible: false,
		},
		CONTACT: {
			inFeed: true,
			inNavbar: true,
			uri: "/contact",
			visible: true,
		},
	},
	admin: {
		THEME: "/admin/theme",
		PAGES: "/admin/pages-ssr-attempt",
		PAGES_API: "/admin/pages",
		FILES: "/admin/files",
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
