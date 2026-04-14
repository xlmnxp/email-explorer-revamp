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
        <h2 class="text-2xl font-semibold leading-snug" :style="{ color: 'var(--color-primary)' }">Reset your password</h2>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">We'll send a reset link to your email address.</p>
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

        <h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Forgot password?</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Remember it?
          <router-link to="/login" class="font-medium hover:underline" :style="{ color: 'var(--color-primary)' }">Back to login</router-link>
        </p>

        <div v-if="error" class="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-3 py-2">
          {{ error }}
        </div>
        <div v-if="successMessage" class="mb-4 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded px-3 py-2">
          {{ successMessage }}
        </div>

        <form v-if="!successMessage" @submit.prevent="handleForgotPassword" class="space-y-4">
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
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 text-white text-sm font-medium rounded transition-colors disabled:opacity-60"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            {{ isLoading ? "Sending..." : "Send reset link" }}
          </button>
        </form>

        <div v-if="successMessage" class="mt-2">
          <router-link to="/login" class="text-sm font-medium hover:underline" :style="{ color: 'var(--color-primary)' }">
            Back to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppSettings } from "@/composables/useAppSettings";
import { useToast } from "@/composables/useToast";
import api from "@/services/api";

const { branding } = useAppSettings();
const { success, error: showError } = useToast();

const email = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

async function handleForgotPassword() {
  error.value = null;
  isLoading.value = true;

  try {
    await api.forgotPassword(email.value);
    successMessage.value = `Password reset link sent to ${email.value}. Please check your email.`;
    success("Reset link sent! Check your email.");
  } catch (e: any) {
    const errorMessage = e.response?.data?.error || "Failed to send reset link. Please try again.";
    error.value = errorMessage;
    showError(errorMessage);
  } finally {
    isLoading.value = false;
  }
}
</script>
