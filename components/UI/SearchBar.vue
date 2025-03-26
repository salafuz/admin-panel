<template>
	<div class="relative w-full max-w-sm">
		<input
			v-model="searchQuery"
			@input="onSearch"
			@keyup.enter="onSearch"
			type="text"
			class="w-full p-2 pl-10 text-base border rounded-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
			placeholder="Qidiring..." />
		<Icon
			name="lucide:search"
			class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import Icon from "@nuxt/ui/runtime/components/Icon.vue";

const props = defineProps({
	modelValue: String,
});

const emit = defineEmits(["update:modelValue", "search"]);

const searchQuery = ref(props.modelValue || "");

const onSearch = () => {
	emit("update:modelValue", searchQuery.value);
	emit("search", searchQuery.value);
};

// Sync changes from parent
watch(
	() => props.modelValue,
	(newVal) => {
		searchQuery.value = newVal || "";
	}
);
</script>

<style scoped></style>
