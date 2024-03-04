export const Route = {
	public: {
		HOME: {
			inFeed: false,
			inNavbar: true,
			name: "home",
			uri: "/",
			visible: true,
		},
		PORTFOLIO: {
			inFeed: true,
			inNavbar: true,
			name: "portfolio",
			uri: "/portfolio",
			visible: true,
		},
		ABOUT: {
			inFeed: true,
			inNavbar: true,
			name: "about",
			uri: "/about",
			visible: true,
		},

		BLOG: {
			inFeed: true,
			inNavbar: true,
			name: "blog",
			uri: "/blog",
			visible: false,
		},
		SERVICES: {
			inFeed: true,
			inNavbar: true,
			name: "services",
			uri: "/services",
			visible: false,
		},
		CONTACT: {
			inFeed: true,
			inNavbar: true,
			name: "contact",
			uri: "/contact",
			visible: true,
		},
	},
	admin: {
		PAGES: "/admin/pages",
		ABOUT: "/admin/about",
		PORTFOLIO: "/admin/portfolio",
		BLOG: "/admin/blog",
		TAGS: "/admin/tags",
		FILES: "/admin/files",
		THEME: "/admin/theme",
		BLOB: "/admin/blob",
	},
	api: {
		PAGES: "/api/data/pages",
		POSTS: "/api/data/posts",
		ABOUT: "/api/data/about",
		FILES: "/api/files",
		BLOB: "/api/blob",
	},
	assets: {
		MIME_TYPE: "/assets/images/mime-type-icons",
		IMAGES: "/assets/images",
		IMAGE_PLACEHOLDER: "/assets/images/image-placeholder.webp",
	},
};
