import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { useNuxtApp } from "#app";

export const useImagesStore = defineStore("images", () => {
	// 🗃️ State: Images list and loading/error states
	const state = reactive({
		data: [],
		deleted: [],
		single: null,
		loading: true,
		error: null,
	});

	// Accessing the api instance via useNuxtApp
	const { $api } = useNuxtApp();

	// 🌐 Fetch all images
	const fetchImages = async (query = {}) => {
		state.loading = true;
		try {
			const response = await $api.get("/images", { params: query });
			state.data = response.data;
		} catch (err) {
			state.error = err.response?.data?.message || "Failed to fetch images.";
		} finally {
			state.loading = false;
		}
	};

	// 🌐 Upload an image
	const uploadImage = async (formData) => {
		try {
			const response = await $api.post("/images/upload", formData);
			state.data.push(response.data);
		} catch (err) {
			state.error = err.response?.data?.message || "Failed to upload image.";
		}
	};

	// 🌐 Fetch single image by ID
	const fetchImageById = async (id) => {
		try {
			const response = await $api.get(`/images/${id}`);
			state.single = response.data;
		} catch (err) {
			state.error = err.response?.data?.message || "Failed to fetch image.";
		}
	};

	// 🌐 Delete an image by ID
	const deleteImage = async (id) => {
		try {
			await $api.delete(`/images/${id}`);
			state.data = state.data.filter((image) => image.id !== id);
			state.deleted.push(id);
		} catch (err) {
			state.error = err.response?.data?.message || "Failed to delete image.";
		}
	};

	// 🌐 Preview an image by name
	const previewImage = (imageName) => {
		const {
			public: { API_BASE_URL },
		} = useRuntimeConfig(); // Access API URL from runtime config
		return `${API_BASE_URL}/images/preview/${imageName}`;
	};

	return {
		DATA: computed(() => state.data),
		DELETED: computed(() => state.deleted),
		SINGLE: computed(() => state.single),
		LOADING: computed(() => state.loading),
		ERROR: computed(() => state.error),
		fetchImages,
		uploadImage,
		fetchImageById,
		deleteImage,
		previewImage,
	};
});
