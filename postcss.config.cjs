/**
 * For more configuration features:
 * @see https://tailwindcss.com/docs/using-with-preprocessors
 * @see https://nextjs.org/docs/pages/building-your-application/configuring/post-css
 */
const config = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
    "postcss-flexbugs-fixes": {},
  },
};

module.exports = config;
