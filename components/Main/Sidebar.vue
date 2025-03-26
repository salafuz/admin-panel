<script setup lang="ts">
import { ref } from "vue";

const isHovered = ref(false);

// Define navigation items in an array
const navItems = [
	{ to: "/", icon: "fluent-color:home-24", label: "Bosh sahifa" },
	{ to: "/posts", icon: "fluent-color:news-24", label: "Maqolalar" },
	{
		to: "/categories",
		icon: "fluent-color:document-folder-24",
		label: "Kategoriyalar",
	},
	{
		to: "/scholars",
		icon: "fluent-color:lightbulb-filament-24",
		label: "Ulamolar",
	},
	{
		to: "/heritical-imams",
		icon: "fluent-color:warning-24",
		label: "Zalolatchi imomlar",
	},
	{ to: "/tafsirs", icon: "fluent-color:book-open-24", label: "Tafsir" },
	{ to: "/media", icon: "fluent-color:video-24", label: "Media" },
	{
		to: "/",
		icon: "fluent-color:question-circle-24",
		label: "So'ralmalar",
	},
];

const hover = () => {
	console.log("HOVER");
};
</script>

<template>
	<aside
		class="fixed top-0 left-0 min-h-screen bg-primary border-r border-text-secondary text-white transition-all duration-300 z-50 hover:w-64"
		:class="{ 'w-18': !isHovered, 'w-64': isHovered }"
		@mouseenter="hover"
		@mouseleave="isHovered = false">
		<!-- Logo and Title -->
		<div class="flex items-center gap-3 p-3 overflow-hidden">
			<img src="/logo.png" alt="Logo" class="w-12 h-12 object-cover" />
			<span
				class="text-2xl font-bold transition-opacity duration-300 whitespace-nowrap opacity-100 max-w-full">
				salaf.uz
			</span>
		</div>

		<!-- Navigation Menu -->
		<nav class="flex flex-col gap-2 p-3">
			<!-- Loop through navItems and render MainMenuItem for each -->
			<MainMenuItem
				v-for="(item, index) in navItems"
				:key="index"
				:to="item.to"
				:icon="item.icon"
				:label="item.label"
				:isHovered="isHovered" />
		</nav>
	</aside>
</template>
