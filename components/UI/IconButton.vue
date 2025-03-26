<script setup lang="ts">
// Define props for customization
const props = defineProps<{
	color?:
		| "primary"
		| "secondary"
		| "danger"
		| "success"
		| "warning"
		| "neutral";
	variant?: "solid" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	icon?: string;
	disabled?: boolean;
}>();

// Class mapping for styles
const colorClasses: Record<string, string> = {
	primary: "bg-text-active/80 text-white hover:bg-primary/90",
	secondary: "bg-secondary-700 text-white hover:bg-secondary-500",
	danger: "bg-red-700 text-white hover:bg-red-500",
	success: "bg-green-700 text-white hover:bg-green-500",
	warning: "bg-yellow-700 text-white hover:bg-yellow-500",
	neutral: "bg-gray-700 text-white hover:bg-gray-500",
};

const variantClasses: Record<string, string> = {
	solid: "",
	outline: "border border-current text-current bg-transparent",
	ghost: "bg-transparent text-current hover:bg-gray-100 dark:hover:bg-gray-800",
};

const sizeClasses: Record<string, string> = {
	sm: "py-2 p-1 text-sm",
	md: "py-2 p-2 text-base",
	lg: "py-2 p-3 text-lg",
};

const sizeIcon: Record<string, number> = {
	sm: 17,
	md: 20,
	lg: 24,
};
</script>

<template>
	<button
		:class="[
			'flex items-center justify-center rounded-md transition-all focus:outline-none cursor-pointer',
			colorClasses[color || 'primary'],
			variantClasses[variant || 'solid'],
			sizeClasses[size || 'md'],
			{ 'opacity-50 cursor-not-allowed': disabled },
		]"
		:disabled="disabled">
		<!-- Render icon if provided -->
		<Icon
			v-if="icon"
			:name="icon"
			:size="sizeIcon[size || 'md']"
			class="flex-shrink-0 min-w-6" />
		<!-- Render default slot for button text -->
		<slot />
	</button>
</template>

<style scoped>
/* Custom styling (if needed) */
</style>
