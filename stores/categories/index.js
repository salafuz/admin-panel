import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

export const useCategoriesStore = defineStore("categories", () => {
	// 🗃️ State: Categories list, single category, loading, and error states
	const categories = ref([]);
	const singleCategory = ref(null);
	const loading = ref(false);
	const error = ref(null);

	// Accessing the api instance via useNuxtApp
	const { $api } = useNuxtApp();

	// 🌐 Fetch all categories
	const fetchCategories = async () => {
		loading.value = true;
		try {
			const response = await $api.get("/categories");
			categories.value = response.data;
		} catch (err) {
			error.value =
				err.response?.data?.message || "Failed to fetch categories.";
		} finally {
			loading.value = false;
		}
	};

	// 📌 Fetch a category by ID
	const fetchCategoryById = async (id) => {
		loading.value = true;
		try {
			const response = await $api.get(`/categories/${id}`);
			singleCategory.value = response.data;
		} catch (err) {
			error.value = err.response?.data?.message || "Category not found.";
		} finally {
			loading.value = false;
		}
	};

	// 🔍 Fetch a category by name (with related posts)
	const fetchCategoryByName = async (name) => {
		loading.value = true;
		try {
			const response = await $api.get(`/categories/name/${name}`);
			singleCategory.value = response.data;
		} catch (err) {
			error.value = err.response?.data?.message || "Category not found.";
		} finally {
			loading.value = false;
		}
	};

	// 📝 Create a new category
	const createCategory = async (categoryData) => {
		loading.value = true;
		try {
			await $api.post("/categories", categoryData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchCategories();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to create category.";
		} finally {
			loading.value = false;
		}
	};

	// ✏️ Update a category by ID
	const updateCategory = async (id, categoryData) => {
		loading.value = true;
		try {
			await $api.put(`/categories/${id}`, categoryData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchCategories();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to update category.";
		} finally {
			loading.value = false;
		}
	};

	// ❌ Delete a category by ID
	const deleteCategory = async (id) => {
		loading.value = true;
		try {
			await $api.delete(`/categories/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchCategories();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to delete category.";
		} finally {
			loading.value = false;
		}
	};

	return {
		categories,
		singleCategory,
		loading,
		error,
		fetchCategories,
		fetchCategoryById,
		fetchCategoryByName,
		createCategory,
		updateCategory,
		deleteCategory,
	};
});
