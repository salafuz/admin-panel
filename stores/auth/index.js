import { defineStore } from "pinia";
import { useCookie, useNuxtApp } from "nuxt/app";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: null,
		refreshToken: null,
		user: null,
		loading: false,
		error: null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.token,
	},

	actions: {
		async login(credentials) {
			this.loading = true;
			this.error = null;

			const { $api } = useNuxtApp(); // Accessing the axios instance

			try {
				const response = await $api.post("/auth/login", credentials);
				console.log(response);
				const { access_token, refresh_token, user } = response.data;

				this.setAuth({
					access_token,
					refresh_token,
					user,
				});

				return true;
			} catch (err) {
				this.error = err.response?.data?.message || "Xatolik yuz berdi";
				console.log(err);
				return false;
			} finally {
				this.loading = false;
			}
		},

		setAuth({ access_token, refresh_token, user }) {
			this.token = access_token;
			this.refreshToken = refresh_token;
			this.user = user;

			// Set cookies securely
			useCookie("access_token", { sameSite: "strict", secure: true }).value =
				access_token;
			useCookie("refresh_token", { sameSite: "strict", secure: true }).value =
				refresh_token;

			// Set axios Authorization header
			const { $api } = useNuxtApp();
			$api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
		},

		logout() {
			this.token = null;
			this.refreshToken = null;
			this.user = null;

			// Remove cookies
			useCookie("access_token").value = null;
			useCookie("refresh_token").value = null;

			// Remove axios Authorization header
			const { $api } = useNuxtApp();
			delete $api.defaults.headers.common["Authorization"];
		},

		async refreshAccessToken() {
			if (!this.refreshToken) return false;

			const { $api } = useNuxtApp();

			try {
				const response = await $api.post("/auth/refresh", {
					refresh_token: this.refreshToken,
				});

				const { access_token, refresh_token, user } = response.data;

				this.setAuth({
					access_token,
					refresh_token,
					user,
				});

				return true;
			} catch (err) {
				this.logout();
				return false;
			}
		},
	},
});
