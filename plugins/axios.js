// plugins/axios.js
import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	// Set up axios instance
	const api = axios.create({
		baseURL: config.public.apiBase || "http://localhost:7000/api/v1",
		headers: {
			"Content-Type": "application/json",
		},
	});

	// Attach the axios instance to the Nuxt app for global use
	nuxtApp.provide("api", api);
});
