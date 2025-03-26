import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	devtools: { enabled: true },
	debug: true,
	ssr: true,
	modules: [
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxt/ui",
		"@pinia/nuxt",
		"nuxt-echarts",
		"nuxt-twemoji",
		"nuxt-auth-utils",
	],

	css: ["~/assets/css/main.css"],

	ui: {
		prefix: "U",
		theme: {
			colors: ["primary", "secondary", "info", "success", "warning", "error"],
			transitions: true,
		},
	},

	app: {
		head: {
			title: "salaf.uz",
			charset: "utf-16",
			viewport: "width=device-width, initial-scale=1, maximum-scale=1",
			htmlAttrs: {
				lang: "uz",
			},
			link: [{ rel: "icon", type: "image/x-icon", href: "/logo.png" }],
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	build: {
		transpile: ["echarts"],
	},

	echarts: {
		renderer: ["svg", "canvas"],
		charts: ["BarChart", "LineChart", "PieChart"],
	},

	runtimeConfig: {
		public: {
			API_BASE_URL: process.env.API_BASE_URL || "http://localhost:7000/api/v1",
		},
	},

	plugins: [
		{ src: "~/plugins/axios.js" }, // Runs on both client and server
		{ src: "~/plugins/echarts.js", mode: "client" }, // Client-only
	],

	compatibilityDate: "2025-03-21",
});
