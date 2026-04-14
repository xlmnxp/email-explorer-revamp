<template>
  <header class="h-11 flex items-center gap-3 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
    <!-- Search -->
    <div class="relative flex-1 max-w-md">
      <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="performSearch"
        placeholder="Search emails..."
        class="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 ml-auto">
      <!-- Dark mode toggle -->
      <button
        @click="uiStore.toggleDarkMode()"
        class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        :title="uiStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Sun icon (light mode) -->
        <svg v-if="uiStore.isDarkMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Moon icon (dark mode) -->
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- Mailboxes -->
      <router-link
        to="/"
        class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Mailboxes"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
        </svg>
      </router-link>

      <!-- Settings -->
      <a
        href="#"
        @click.prevent="handleSettingsClick"
        class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Settings"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchStore } from "@/stores/search";
import { useUIStore } from "@/stores/ui";

const searchQuery = ref("");
const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();

const performSearch = () => {
  const mailboxId = route.params.mailboxId as string;
  searchStore.searchEmails(mailboxId, searchQuery.value);
  router.push({ name: "SearchResults" });
};

const handleSettingsClick = () => {
  const mailboxId = route.params.mailboxId as string;
  if (route.name === "Settings") {
    if (mailboxId) {
      router.push({ name: "EmailList", params: { mailboxId, folder: "inbox" } });
    } else {
      router.push("/");
    }
  } else if (mailboxId) {
    router.push({ name: "Settings", params: { mailboxId } });
  }
};
</script>
