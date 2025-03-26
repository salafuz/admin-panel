<script setup>
import { ref } from "vue";

const isSearch = ref(false);
const searchData = ref("");

const searching = () => {
	console.log("HELLO");
	console.log(isSearch.value);
	isSearch.value = !isSearch.value;
};
</script>

<template>
	<!-- Search Input Trigger -->
	<UButton
		@click="isSearch = !isSearch"
		icon="i-lucide-search"
		color="neutral"
		variant="none"
		:ui="{ leadingIcon: 'text-(--ui-color-primary)' }"
		size="xl"
		class="bg-text-active rounded p-2 px-3 cursor-pointer">
		Qidirish
	</UButton>

	<!-- Search Modal -->
	<div
		v-if="isSearch"
		class="absolute top-0 left-0 right-0 bottom-0 h-screen z-50 bg-primary/60">
		<!-- Close Button -->
		<button
			@click="searching"
			class="absolute top-5 right-5 cursor-pointer p-2 flex">
			<Icon name="i-lucide-x" size="44" />
		</button>

		<!-- Search Box -->
		<div
			class="absolute top-0 left-0 right-0 bottom-0 m-auto bg-primary/80 shadow-card w-1/2 h-100 rounded-md p-5">
			{{ searchData }}
			<UInput
				v-model="searchData"
				class="w-full flex items-center gap-2 bg-primary rounded p-3 px-3"
				icon="i-lucide-search"
				size="md"
				variant="none"
				placeholder="Search..." />
		</div>
	</div>
</template>
