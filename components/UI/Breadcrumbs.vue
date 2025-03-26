<script setup lang="ts">
import { ref } from "vue";

const items = ref([
	{
		label: "Bosh sahifa",
		icon: "i-lucide-home",
		to: "/",
	},
]);
</script>

<template>
	<!-- <UBreadcrumb :items="items" /> -->
</template>
