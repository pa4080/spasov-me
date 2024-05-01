module.exports = {
	plugins: {
		"postcss-import": {},
		tailwindcss: {},
		autoprefixer: {},
		"postcss-flexbugs-fixes": {},
		...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
	},
};
