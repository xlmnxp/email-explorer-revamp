<template>
  <div class="h-full bg-white dark:bg-gray-800">
    <div class="px-4 h-10 flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
      <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Search Results</h1>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-24">
      <svg class="w-5 h-5 animate-spin text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
    <div v-else-if="results.length === 0" class="flex flex-col items-center justify-center h-32 text-center px-4">
      <p class="text-sm text-gray-400 dark:text-gray-500">No results found</p>
    </div>
    <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700">
      <li v-for="email in results" :key="email.id">
        <router-link
          :to="{ name: 'EmailDetail', params: { id: email.id } }"
          class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ email.sender }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{{ email.date }}</p>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ email.subject }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();
const { results, isLoading } = storeToRefs(searchStore);
</script>
