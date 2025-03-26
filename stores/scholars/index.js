import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

export const useScholarsStore = defineStore("scholars", () => {
	// 🗃️ State: Scholars list, single scholar, deleted scholars, loading, and error states
	const scholars = ref([]);
	const deletedScholars = ref([]);
	const singleScholar = ref(null);
	const loading = ref(false);
	const error = ref(null);

	// Accessing the api instance via useNuxtApp
	const { $api } = useNuxtApp();

	// 🌐 Fetch all scholars with search, filtering, and pagination
	const fetchScholars = async (query = {}) => {
		loading.value = true;
		try {
			const response = await $api.get("/scholars", { params: query });
			scholars.value = response.data;
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to fetch scholars.";
		} finally {
			loading.value = false;
		}
	};

	// 🌐 Fetch all deleted scholars (Admin & Dev Only)
	const fetchDeletedScholars = async () => {
		loading.value = true;
		try {
			const response = await $api.get("/scholars/deleted");
			deletedScholars.value = response.data;
		} catch (err) {
			error.value =
				err.response?.data?.message || "Failed to fetch deleted scholars.";
		} finally {
			loading.value = false;
		}
	};

	// 🔍 Fetch a single scholar by ID
	const fetchScholarById = async (id) => {
		loading.value = true;
		try {
			const response = await $api.get(`/scholars/${id}`);
			singleScholar.value = response.data;
		} catch (err) {
			error.value = err.response?.data?.message || "Scholar not found.";
		} finally {
			loading.value = false;
		}
	};

	// 📝 Create a new scholar profile
	const createScholar = async (scholarData) => {
		loading.value = true;
		try {
			await $api.post("/scholars", scholarData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchScholars();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to create scholar.";
		} finally {
			loading.value = false;
		}
	};

	// ✏️ Update a scholar profile by ID
	const updateScholar = async (id, scholarData) => {
		loading.value = true;
		try {
			await $api.patch(`/scholars/${id}`, scholarData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchScholars();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to update scholar.";
		} finally {
			loading.value = false;
		}
	};

	// 🗑️ Soft delete a scholar profile by ID
	const softDeleteScholar = async (id) => {
		loading.value = true;
		try {
			await $api.delete(`/scholars/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchScholars();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to delete scholar.";
		} finally {
			loading.value = false;
		}
	};

	// ♻️ Restore a deleted scholar profile (Admin & Dev Only)
	const restoreScholar = async (id) => {
		loading.value = true;
		try {
			await $api.put(`/scholars/restore/${id}`, null, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchDeletedScholars();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to restore scholar.";
		} finally {
			loading.value = false;
		}
	};

	// 🚮 Permanently delete a scholar profile (Admin & Dev Only)
	const deleteScholarPermanently = async (id) => {
		loading.value = true;
		try {
			await $api.delete(`/scholars/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			await fetchDeletedScholars();
		} catch (err) {
			error.value = err.response?.data?.message || "Failed to delete scholar.";
		} finally {
			loading.value = false;
		}
	};

	return {
		scholars,
		deletedScholars,
		singleScholar,
		loading,
		error,
		fetchScholars,
		fetchDeletedScholars,
		fetchScholarById,
		createScholar,
		updateScholar,
		softDeleteScholar,
		restoreScholar,
		deleteScholarPermanently,
	};
});
