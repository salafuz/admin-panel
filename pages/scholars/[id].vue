<script setup>
import { ref, computed } from "vue";
import { useScholarsStore } from "~/stores/scholars";
import { usePostsStore } from "~/stores/posts";
import { getImageUrl } from "../../utils/getFakeImage";

const scholarsStore = useScholarsStore();
const postsStore = usePostsStore();

// Modal states
const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedScholar = ref(null);

// Form data
const newScholar = ref({
	name: "",
	fullName: "",
	bio: "",
	image: "",
	type: true, // true for scholars
});

// Table configuration
const tableColumns = [
	{ key: "image", label: "Rasm" },
	{ key: "name", label: "Taxallus" },
	{ key: "fullName", label: "To'liq ismi" },
];

// Computed properties
const scholars = computed(() => {
	return scholarsStore.getScholars();
});

// Methods
const handleAddScholar = () => {
	if (!newScholar.value.name.trim() || !newScholar.value.fullName.trim())
		return;

	scholarsStore.createScholar({
		...newScholar.value,
		type: true, // Ensure it's a scholar
	});

	resetForm();
	isAddModalOpen.value = false;
};

const resetForm = () => {
	newScholar.value = {
		name: "",
		fullName: "",
		bio: "",
		image: "",
		type: true,
	};
};

const handleRowClick = (scholar) => {
	// Navigate to scholar detail page
	navigateTo(`/scholars/${scholar.id}`);
};

const openDeleteModal = (scholar) => {
	selectedScholar.value = scholar;
	isDeleteModalOpen.value = true;
};

const handleDeleteScholar = () => {
	if (!selectedScholar.value) return;

	scholarsStore.deleteScholar(selectedScholar.value.id);
	isDeleteModalOpen.value = false;
	selectedScholar.value = null;
};

</script>

<template>
	<div class="p-6">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Ulamolar</h1>
			<button
				@click="isAddModalOpen = true"
				class="btn btn-primary flex items-center gap-2">
				<Icon name="heroicons:plus" size="20" />
				Yangi ustoz
			</button>
		</div>

		<!-- Scholars Table -->
		<div class="card">
			<WidgetsTable
				:columns="tableColumns"
				:data="scholars"
				:has-actions="true"
				@row-click="handleRowClick">
				<template #image="{ row }">
					<div class="flex items-center">
						<img
							:src="getImageUrl(row.image)"
							:alt="row.name"
							class="w-10 h-10 rounded-full object-cover" />
					</div>
				</template>
				<template #actions="{ row }">
					<div class="flex gap-2">
						<button
							@click.stop="handleRowClick(row)"
							class="p-2 text-primary hover:bg-primary/10 rounded">
							<Icon name="heroicons:eye" size="18" />
						</button>
						<button
							@click.stop="openDeleteModal(row)"
							class="p-2 text-error hover:bg-error/10 rounded">
							<Icon name="heroicons:trash" size="18" />
						</button>
					</div>
				</template>
			</WidgetsTable>

			<div
				v-if="scholars.length === 0"
				class="text-center py-10 text-text-secondary">
				Ulamolar topilmadi
			</div>
		</div>

		<!-- Add Scholar Modal -->
		<WidgetsModal v-model="isAddModalOpen" title="Yangi ustoz qo'shish">
			<form @submit.prevent="handleAddScholar" class="space-y-4">
				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium">Taxallus</label>
					<input
						id="name"
						v-model="newScholar.name"
						type="text"
						required
						placeholder="Shayx Alboniy"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="fullName" class="block text-sm font-medium"
						>To'liq ismi</label
					>
					<input
						id="fullName"
						v-model="newScholar.fullName"
						type="text"
						required
						placeholder="Muhammad Nosiruddin Alboniy"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="bio" class="block text-sm font-medium">Biografiya</label>
					<textarea
						id="bio"
						v-model="newScholar.bio"
						placeholder="Alboniy haqida qisqacha ma'lumot..."
						rows="3"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="image" class="block text-sm font-medium">Rasm URL</label>
					<input
						id="image"
						v-model="newScholar.image"
						type="text"
						placeholder="https://example.com/image.jpg"
						class="input" />
				</div>
			</form>

			<template #actions>
				<button @click="handleAddScholar" class="btn btn-primary">
					Saqlash
				</button>
			</template>
		</WidgetsModal>

		<!-- Delete Confirmation Modal -->
		<WidgetsModal
			v-if="selectedScholar"
			v-model="isDeleteModalOpen"
			title="Ustoz ma'lumotlarini o'chirish">
			<p>
				Siz rostdan ham "{{ selectedScholar.name }}" ustoz ma'lumotlarini
				o'chirmoqchimisiz?
			</p>
			<p class="text-sm text-text-secondary mt-1">
				Bu amal bilan bog'liq barcha maqolalar ham o'chiriladi.
			</p>

			<template #actions>
				<button
					@click="handleDeleteScholar"
					class="btn bg-error text-white hover:bg-error/90">
					O'chirish
				</button>
			</template>
		</WidgetsModal>
	</div>
</template>
