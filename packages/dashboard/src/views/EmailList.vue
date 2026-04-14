<template>
  <div class="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <!-- Folder header -->
    <div class="flex items-center justify-between px-4 h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
      <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">{{ folderName }}</h1>
      <button
        @click="handleRefresh"
        :disabled="isRefreshing"
        class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
        title="Refresh"
      >
        <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Email list -->
    <ul v-if="emails.length > 0" class="divide-y divide-gray-100 dark:divide-gray-700">
      <li
        v-for="email in emails"
        :key="email.id"
        class="group relative"
        :class="{ 'bg-blue-50/40 dark:bg-blue-900/10': !email.read }"
      >
        <!-- Inline delete confirmation -->
        <div
          v-if="deleteConfirmId === email.id"
          class="flex items-center gap-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500"
        >
          <span class="text-sm text-red-700 dark:text-red-400 flex-1">Delete this email?</span>
          <button
            @click="confirmDelete(email.id)"
            class="px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            @click="deleteConfirmId = null"
            class="px-2.5 py-1 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
        <router-link
          v-else
          :to="{ name: 'EmailDetail', params: { id: email.id }, query: { fromFolder: folderId } }"
          class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <!-- Unread dot -->
          <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="email.read ? 'bg-transparent' : 'bg-indigo-600 dark:bg-indigo-400'"></div>
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-sm truncate" :class="email.read ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'">
                {{ email.sender }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 group-hover:hidden">{{ email.date }}</p>
              <!-- Action buttons on hover -->
              <div class="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                <button
                  @click.prevent="toggleStarStatus(email)"
                  class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :class="email.starred ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'"
                  :title="email.starred ? 'Unstar' : 'Star'"
                >
                  <svg v-if="email.starred" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button
                  @click.prevent="toggleReadStatus(email)"
                  class="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  :title="email.read ? 'Mark unread' : 'Mark read'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  @click.prevent="deleteConfirmId = email.id"
                  class="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ email.subject }}</p>
          </div>
        </router-link>
      </li>
    </ul>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center h-48 text-center px-4">
      <svg class="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-sm text-gray-500 dark:text-gray-400">No emails in {{ folderName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useEmailStore } from "@/stores/emails";
import { useFolderStore } from "@/stores/folders";
import type { Email } from "@/types";

const emailStore = useEmailStore();
const { emails, isRefreshing } = storeToRefs(emailStore);
const folderStore = useFolderStore();
const { folders } = storeToRefs(folderStore);
const route = useRoute();

const deleteConfirmId = ref<string | null>(null);
let refreshInterval: ReturnType<typeof setInterval> | null = null;

const folderId = computed(() => route.params.folder as string);

const folderName = computed(() => {
  const found = folders.value.find((f) => f.id === folderId.value);
  return found ? found.name : folderId.value;
});

const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    emailStore.fetchEmails(route.params.mailboxId as string, { folder: folderId.value });
  }, 30000);
};

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

const handleRefresh = () => {
  emailStore.fetchEmails(route.params.mailboxId as string, { folder: folderId.value });
};

onMounted(() => {
  emailStore.fetchEmails(route.params.mailboxId as string, { folder: folderId.value });
  startAutoRefresh();
});

onUnmounted(() => stopAutoRefresh());

watch(folderId, (newFolderId) => {
  deleteConfirmId.value = null;
  emailStore.fetchEmails(route.params.mailboxId as string, { folder: newFolderId });
});

const toggleReadStatus = (email: Email) => {
  emailStore.updateEmail(route.params.mailboxId as string, email.id, { read: !email.read });
};

const toggleStarStatus = (email: Email) => {
  emailStore.updateEmail(route.params.mailboxId as string, email.id, { starred: !email.starred });
};

const confirmDelete = (emailId: string) => {
  emailStore.deleteEmail(route.params.mailboxId as string, emailId);
  deleteConfirmId.value = null;
};
</script>
