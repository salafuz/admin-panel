<script setup>
import { ref, onMounted, computed } from "vue";
import { usePostsStore } from "~/stores/posts";
import { useCategoriesStore } from "~/stores/categories";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();
const categoriesStore = useCategoriesStore();

const post = ref(null);
const editorContent = ref("");
const isDeleteModalOpen = ref(false);
const isSaving = ref(false);
const saveMessage = ref("");

// Load post data on mount
onMounted(() => {
	const slug = route.params.slug;
	const foundPost = postsStore.getPostBySlug(slug);

	if (foundPost) {
		post.value = foundPost;
		editorContent.value = foundPost.content;
	} else {
		// Handle not found
		router.push("/posts");
	}
});

const categoryName = computed(() => {
	if (!post.value) return "";
	const category = categoriesStore.getCategoryById(post.value.category_id);
	return category ? category.name : "Noma'lum";
});

const statusText = computed(() => {
	if (!post.value) return "";
	return post.value.status === "published" ? "Nashr qilingan" : "Qoralama";
});

const publishDateText = computed(() => {
	if (!post.value || !post.value.publish_at) return "Nashr qilinmagan";
	return new Date(post.value.publish_at).toLocaleDateString("uz-UZ", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
});

// Methods
const savePost = () => {
	if (!post.value) return;

	isSaving.value = true;
	saveMessage.value = "";

	try {
		postsStore.updatePost(post.value.id, {
			content: editorContent.value,
		});

		saveMessage.value = "Maqola muvaffaqiyatli saqlandi";

		// Clear the message after 3 seconds
		setTimeout(() => {
			saveMessage.value = "";
		}, 3000);
	} catch (error) {
		saveMessage.value = "Xatolik yuz berdi!";
	} finally {
		isSaving.value = false;
	}
};

const confirmDelete = () => {
	isDeleteModalOpen.value = true;
};

const deletePost = () => {
	if (!post.value) return;

	postsStore.deletePost(post.value.id);
	isDeleteModalOpen.value = false;
	router.push("/posts");
};

const publishPost = () => {
	if (!post.value) return;

	postsStore.updatePost(post.value.id, {
		status: "published",
		publish_at: new Date().toISOString(),
	});

	// Refresh the post data
	const updatedPost = postsStore.getPostById(post.value.id);
	if (updatedPost) {
		post.value = updatedPost;
	}
};
</script>

<template>
	<div v-if="post" class="p-6">
		<div class="mb-6">
			<div class="flex justify-between items-center">
				<div>
					<div class="flex items-center gap-2 text-sm text-text-secondary mb-2">
						<NuxtLink to="/posts" class="hover:underline">Maqolalar</NuxtLink>
						<span>/</span>
						<span>{{ post.title }}</span>
					</div>
					<h1 class="text-2xl font-bold">{{ post.title }}</h1>
				</div>

				<div class="flex gap-2">
					<button
						@click="publishPost"
						v-if="post.status === 'draft'"
						class="btn btn-primary flex items-center gap-1">
						<Icon name="heroicons:check-circle" size="20" />
						Nashr qilish
					</button>
					<button
						@click="savePost"
						:disabled="isSaving"
						class="btn btn-primary flex items-center gap-1">
						<Icon name="heroicons:document-text" size="20" />
						{{ isSaving ? "Saqlanmoqda..." : "Saqlash" }}
					</button>
					<button
						@click="confirmDelete"
						class="btn btn-secondary flex items-center gap-1">
						<Icon name="heroicons:trash" size="20" />
						O'chirish
					</button>
				</div>
			</div>

			<div class="flex gap-4 mt-4 text-sm text-text-secondary">
				<div class="flex items-center gap-1">
					<Icon name="heroicons:folder" size="18" />
					<span>{{ categoryName }}</span>
				</div>
				<div class="flex items-center gap-1">
					<Icon name="heroicons:clock" size="18" />
					<span>{{ publishDateText }}</span>
				</div>
				<div class="flex items-center gap-1">
					<Icon name="heroicons:document-check" size="18" />
					<span
						:class="
							post.status === 'published' ? 'text-success' : 'text-warning'
						">
						{{ statusText }}
					</span>
				</div>
			</div>

			<div
				v-if="saveMessage"
				class="mt-2 text-sm"
				:class="
					saveMessage.includes('Xatolik') ? 'text-error' : 'text-success'
				">
				{{ saveMessage }}
			</div>
		</div>

		<!-- Editor -->
		<div class="card">
			<QuillEditor
				theme="snow"
				placeholder="Maqola matnini kiriting..."
				v-model:content="editorContent"
				content-type="html"
				:toolbar="[
					['bold', 'italic', 'underline', 'strike'],
					[{ header: 1 }, { header: 2 }],
					['blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					[{ script: 'sub' }, { script: 'super' }],
					[{ indent: '-1' }, { indent: '+1' }],
					[{ direction: 'rtl' }],
					[{ size: ['small', false, 'large', 'huge'] }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					[{ align: [] }],
					['clean'],
					['link', 'image', 'video'],
				]"
				:options="{
					placeholder: 'Maqola matnini kiriting...',
					readOnly: false,
					theme: 'snow',
				}"
				style="height: 500px" />
		</div>

		<!-- Delete Confirmation Modal -->
		<WidgetsModal v-model="isDeleteModalOpen" title="Maqolani o'chirish">
			<p>Siz rostdan ham bu maqolani o'chirmoqchimisiz?</p>
			<p class="text-sm text-text-secondary mt-1">
				Bu amaldan qaytib bo'lmaydi.
			</p>

			<template #actions>
				<button
					@click="deletePost"
					class="btn bg-error text-white hover:bg-error/90">
					O'chirish
				</button>
			</template>
		</WidgetsModal>
	</div>
</template>
