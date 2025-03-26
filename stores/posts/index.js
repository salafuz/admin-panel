import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import { useNuxtApp } from "#app";

export const usePostsStore = defineStore("posts", () => {
	// 🗃️ State: Posts list and pagination
	const state = reactive({
		data: [],
		deleted: [],
		single: null,
		loading: true,
		error: null,
		page: 1, // ✅ Track current page
		limit: 10, // ✅ Track per-page count
		totalPosts: 0, // ✅ Track total posts
	});

	// Accessing API instance via Nuxt
	const { $api } = useNuxtApp();

	// 🌐 Fetch all posts with pagination, search, and sorting
	const fetchPosts = async (query = {}) => {
		state.loading = true;
		try {
			const response = await $api.get("/posts", {
				params: {
					limit: state.limit,
					page: state.page, // ✅ Send pagination params
					...query, // Merge other filters (search, status, etc.)
				},
			});
			state.data = response.data;
			console.log(state.data);
			state.totalPosts = response.data.length;
		} catch (err) {
			state.error = err.response?.data?.message || "Failed to fetch posts.";
		} finally {
			state.loading = false;
		}
	};

	// 📝 Change current page and fetch data
	const changePage = (page) => {
		state.page = page;
		fetchPosts();
	};

	// 📝 Change items per page and fetch data
	const changePerPage = (count) => {
		state.limit = count;
		fetchPosts();
	};

	return {
		DATA: computed(() => state.data),
		DELETED: computed(() => state.deleted),
		SINGLE: computed(() => state.single),
		LOADING: computed(() => state.loading),
		ERROR: computed(() => state.error),
		CURRENT_PAGE: computed(() => state.page),
		PER_PAGE: computed(() => state.limit),
		TOTAL_POSTS: computed(() => state.totalPosts),

		fetchPosts,
		changePage, // ✅ Exposed function
		changePerPage, // ✅ Exposed function
	};
});
