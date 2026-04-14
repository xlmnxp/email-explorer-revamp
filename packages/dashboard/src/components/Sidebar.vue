<template>
  <aside class="w-52 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
    <!-- Logo / App name -->
    <div class="px-3 pt-3 pb-2 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 mb-1">
      <img v-if="branding.logoUrl" :src="branding.logoUrl" class="h-6 w-auto max-w-[140px] object-contain" :alt="branding.appName || 'Email Explorer'" :title="branding.appName || 'Email Explorer'" />
      <template v-else>
        <div class="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: 'var(--color-primary)' }">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span v-if="!branding.logoUrl" class="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{{ branding.appName || 'Email Explorer' }}</span>
      </template>
    </div>

    <!-- Compose button -->
    <div class="px-3 pt-2 pb-2">
      <button
        @click="openComposeModal"
        class="w-full flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded transition-colors"
        :style="{ backgroundColor: 'var(--color-primary)' }"
        @mouseover="($event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'"
        @mouseleave="($event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Compose
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-1">
      <!-- Default folders -->
      <router-link
        v-for="item in defaultFolderItems"
        :key="item.folder"
        :to="{ name: 'EmailList', params: { mailboxId: route.params.mailboxId, folder: item.folder } }"
        class="flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-2 border-transparent transition-colors"
        :active-class="item.folder === 'trash' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'nav-active'"
      >
        <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
        <span>{{ item.label }}</span>
      </router-link>

      <!-- Custom folders -->
      <div v-if="customFolders.length > 0 || true" class="mt-3">
        <div class="flex items-center justify-between px-3 py-1">
          <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Folders</span>
          <button
            @click="createNewFolder"
            class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 rounded transition-colors"
            title="New folder"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <router-link
          v-for="folder in customFolders"
          :key="folder.id"
          :to="{ name: 'EmailList', params: { mailboxId: route.params.mailboxId, folder: folder.id } }"
          class="flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-2 border-transparent transition-colors"
          active-class="nav-active"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span class="truncate">{{ folder.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, defineComponent, h, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAppSettings } from "@/composables/useAppSettings";
import { useFolderStore } from "@/stores/folders";
import { useUIStore } from "@/stores/ui";

const folderStore = useFolderStore();
const { folders } = storeToRefs(folderStore);
const uiStore = useUIStore();
const route = useRoute();
const { branding } = useAppSettings();

const defaultFolderIds = ["archive", "inbox", "sent", "spam", "trash", "draft"];
const customFolders = computed(() =>
  folders.value.filter((f) => !defaultFolderIds.includes(f.name.toLowerCase()))
);

const IconInbox = defineComponent({
  render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" })
  ])
});
const IconSent = defineComponent({
  render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" })
  ])
});
const IconDraft = defineComponent({
  render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
  ])
});
const IconArchive = defineComponent({
  render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" })
  ])
});
const IconTrash = defineComponent({
  render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
  ])
});

const defaultFolderItems = [
  { folder: "inbox", label: "Inbox", icon: IconInbox },
  { folder: "sent", label: "Sent", icon: IconSent },
  { folder: "draft", label: "Drafts", icon: IconDraft },
  { folder: "archive", label: "Archive", icon: IconArchive },
  { folder: "trash", label: "Trash", icon: IconTrash },
];

onMounted(() => {
  folderStore.fetchFolders(route.params.mailboxId as string);
});

const openComposeModal = () => uiStore.openComposeModal();

const createNewFolder = () => {
  const folderName = prompt("Enter a name for the new folder:");
  if (folderName) {
    folderStore.createFolder(route.params.mailboxId as string, folderName);
  }
};
</script>

<style>
/* Nav active state uses CSS variable so it respects branding color */
.nav-active {
  border-left-color: var(--color-primary);
  background-color: rgb(var(--color-primary-rgb) / 0.08);
  color: var(--color-primary);
}
.dark .nav-active {
  background-color: rgb(var(--color-primary-rgb) / 0.15);
}
</style>
