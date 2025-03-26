&lt;script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = ref<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:text-primary-500',
        },
      }),
      Placeholder.configure({
        placeholder: props.placeholder || 'Write something...',
      }),
    ],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML())
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Editor Actions
const addImage = (url: string) => {
  if (url && editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const addLink = (url: string) => {
  if (url && editor.value) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

defineExpose({
  addImage,
  addLink,
})
&lt;/script>

&lt;template>
  &lt;div class="tiptap-editor">
    &lt;div class="editor-toolbar border-b border-gray-200 p-2 flex gap-2">
      &lt;UButton
        size="xs"
        :color="editor?.isActive('bold') ? 'primary' : 'gray'"
        variant="ghost"
        icon="i-heroicons-bold"
        @click="editor?.chain().focus().toggleBold().run()"
      />
      &lt;UButton
        size="xs"
        :color="editor?.isActive('italic') ? 'primary' : 'gray'"
        variant="ghost"
        icon="i-heroicons-bars-3-bottom-left"
        @click="editor?.chain().focus().toggleItalic().run()"
      />
      &lt;UButton
        size="xs"
        :color="editor?.isActive('strike') ? 'primary' : 'gray'"
        variant="ghost"
        icon="i-heroicons-minus"
        @click="editor?.chain().focus().toggleStrike().run()"
      />
      &lt;div class="w-px h-4 bg-gray-200" />
      &lt;UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'gray'"
        variant="ghost"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      &lt;/UButton>
      &lt;UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'gray'"
        variant="ghost"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      &lt;/UButton>
      &lt;div class="w-px h-4 bg-gray-200" />
      &lt;UButton
        size="xs"
        :color="editor?.isActive('bulletList') ? 'primary' : 'gray'"
        variant="ghost"
        icon="i-heroicons-list-bullet"
        @click="editor?.chain().focus().toggleBulletList().run()"
      />
      &lt;UButton
        size="xs"
        :color="editor?.isActive('orderedList') ? 'primary' : 'gray'"
        variant="ghost"
        icon="i-heroicons-list-bullet"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      />
      &lt;div class="w-px h-4 bg-gray-200" />
      &lt;UButton
        size="xs"
        :color="editor?.isActive('link') ? 'primary' : 'gray'"
        variant="ghost"
        icon="i-heroicons-link"
        @click="addLink(prompt('Enter link URL:') || '')"
      />
      &lt;UButton
        size="xs"
        color="gray"
        variant="ghost"
        icon="i-heroicons-photo"
        @click="addImage(prompt('Enter image URL:') || '')"
      />
    &lt;/div>
    &lt;EditorContent :editor="editor" class="prose max-w-none p-4" />
  &lt;/div>
&lt;/template>

&lt;style>
.tiptap-editor {
  @apply border border-gray-200 rounded-lg overflow-hidden bg-white;
}

.tiptap-editor .ProseMirror {
  @apply min-h-[200px] outline-none;
}

.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  @apply text-gray-400 float-left h-0 pointer-events-none;
  content: attr(data-placeholder);
}
&lt;/style>
