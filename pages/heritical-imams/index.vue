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
const selectedImam = ref(null);

// Form data
const newImam = ref({
	name: "",
	fullName: "",
	bio: "",
	image: "",
	type: false, // false for heretical imams
});

// Table configuration
const tableColumns = [
	{ key: "image", label: "Rasm" },
	{ key: "name", label: "Taxallus" },
	{ key: "fullName", label: "To'liq ismi" },
];

// Computed properties
const heriticalImams = computed(() => {
	return scholarsStore.getHereticalImams();
});

// Methods
const handleAddImam = () => {
	if (!newImam.value.name.trim() || !newImam.value.fullName.trim()) return;

	scholarsStore.createScholar({
		...newImam.value,
		type: false, // Ensure it's a heretical imam
	});

	resetForm();
	isAddModalOpen.value = false;
};

const resetForm = () => {
	newImam.value = {
		name: "",
		fullName: "",
		bio: "",
		image: "",
		type: false,
	};
};

const handleRowClick = (imam) => {
	// Navigate to heritical imam detail page
	navigateTo(`/heritical-imams/${imam.id}`);
};

const openDeleteModal = (imam) => {
	selectedImam.value = imam;
	isDeleteModalOpen.value = true;
};

const handleDeleteImam = () => {
	if (!selectedImam.value) return;

	scholarsStore.deleteScholar(selectedImam.value.id);
	isDeleteModalOpen.value = false;
	selectedImam.value = null;
};
</script>

<template>
	<div class="p-2">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Zalolatchi imomlar</h1>
			<button
				@click="isAddModalOpen = true"
				class="btn btn-primary flex items-center gap-2">
				<Icon name="heroicons:plus" size="20" />
				Yangi imam
			</button>
		</div>

		<!-- Heretical Imams Table -->
		<div class="card">
			<WidgetsTable
				:columns="tableColumns"
				:data="heriticalImams"
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
				v-if="heriticalImams.length === 0"
				class="text-center py-10 text-text-secondary">
				Zalolatchi imomlar topilmadi
			</div>
		</div>

		<!-- Add Heretical Imam Modal -->
		<WidgetsModal
			v-model="isAddModalOpen"
			title="Yangi zalolatchi imam qo'shish">
			<form @submit.prevent="handleAddImam" class="space-y-4">
				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium">Taxallus</label>
					<input
						id="name"
						v-model="newImam.name"
						type="text"
						required
						placeholder="Taxallus"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="fullName" class="block text-sm font-medium"
						>To'liq ismi</label
					>
					<input
						id="fullName"
						v-model="newImam.fullName"
						type="text"
						required
						placeholder="To'liq ismi"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="bio" class="block text-sm font-medium">Biografiya</label>
					<textarea
						id="bio"
						v-model="newImam.bio"
						placeholder="Biografiya..."
						rows="3"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="image" class="block text-sm font-medium">Rasm URL</label>
					<input
						id="image"
						v-model="newImam.image"
						type="text"
						placeholder="https://example.com/image.jpg"
						class="input" />
				</div>
			</form>

			<template #actions>
				<button @click="handleAddImam" class="btn btn-primary">Saqlash</button>
			</template>
		</WidgetsModal>

		<!-- Delete Confirmation Modal -->
		<WidgetsModal
			v-if="selectedImam"
			v-model="isDeleteModalOpen"
			title="Imam ma'lumotlarini o'chirish">
			<p>
				Siz rostdan ham "{{ selectedImam.name }}" imam ma'lumotlarini
				o'chirmoqchimisiz?
			</p>
			<p class="text-sm text-text-secondary mt-1">
				Bu amal bilan bog'liq barcha maqolalar ham o'chiriladi.
			</p>

			<template #actions>
				<button
					@click="handleDeleteImam"
					class="btn bg-error text-white hover:bg-error/90">
					O'chirish
				</button>
			</template>
		</WidgetsModal>
	</div>
</template>
