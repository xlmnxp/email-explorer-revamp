<template>
  <div class="min-h-screen flex">
    <!-- Left sidebar panel -->
    <div class="hidden md:flex md:w-80 lg:w-96 flex-col justify-between p-10 flex-shrink-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div>
        <div class="flex items-center gap-3 mb-12">
          <img v-if="branding.logoUrl" :src="branding.logoUrl" class="h-8 w-auto object-contain" :alt="branding.appName || 'Email Explorer'" :title="branding.appName || 'Email Explorer'" />
          <template v-else>
            <div class="w-8 h-8 rounded flex items-center justify-center" :style="{ backgroundColor: 'var(--color-primary)' }">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span v-if="!branding.logoUrl" class="font-semibold text-lg" :style="{ color: 'var(--color-primary)' }">{{ branding.appName || 'Email Explorer' }}</span>
          </template>
        </div>
        <h2 class="text-2xl font-semibold leading-snug" :style="{ color: 'var(--color-primary)' }">Welcome back</h2>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">Sign in to access your mailboxes and messages.</p>
      </div>
      <p class="text-xs text-gray-300 dark:text-gray-600">{{ branding.appName || 'Email Explorer' }}</p>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-8 md:hidden">
          <img v-if="branding.logoUrl" :src="branding.logoUrl" class="h-7 w-auto object-contain" :alt="branding.appName || 'Email Explorer'" :title="branding.appName || 'Email Explorer'" />
          <template v-else>
            <div class="w-7 h-7 rounded flex items-center justify-center" :style="{ backgroundColor: 'var(--color-primary)' }">
              <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span v-if="!branding.logoUrl" class="font-semibold text-gray-800 dark:text-gray-100">{{ branding.appName || 'Email Explorer' }}</span>
          </template>
        </div>

        <h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Sign in</h1>
        <p v-if="isRegistrationEnabled()" class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Don't have an account?
          <router-link to="/register" class="font-medium hover:underline" :style="{ color: 'var(--color-primary)' }">Create one</router-link>
        </p>
        <div v-else class="mb-6"></div>

        <div v-if="authStore.error" class="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-3 py-2">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="password" class="block text-xs font-medium text-gray-600 dark:text-gray-400">Password</label>
              <router-link v-if="isAccountRecoveryEnabled()" to="/forgot-password" class="text-xs hover:underline" :style="{ color: 'var(--color-primary)' }">Forgot password?</router-link>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-2 text-white text-sm font-medium rounded transition-colors disabled:opacity-60"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            {{ authStore.loading ? "Signing in..." : "Sign in" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppSettings } from "@/composables/useAppSettings";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const { isRegistrationEnabled, isAccountRecoveryEnabled, branding } = useAppSettings();

const email = ref("");
const password = ref("");

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    // Error is handled by store
  }
}
</script>
