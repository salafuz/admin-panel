<script setup lang="ts">
defineProps<{ to: string; icon: string; label: string; isHovered: boolean }>();
</script>

<template>
	<nuxt-link
		:to="to"
		class="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-text-active hover:bg-buttonPrimary overflow-hidden shadow">
		<Icon :name="icon" size="24" class="flex-shrink-0 min-w-6" />
		<span
			class="transition-opacity duration-300 text-nowrap text-sm whitespace-nowrap overflow-hidden opacity-100 max-w-full">
			{{ label }}
		</span>
	</nuxt-link>
</template>

<style scoped></style>
