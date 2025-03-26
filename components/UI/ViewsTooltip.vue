<script setup lang="ts">
// Define props for customization
const props = defineProps<{
	post?: object;
}>();
</script>

<template>
	<button :class="['flex items-center justify-center text-center mx-auto ']">
		<!-- Render icon if provided -->
		<Icon name="lucide:eye" class="flex-shrink-0 min-w-6" />
		<span>{{ post?.views }}</span>
	</button>
</template>

<style scoped>
/* Custom styling (if needed) */
</style>
