<script setup lang="ts">
// Define props for customization
defineProps<{ loading: boolean }>();
</script>

<template>
	<div class="">
		<div
			v-if="loading"
			class="text-text-secondary/70 flex items-center justify-center py-4 gap-5 pt-20">
			<span class="font-bold text-lg"> Ma'lumotlar yuklanmoqda... </span>
			<Icon
				name="icon-park-outline:loading"
				class="animate-spin rounded-full border-t-2 border-primary"
				size="32" />
		</div>
		<slot v-else />
	</div>
</template>

<style scoped>
/* You can adjust the animation and styling if needed */
</style>
