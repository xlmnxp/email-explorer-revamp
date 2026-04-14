<template>
  <router-view />
  <Toast />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Toast from "@/components/Toast.vue";
import { useAppSettings } from "@/composables/useAppSettings";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const { fetchSettings } = useAppSettings();
const uiStore = useUIStore();
const authStore = useAuthStore();

onMounted(async () => {
	fetchSettings();
	uiStore.initDarkMode();
	// Refresh session from server to pick up any permission changes
	if (authStore.isAuthenticated) {
		await authStore.checkAuth();
	}
});
</script>
