<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { usePostsStore } from "@/stores/posts";
import { useCategoriesStore } from "@/stores/categories";
import { useTagsStore } from "@/stores/tags";
import { useImagesStore } from "@/stores/images";
import { formatDate } from "@/utils/formatDate";
import type { TableColumn } from "@nuxt/ui";
import { useDebounceFn } from "@vueuse/core";
import type { Post, PostTableColumn, PostRow } from "@/types/post";

// Stores
const postsStore = usePostsStore();
const categoryStore = useCategoriesStore();
const tagStore = useTagsStore();
const imageStore = useImagesStore();

// Modal State
const isCreateModalOpen = ref(false);
const newPost = ref({
  title: "",
  content: "",
  cover_img: "",
  status: "draft" as const,
  publish_at: "",
  category_id: undefined as undefined | number,
  tag_ids: [] as number[]
});

// Filters & Sorting
const searchQuery = ref("");
const selectedStatus = ref<Post["status"] | "">("");
const sortColumn = ref<keyof Post>("publish_at");
const sortDirection = ref<"asc" | "desc">("desc");

// Status Options
const statusOptions = [
  { value: "", label: "Barchasi" },
  { value: "published", label: "Nashr etilgan" },
  { value: "draft", label: "Qoralama" },
  { value: "scheduled", label: "Rejalashtirilgan" },
] as const;

// Selected Tags
const selectedTags = ref<number[]>([]);
const tagSearchQuery = ref("");

// Tags search results
const filteredTags = computed(() => {
  if (!tagSearchQuery.value) return tagStore.tags;
  return tagStore.tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearchQuery.value.toLowerCase())
  );
});

// Create Post
const handleCreatePost = async () => {
  try {
    if (!newPost.value.category_id) {
      useToast().add({
        title: 'Xatolik',
        description: 'Kategoriyani tanlash majburiy',
        color: 'error',
      });
      return;
    }
    
    await postsStore.createPost({
      ...newPost.value,
      category_id: newPost.value.category_id,
      tag_ids: selectedTags.value
    });
    
    isCreateModalOpen.value = false;
    newPost.value = {
      title: "",
      content: "",
      cover_img: "",
      status: "draft" as const,
      publish_at: "",
      category_id: undefined,
      tag_ids: []
    };
    selectedTags.value = [];
    
    // Show success notification
    useToast().add({
      title: 'Muvaffaqiyatli',
      description: 'Post muvaffaqiyatli yaratildi',
      color: 'success',
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    // Show error notification
    useToast().add({
      title: 'Xatolik',
      description: 'Postni yaratishda xatolik yuz berdi',
      color: 'error',
    });
  }
};

// Delete Post
const handleDeletePost = async (id: number) => {
  try {
    await postsStore.deletePost(id);
    // Show success notification
    useToast().add({
      title: 'Muvaffaqiyatli',
      description: 'Post muvaffaqiyatli o\'chirildi',
      color: 'success',
    });
  } catch (error) {
    console.error("Failed to delete post:", error);
    // Show error notification
    useToast().add({
      title: 'Xatolik',
      description: 'Postni o\'chirishda xatolik yuz berdi',
      color: 'error',
    });
  }
};

// Tag Management
const addTag = (tagId: number) => {
  if (!selectedTags.value.includes(tagId)) {
    selectedTags.value.push(tagId);
  }
  tagSearchQuery.value = "";
};

const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter(id => id !== tagId);
};

// Edit Post
const editPost = (id: number) => {
  navigateTo(`/posts/edit/${id}`);
};

// Table Columns
const columns = [
  { key: "id", label: "#" },
  { key: "cover_img", label: "Rasm" },
  { key: "title", label: "Sarlavha", sortable: true },
  { key: "category.name", label: "Kategoriya" },
  { key: "tags", label: "Teglar" },
  { key: "status", label: "Holati", sortable: true },
  { key: "publish_at", label: "Nashr vaqti", sortable: true },
  { key: "views", label: "Ko'rishlar", sortable: true },
  { key: "actions", label: "Harakatlar" }
] as TableColumn<Post>[];

// Handle Sorting
const handleSort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column as keyof Post;
    sortDirection.value = "desc";
  }
};

// Debounced Search
const debouncedSearch = useDebounceFn(() => {
  postsStore.fetchPosts({
    search: searchQuery.value,
    status: selectedStatus.value,
    sort: sortColumn.value,
    direction: sortDirection.value,
    page: postsStore.currentPage,
  });
}, 300);

// Watch for filter changes
watch([searchQuery, selectedStatus], () => {
  debouncedSearch();
});

// Watch for sort changes
watch([sortColumn, sortDirection], () => {
  postsStore.fetchPosts({
    search: searchQuery.value,
    status: selectedStatus.value,
    sort: sortColumn.value,
    direction: sortDirection.value,
    page: postsStore.currentPage,
  });
});

// Fetch initial data
onMounted(async () => {
  await Promise.all([
    postsStore.fetchPosts(),
    categoryStore.fetchCategories(),
    tagStore.fetchTags()
  ]);
});
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold">Postlar</h1>
      <UButton color="primary" icon="i-heroicons-plus" @click="isCreateModalOpen = true">
        Post yaratish
      </UButton>
    </div>

    <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <UInput v-model="searchQuery" placeholder="Qidirish..." icon="i-heroicons-magnifying-glass" />
      <USelect
        v-model="selectedStatus"
        :options="statusOptions"
        placeholder="Statuslar"
        icon="i-heroicons-funnel"
      />
    </div>

    <UTable
      :columns="columns"
      :rows="postsStore.posts"
      :loading="postsStore.loading"
      :sort="{ column: sortColumn, direction: sortDirection }"
      @sort="handleSort"
    >
      <template #loading-state>
        <div class="flex items-center justify-center h-32">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
        </div>
      </template>

      <template #cover_img-data="{ row }">
        <div class="w-16 h-16 rounded overflow-hidden">
          <img :src="(row as Post).cover_img" :alt="(row as Post).title" class="w-full h-full object-cover" />
        </div>
      </template>

      <template #title-data="{ row }">
        <div class="max-w-xs">
          <p class="text-sm font-medium truncate">{{ (row as Post).title }}</p>
          <p class="text-xs text-gray-500 truncate">
            {{ (row as Post).content.replace(/<[^>]*>/g, '').slice(0, 50) }}...
          </p>
        </div>
      </template>

      <template #tags-data="{ row }">
        <div class="flex flex-wrap gap-1">
          <UBadge v-for="tag in (row as Post).tags" :key="tag.id" color="info" size="xs" class="px-2 py-1">
            {{ tag.name }}
          </UBadge>
          <span v-if="!(row as Post).tags || (row as Post).tags.length === 0" class="text-xs text-gray-400">
            Teglar yo'q
          </span>
        </div>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :color="
            (row as Post).status === 'published'
              ? 'success'
              : (row as Post).status === 'draft'
              ? 'neutral'
              : 'warning'
          "
        >
          {{
            (row as Post).status === 'published'
              ? 'Nashr etilgan'
              : (row as Post).status === 'draft'
              ? 'Qoralama'
              : 'Rejalashtirilgan'
          }}
        </UBadge>
      </template>

      <template #publish_at-data="{ row }">
        <div class="text-sm">
          {{ formatDate((row as Post).publish_at) }}
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="flex items-center space-x-2">
          <UButton color="info" variant="ghost" icon="i-heroicons-pencil-square" size="xs" @click="editPost(Number((row as Post).id))" />
          <UButton
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            @click="handleDeletePost(Number((row as Post).id))"
          />
        </div>
      </template>

      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6">
          <UIcon name="i-heroicons-document-text" class="text-gray-400 h-12 w-12 mb-2" />
          <p class="text-gray-500 text-sm">Hech qanday post topilmadi</p>
        </div>
      </template>
    </UTable>

    <div class="mt-4 flex justify-end">
      <UPagination
        v-model="postsStore.currentPage" 
        :total="postsStore.total"
        :page-count="5"
        :ui="{ item: 'rounded-full' }"
        @change="postsStore.changePage"
      />
    </div>

    <UModal v-model="isCreateModalOpen">
      <div class="p-4 space-y-4">
        <h2 class="text-xl font-semibold">Post yaratish</h2>
        <form @submit.prevent="handleCreatePost" class="space-y-4">
          <UFormGroup label="Sarlavha">
            <UInput v-model="newPost.title" placeholder="Sarlavha kiriting" />
          </UFormGroup>

          <UFormGroup label="Kontent">
            <UTextarea v-model="newPost.content" placeholder="Kontent kiriting" rows="5" />
          </UFormGroup>

          <UFormGroup label="Muqova rasmi">
            <UInput v-model="newPost.cover_img" placeholder="Rasm URL'ini kiriting" />
          </UFormGroup>

          <UFormGroup label="Kategoriya">
            <USelect
              v-model="newPost.category_id"
              :options="categoryStore.categories.map(c => ({ value: c.id, label: c.name }))"
              placeholder="Kategoriyani tanlang"
            />
          </UFormGroup>

          <UFormGroup label="Teglar">
            <div>
              <div class="flex flex-wrap gap-2 mb-2">
                <UBadge
                  v-for="tagId in selectedTags"
                  :key="tagId"
                  color="info"
                  class="px-2 py-1"
                >
                  {{ tagStore.tags.find(t => t.id === tagId)?.name }}
                  <button @click="removeTag(tagId)" class="ml-1">
                    <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                  </button>
                </UBadge>
              </div>

              <div class="relative">
                <UInput
                  v-model="tagSearchQuery"
                  placeholder="Teg qidirish"
                  icon="i-heroicons-tag"
                />
                <div
                  v-if="tagSearchQuery && filteredTags.length > 0"
                  class="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  <div
                    v-for="tag in filteredTags"
                    :key="tag.id"
                    class="p-2 hover:bg-gray-100 cursor-pointer"
                    @click="addTag(tag.id)"
                  >
                    {{ tag.name }}
                  </div>
                </div>
              </div>
            </div>
          </UFormGroup>

          <UFormGroup label="Holati">
            <USelect
              v-model="newPost.status"
              :options="[
                { value: 'published', label: 'Nashr etilgan' },
                { value: 'draft', label: 'Qoralama' },
                { value: 'scheduled', label: 'Rejalashtirilgan' }
              ]"
              placeholder="Holatni tanlang"
            />
          </UFormGroup>

          <UFormGroup label="Nashr etish vaqti">
            <UInput v-model="newPost.publish_at" type="datetime-local" />
          </UFormGroup>

          <div class="flex justify-end space-x-2">
            <UButton color="neutral" variant="outline" @click="isCreateModalOpen = false">Bekor qilish</UButton>
            <UButton type="submit" color="primary">Saqlash</UButton>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>
