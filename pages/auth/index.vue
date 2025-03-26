<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "login" });

const authStore = useAuthStore();

const admin = reactive({
	login: "",
	password: "",
});

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

const login = async () => {
	console.log("Login button clicked");
	const success = await authStore.login({
		login: admin.login,
		password: admin.password,
	});

	if (success) {
		console.log("Login successful");
		navigateTo("/");
	}
};
</script>

<template>
	<div
		class="min-h-screen bg-gradient-to-tr from-primary/90 to-accent/40 flex items-center justify-center p-4">
		<div class="w-full max-w-md">
			<div class="backdrop-blur-lg bg-accent/40 rounded-lg p-8 shadow-2xl">
				<div class="text-center mb-8">
					<img src="/logo.png" alt="" class="w-24 h-24 mx-auto mb-5" />
					<h1 class="text-4xl font-bold text-primary">Xush kelibsiz</h1>
					<p class="mt-2 text-text-secondary">
						<span class="font-bold">salaf.uz</span> admin paneliga kirish
					</p>
				</div>
				<form @submit.prevent="login" class="space-y-6">
					<div class="space-y-2">
						<label for="login" class="text-sm font-semibold text-primary"
							>Login</label
						>
						<input
							id="login"
							v-model="admin.login"
							type="text"
							required
							:disabled="loading"
							placeholder="Loginni kiriting..."
							class="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm outline-none focus:shadow transition-all" />
					</div>

					<div class="space-y-2">
						<label for="password" class="text-sm font-semibold text-primary"
							>Parol</label
						>
						<input
							id="password"
							v-model="admin.password"
							type="password"
							required
							:disabled="loading"
							placeholder="Parolni kiriting..."
							class="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm outline-none focus:shadow transition-all" />
					</div>

					<div
						v-if="error"
						class="p-4 rounded-md bg-error/10 text-error text-sm text-center mt-4">
						{{ error }}
					</div>

					<button
						type="submit"
						:disabled="loading"
						class="w-full py-3 px-4 bg-primary/90 hover:bg-primary text-white rounded-md font-medium backdrop-blur-sm transition-all mt-4 cursor-pointer">
						<span v-if="loading">Yuklanmoqda...</span>
						<span v-else>Kirish</span>
					</button>
				</form>
			</div>
		</div>
	</div>
</template>
