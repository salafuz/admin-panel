<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] });
</script>
