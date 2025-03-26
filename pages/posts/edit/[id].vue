&lt;script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const postStore = usePostsStore()

const post = ref({
  title: '',
  content: '',
  cover_img: '',
  status: 'draft',
  publish_at: '',
  category_id: null,
})

const loading = ref(false)

// Status options
const statusOptions = [
  { value: 'published', label: 'Nashr etilgan' },
  { value: 'draft', label: 'Qoralama' },
  { value: 'scheduled', label: 'Rejalashtirilgan' },
]

// Load post data
onMounted(async () => {
  try {
    loading.value = true
    const postId = Number(route.params.id)
    const postData = await postStore.fetchPost(postId)
    post.value = {
      ...postData,
      publish_at: postData.publish_at?.split('T')[0] || '', // Format date for input
    }
    await postStore.fetchCategories() // Load categories
  } catch (error) {
    console.error('Failed to load post:', error)
    // Show error notification
    useToast().add({
      title: 'Xatolik',
      description: 'Postni yuklashda xatolik yuz berdi',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
})

// Save changes
const handleSave = async () => {
  try {
    loading.value = true
    const postId = Number(route.params.id)
    await postStore.updatePost(postId, post.value)
    
    // Show success notification
    useToast().add({
      title: 'Muvaffaqiyatli',
      description: 'Post muvaffaqiyatli yangilandi',
      color: 'green',
    })
    
    // Navigate back to posts list
    router.push('/posts')
  } catch (error) {
    console.error('Failed to update post:', error)
    // Show error notification
    useToast().add({
      title: 'Xatolik',
      description: 'Postni yangilashda xatolik yuz berdi',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
&lt;/script>

&lt;template>
  &lt;div class="post-edit-page">
    &lt;div class="page-header">
      &lt;div class="flex items-center gap-4">
        &lt;UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="gray"
          @click="router.push('/posts')"
        />
        &lt;h1 class="text-2xl font-semibold">Postni tahrirlash&lt;/h1>
      &lt;/div>
      
      &lt;div class="flex gap-2">
        &lt;UButton
          color="gray"
          variant="ghost"
          @click="router.push('/posts')"
        >
          Bekor qilish
        &lt;/UButton>
        &lt;UButton
          color="primary"
          :loading="loading"
          @click="handleSave"
        >
          Saqlash
        &lt;/UButton>
      &lt;/div>
    &lt;/div>

    &lt;div class="post-form" v-if="!loading">
      &lt;div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        &lt;div class="lg:col-span-2 space-y-6">
          &lt;UCard>
            &lt;UFormGroup label="Sarlavha">
              &lt;UInput
                v-model="post.title"
                placeholder="Post sarlavhasi"
              />
            &lt;/UFormGroup>

            &lt;UFormGroup label="Kontent" class="mt-4">
              &lt;TiptapEditor
                v-model="post.content"
                placeholder="Post kontenti..."
              />
            &lt;/UFormGroup>
          &lt;/UCard>
        &lt;/div>

        &lt;div class="space-y-6">
          &lt;UCard>
            &lt;UFormGroup label="Holat">
              &lt;USelect
                v-model="post.status"
                :options="statusOptions"
              />
            &lt;/UFormGroup>

            &lt;UFormGroup label="Nashr vaqti" class="mt-4">
              &lt;UInput
                v-model="post.publish_at"
                type="datetime-local"
              />
            &lt;/UFormGroup>

            &lt;UFormGroup label="Kategoriya" class="mt-4">
              &lt;USelect
                v-model="post.category_id"
                :options="postStore.categories"
                option-attribute="name"
                value-attribute="id"
              />
            &lt;/UFormGroup>
          &lt;/UCard>

          &lt;UCard>
            &lt;UFormGroup label="Muqova rasmi">
              &lt;div class="space-y-4">
                &lt;img
                  v-if="post.cover_img"
                  :src="post.cover_img"
                  :alt="post.title"
                  class="w-full aspect-video object-cover rounded"
                />
                &lt;UInput
                  v-model="post.cover_img"
                  placeholder="Rasm URL"
                />
              &lt;/div>
            &lt;/UFormGroup>
          &lt;/UCard>
        &lt;/div>
      &lt;/div>
    &lt;/div>

    &lt;div v-else class="flex justify-center py-12">
      &lt;ULoadingIcon size="lg" />
    &lt;/div>
  &lt;/div>
&lt;/template>

&lt;style scoped>
.post-edit-page {
  --post-primary-color: var(--color-primary-600);
  --post-bg-color: var(--color-gray-100);
  --post-text-color: var(--color-gray-900);
  
  padding: 1.5rem;
  background-color: var(--post-bg-color);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.post-form {
  margin-top: 1.5rem;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
&lt;/style>
