/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,ts,vue}",
		"./layouts/**/*.{js,ts,vue}",
		"./pages/**/*.{js,ts,vue}",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
		"./app.vue",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
