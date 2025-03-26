<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps<{ status: "published" | "scheduled" | "draft" }>();

// Define badge styles based on status
const badgeStyles = computed(
	(): {
		name: string;
		class: string;
		color: "success" | "info" | "warning" | "neutral";
		icon: string;
	} => {
		switch (props.status) {
			case "published":
				return {
					name: "Nash etilgan",
					class: "bg-success text-accent",
					color: "success",
					icon: "i-lucide-check-circle",
				};
			case "scheduled":
				return {
					name: "Belgilangan",
					class: "bg-info text-accent",
					color: "info",
					icon: "i-lucide-calendar",
				};
			case "draft":
				return {
					name: "Jarayonda",
					class: "bg-warning text-accent",
					color: "warning",
					icon: "i-lucide-file-text",
				};
			default:
				return {
					name: "",
					class: "",
					color: "neutral",
					icon: "i-lucide-file-text",
				};
		}
	}
);
</script>

<template>
	<UBadge
		class="rounded text-nowrap shadow"
		:class="badgeStyles.class"
		:icon="badgeStyles.icon"
		:size="'md'"
		:color="badgeStyles.color"
		variant="solid">
		{{ badgeStyles.name }}
	</UBadge>
</template>
