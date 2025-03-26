<script setup>
import { ref, computed } from "vue";
import { useCategoriesStore } from "~/stores/categories";
import { usePostsStore } from "~/stores/posts";
import { formatDate } from "~/utils/formatDate";

const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();

// Modal states
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

// Form data
const newCategory = ref({ name: "" });
const selectedCategory = ref(null);

// Table configuration
const tableColumns = [
	{ key: "name", label: "Nomi" },
	{ key: "postsCount", label: "Maqolalar soni" },
	{ key: "created_at", label: "Yaratilgan vaqti" },
];

// Computed properties with post counts
const categoriesWithPostCounts = computed(() => {
	return categoriesStore.categories.map((category) => {
		const postsCount = postsStore.posts.filter(
			(post) => post.category_id === category.id
		).length;
		return {
			...category,
			postsCount,
		};
	});
});

// Methods
const handleAddCategory = () => {
	if (!newCategory.value.name.trim()) return;

	categoriesStore.createCategory(newCategory.value.name);
	newCategory.value.name = "";
	isAddModalOpen.value = false;
};

const openEditModal = (category) => {
	selectedCategory.value = { ...category };
	isEditModalOpen.value = true;
};

const handleEditCategory = () => {
	if (!selectedCategory.value || !selectedCategory.value.name.trim()) return;

	categoriesStore.updateCategory(
		selectedCategory.value.id,
		selectedCategory.value.name
	);
	isEditModalOpen.value = false;
	selectedCategory.value = null;
};

const openDeleteModal = (category) => {
	selectedCategory.value = category;
	isDeleteModalOpen.value = true;
};

const handleDeleteCategory = () => {
	if (!selectedCategory.value) return;

	categoriesStore.deleteCategory(selectedCategory.value.id);
	isDeleteModalOpen.value = false;
	selectedCategory.value = null;
};
</script>

<template>
	<div class="p-2">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Kategoriyalar</h1>
			<button
				@click="isAddModalOpen = true"
				class="btn btn-primary flex items-center gap-2">
				<Icon name="heroicons:plus" size="20" />
				Yangi kategoriya
			</button>
		</div>

		<!-- Categories Table -->
		<div class="card">
			<WidgetsTable
				:columns="tableColumns"
				:data="categoriesWithPostCounts"
				:has-actions="true">
				<template #created_at="{ row }">
					{{ formatDate(row.created_at) }}
				</template>
				<template #actions="{ row }">
					<div class="flex gap-2">
						<button
							@click.stop="openEditModal(row)"
							class="p-2 text-primary hover:bg-primary/10 rounded">
							<Icon name="heroicons:pencil" size="18" />
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
				v-if="categoriesStore.categories.length === 0"
				class="text-center py-10 text-text-secondary">
				Kategoriyalar topilmadi
			</div>
		</div>

		<!-- Add Category Modal -->
		<WidgetsModal v-model="isAddModalOpen" title="Yangi kategoriya qo'shish">
			<form @submit.prevent="handleAddCategory" class="space-y-4">
				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium">Nomi</label>
					<input
						id="name"
						v-model="newCategory.name"
						type="text"
						required
						placeholder="Kategoriya nomi"
						class="input" />
				</div>
			</form>

			<template #actions>
				<button @click="handleAddCategory" class="btn btn-primary">
					Saqlash
				</button>
			</template>
		</WidgetsModal>

		<!-- Edit Category Modal -->
		<WidgetsModal
			v-if="selectedCategory"
			v-model="isEditModalOpen"
			title="Kategoriyani tahrirlash">
			<form @submit.prevent="handleEditCategory" class="space-y-4">
				<div class="space-y-2">
					<label for="edit-name" class="block text-sm font-medium">Nomi</label>
					<input
						id="edit-name"
						v-model="selectedCategory.name"
						type="text"
						required
						placeholder="Kategoriya nomi"
						class="input" />
				</div>
			</form>

			<template #actions>
				<button @click="handleEditCategory" class="btn btn-primary">
					Saqlash
				</button>
			</template>
		</WidgetsModal>

		<!-- Delete Confirmation Modal -->
		<WidgetsModal
			v-if="selectedCategory"
			v-model="isDeleteModalOpen"
			title="Kategoriyani o'chirish">
			<p>
				Siz rostdan ham "{{ selectedCategory.name }}" kategoriyasini
				o'chirmoqchimisiz?
			</p>
			<p class="text-sm text-text-secondary mt-1">
				Bu amal bilan bog'liq barcha maqolalar kategoriyasiz qoladi.
			</p>

			<template #actions>
				<button
					@click="handleDeleteCategory"
					class="btn bg-error text-white hover:bg-error/90">
					O'chirish
				</button>
			</template>
		</WidgetsModal>
	</div>
</template>
