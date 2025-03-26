import { useAuthStore } from "~/stores/auth";

class ApiService {
	constructor() {
		this.baseURL = process.env.NUXT_PUBLIC_API_BASE;
	}

	getHeaders() {
		const headers = {
			"Content-Type": "application/json",
		};

		const auth = useAuthStore();
		if (auth.token) {
			headers["Authorization"] = `Bearer ${auth.token}`;
		}

		return headers;
	}

	async get(url, config = {}) {
		try {
			const response = await $fetch(this.baseURL + url, {
				method: "GET",
				headers: this.getHeaders(),
				...config,
			});
			return response;
		} catch (error) {
			this.handleError(error);
		}
	}

	async post(url, data, config = {}) {
		try {
			const response = await $fetch(this.baseURL + url, {
				method: "POST",
				headers: this.getHeaders(),
				body: data,
				...config,
			});
			return response;
		} catch (error) {
			this.handleError(error);
		}
	}

	async put(url, data, config = {}) {
		try {
			const response = await $fetch(this.baseURL + url, {
				method: "PUT",
				headers: this.getHeaders(),
				body: data,
				...config,
			});
			return response;
		} catch (error) {
			this.handleError(error);
		}
	}

	async delete(url, config = {}) {
		try {
			const response = await $fetch(this.baseURL + url, {
				method: "DELETE",
				headers: this.getHeaders(),
				...config,
			});
			return response;
		} catch (error) {
			this.handleError(error);
		}
	}

	handleError(error) {
		const auth = useAuthStore();

		if (error.response?.status === 401) {
			auth.logout();
			throw new Error("Unauthorized access");
		}

		throw error;
	}
}

// Create a singleton instance
export default new ApiService();
