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
		ABOUT: {
			inFeed: true,
			inNavbar: true,
			uri: "/about",
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
		PAGES: "/admin/pages",
		ABOUT: "/admin/about",
		THEME: "/admin/theme",
		FILES: "/admin/files",
		TAGS: "/admin/tags",
		BLOB: "/admin/blob",
	},
	api: {
		PAGES: "/api/data/pages",
		POSTS: "/api/data/posts",
		ABOUT_ENTRY: "/api/data/about-entries",
		FILES: "/api/files",
		BLOB: "/api/blob",
	},
	assets: {
		MIME_TYPE: "/assets/images/mime-type-icons",
		IMAGES: "/assets/images",
		IMAGE_PLACEHOLDER: "/assets/images/image-placeholder.webp",
	},
};
