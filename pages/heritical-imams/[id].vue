<script setup>
import { ref, computed, onMounted } from "vue";
import { useScholarsStore } from "~/stores/scholars";
import { usePostsStore } from "~/stores/posts";
import { formatDate } from "~/utils/formatDate";
import { getImageUrl } from "../../utils/getFakeImage";

const route = useRoute();
const router = useRouter();
const scholarsStore = useScholarsStore();
const postsStore = usePostsStore();

// States
const imam = ref(null);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editedImam = ref(null);

// Load imam data on mount
onMounted(() => {
	const id = parseInt(route.params.id);
	const foundImam = scholarsStore.getScholarById(id);

	if (foundImam && !foundImam.type) {
		// Ensure it's a heretical imam
		imam.value = foundImam;
	} else {
		// Handle not found or if it's not a heretical imam
		router.push("/heritical-imams");
	}
});

// Computed properties
const imamPosts = computed(() => {
	if (!imam.value) return [];

	return postsStore.posts.filter((post) => post.author_id === imam.value?.id);
});

// Methods
const openEditModal = () => {
	if (!imam.value) return;
	editedImam.value = { ...imam.value };
	isEditModalOpen.value = true;
};

const handleEditImam = () => {
	if (!editedImam.value) return;

	// Ensure type remains false for heretical imams
	editedImam.value.type = false;

	scholarsStore.updateScholar(editedImam.value.id, editedImam.value);
	const updatedImam = scholarsStore.getScholarById(editedImam.value.id);
	if (updatedImam) {
		imam.value = updatedImam;
	}
	isEditModalOpen.value = false;
};

const openDeleteModal = () => {
	isDeleteModalOpen.value = true;
};

const handleDeleteImam = () => {
	if (!imam.value) return;

	scholarsStore.deleteScholar(imam.value.id);
	router.push("/heritical-imams");
};
</script>

<template>
	<div v-if="imam" class="p-6">
		<div class="mb-6">
			<div class="flex items-center gap-2 text-sm text-text-secondary mb-2">
				<NuxtLink to="/heritical-imams" class="hover:underline"
					>Zalolatchi imomlar</NuxtLink
				>
				<span>/</span>
				<span>{{ imam.name }}</span>
			</div>
		</div>

		<!-- Imam Profile -->
		<div class="card relative">
			<div class="absolute top-4 right-4 flex gap-2">
				<button
					@click="openEditModal"
					class="p-2 text-primary hover:bg-primary/10 rounded">
					<Icon name="heroicons:pencil" size="20" />
				</button>
				<button
					@click="openDeleteModal"
					class="p-2 text-error hover:bg-error/10 rounded">
					<Icon name="heroicons:trash" size="20" />
				</button>
			</div>

			<div class="flex flex-col md:flex-row gap-6">
				<div class="md:w-1/4">
					<div class="aspect-square rounded-xl overflow-hidden">
						<img
							:src="getImageUrl(imam.image)"
							:alt="imam.name"
							class="w-full h-full object-cover" />
					</div>
				</div>

				<div class="md:w-3/4">
					<h1 class="text-3xl font-bold mb-2">{{ imam.name }}</h1>
					<p class="text-xl text-text-secondary mb-4">{{ imam.fullName }}</p>

					<div class="prose mt-4">
						<h3 class="text-lg font-medium mb-2">Biografiya</h3>
						<p v-if="imam.bio" class="whitespace-pre-line">{{ imam.bio }}</p>
						<p v-else class="text-text-secondary italic">
							Biografiya kiritilmagan
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Imam Posts -->
		<div class="mt-8">
			<h2 class="text-xl font-bold mb-4">Imam maqolalari</h2>

			<div v-if="imamPosts.length > 0" class="card">
				<div class="divide-y">
					<div
						v-for="post in imamPosts"
						:key="post.id"
						class="py-4 px-6 hover:bg-secondary/5"
						@click="$router.push(`/posts/${post.slug}`)">
						<div class="flex justify-between items-center">
							<div>
								<h3 class="font-medium">{{ post.title }}</h3>
								<p class="text-sm text-text-secondary">
									{{ formatDate(post.created_at) }}
								</p>
							</div>
							<div>
								<span
									:class="[
										post.status === 'published'
											? 'bg-success/10 text-success'
											: 'bg-warning/10 text-warning',
										'px-2 py-1 rounded-full text-xs font-medium',
									]">
									{{
										post.status === "published" ? "Nashr qilingan" : "Qoralama"
									}}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-else
				class="text-center py-10 text-text-secondary bg-white rounded-xl shadow-sm">
				Imam maqolalari topilmadi
			</div>
		</div>

		<!-- Edit Imam Modal -->
		<WidgetsModal
			v-if="editedImam"
			v-model="isEditModalOpen"
			title="Imam ma'lumotlarini tahrirlash">
			<form @submit.prevent="handleEditImam" class="space-y-4">
				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium">Taxallus</label>
					<input
						id="name"
						v-model="editedImam.name"
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
						v-model="editedImam.fullName"
						type="text"
						required
						placeholder="To'liq ismi"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="bio" class="block text-sm font-medium">Biografiya</label>
					<textarea
						id="bio"
						v-model="editedImam.bio"
						placeholder="Biografiya..."
						rows="6"
						class="input" />
				</div>

				<div class="space-y-2">
					<label for="image" class="block text-sm font-medium">Rasm URL</label>
					<input
						id="image"
						v-model="editedImam.image"
						type="text"
						placeholder="https://example.com/image.jpg"
						class="input" />
				</div>
			</form>

			<template #actions>
				<button @click="handleEditImam" class="btn btn-primary">Saqlash</button>
			</template>
		</WidgetsModal>

		<!-- Delete Confirmation Modal -->
		<WidgetsModal
			v-model="isDeleteModalOpen"
			title="Imam ma'lumotlarini o'chirish">
			<p>
				Siz rostdan ham "{{ imam.name }}" imam ma'lumotlarini o'chirmoqchimisiz?
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
