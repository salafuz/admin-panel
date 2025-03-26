<template>
	<div class="flex overflow-hidden">
		<MainSidebar />
		<div class="flex-1 flex flex-col min-h-screen ml-18 overflow-hidden">
			<!-- <MainNavbar /> -->
			<main class="h-screen bg-accent p-2 overflow-auto pb-20">
				<NuxtPage />
			</main>
			<!-- <MainFooter /> -->
		</div>
	</div>
</template>

<script setup></script>
