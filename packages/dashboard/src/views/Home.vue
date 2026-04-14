<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Top bar -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div class="max-w-3xl mx-auto px-6 h-12 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img v-if="branding.logoUrl" :src="branding.logoUrl" class="h-6 w-auto object-contain" :alt="branding.appName || 'Email Explorer'" :title="branding.appName || 'Email Explorer'" />
          <template v-else>
            <div class="w-6 h-6 rounded flex items-center justify-center" :style="{ backgroundColor: 'var(--color-primary)' }">
              <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span v-if="!branding.logoUrl" class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ branding.appName || 'Email Explorer' }}</span>
          </template>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{{ authStore.currentUser?.email }}</span>
          <span v-if="authStore.isAdmin" class="text-xs px-1.5 py-0.5 rounded font-medium" :style="{ backgroundColor: 'rgb(var(--color-primary-rgb) / 0.1)', color: 'var(--color-primary)' }">Admin</span>
          <button
            @click="uiStore.toggleDarkMode()"
            class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <svg v-if="uiStore.isDarkMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="text-xs px-2.5 py-1 border rounded transition-colors"
            :style="{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }"
            @mouseover="($event.currentTarget as HTMLElement).style.backgroundColor = 'rgb(var(--color-primary-rgb) / 0.08)'"
            @mouseleave="($event.currentTarget as HTMLElement).style.backgroundColor = ''"
          >
            Admin
          </router-link>
          <button
            @click="handleLogout"
            class="text-xs px-2.5 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-8 w-full flex-1">
      <!-- Section header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mailboxes</h2>
        <button
          v-if="authStore.canCreateMailbox"
          @click="isCreateFormOpen = !isCreateFormOpen"
          class="flex items-center gap-1.5 text-sm px-3 py-1.5 text-white rounded transition-colors"
          :style="{ backgroundColor: 'var(--color-primary)' }"
          @mouseover="($event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Mailbox
        </button>
      </div>

      <!-- Inline create mailbox form -->
      <div v-if="isCreateFormOpen && authStore.canCreateMailbox" class="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Create New Mailbox</span>
          <button @click="closeCreateForm" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleCreateMailbox" class="px-4 py-3">
          <div v-if="createError" class="mb-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-3 py-2">
            {{ createError }}
          </div>
          <div class="flex items-end gap-3">
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                v-model="newMailboxEmail"
                class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none"
                style="--tw-ring-color: var(--color-primary)"
                placeholder="mailbox@example.com"
                required
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Display Name</label>
              <input
                type="text"
                v-model="newMailboxName"
                class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none"
                placeholder="My Mailbox"
                required
              />
            </div>
            <div class="flex items-center gap-2">
              <button
                type="submit"
                :disabled="isCreatingMailbox"
                class="flex items-center gap-1.5 px-4 py-1.5 text-white text-sm rounded transition-colors disabled:opacity-60"
                :style="{ backgroundColor: 'var(--color-primary)' }"
              >
                <svg v-if="isCreatingMailbox" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isCreatingMailbox ? "Creating..." : "Create" }}
              </button>
              <button
                type="button"
                @click="closeCreateForm"
                class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Mailbox list -->
      <div v-if="mailboxes.length > 0" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
        <div
          v-for="mailbox in mailboxes"
          :key="mailbox.id"
          class="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700 group"
        >
          <router-link
            :to="{ name: 'Mailbox', params: { mailboxId: mailbox.id } }"
            class="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            <div class="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" :style="{ backgroundColor: 'var(--color-primary)' }">
              {{ mailbox.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ mailbox.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ mailbox.email }}</p>
            </div>
          </router-link>
          <!-- Delete mailbox (admin or owner) -->
          <template v-if="authStore.isAdmin || authStore.canCreateMailbox">
            <template v-if="deleteMailboxConfirm !== mailbox.id">
              <button
                @click="handleDeleteMailbox(mailbox.id)"
                class="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                Delete
              </button>
            </template>
            <template v-else>
              <button @click="handleDeleteMailbox(mailbox.id)" :disabled="deleteMailboxLoading" class="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded transition-colors disabled:opacity-60">
                {{ deleteMailboxLoading ? '...' : 'Confirm' }}
              </button>
              <button @click="deleteMailboxConfirm = null" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-1.5 py-0.5">Cancel</button>
            </template>
          </template>
          <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-10 text-center">
        <div class="w-10 h-10 rounded flex items-center justify-center mx-auto mb-4" :style="{ backgroundColor: 'rgb(var(--color-primary-rgb) / 0.1)' }">
          <svg class="w-5 h-5" :style="{ color: 'var(--color-primary)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">No mailboxes yet</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Get started by setting up email routing in Cloudflare.</p>
        <a
          href="https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs hover:underline"
          :style="{ color: 'var(--color-primary)' }"
        >
          View Cloudflare Email Routing docs →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppSettings } from "@/composables/useAppSettings";
import { useToast } from "@/composables/useToast";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { useMailboxStore } from "@/stores/mailboxes";
import { useUIStore } from "@/stores/ui";

const router = useRouter();
const mailboxStore = useMailboxStore();
const authStore = useAuthStore();
const uiStore = useUIStore();
const { mailboxes } = storeToRefs(mailboxStore);
const { success: showSuccessToast, error: showErrorToast } = useToast();
const { branding } = useAppSettings();

const isCreateFormOpen = ref(false);
const newMailboxEmail = ref("");
const newMailboxName = ref("");
const isCreatingMailbox = ref(false);
const createError = ref<string | null>(null);
const deleteMailboxConfirm = ref<string | null>(null);
const deleteMailboxLoading = ref(false);

onMounted(() => {
  mailboxStore.fetchMailboxes();
  uiStore.initDarkMode();
});

const closeCreateForm = () => {
  isCreateFormOpen.value = false;
  newMailboxEmail.value = "";
  newMailboxName.value = "";
  createError.value = null;
};

const handleCreateMailbox = async () => {
  createError.value = null;
  if (!newMailboxEmail.value || !newMailboxName.value) {
    createError.value = "Please fill in all fields";
    return;
  }
  isCreatingMailbox.value = true;
  try {
    await api.createMailbox(newMailboxEmail.value, newMailboxName.value);
    showSuccessToast("Mailbox created successfully!");
    closeCreateForm();
    await mailboxStore.fetchMailboxes();
  } catch (e: any) {
    const msg = e.response?.data?.error || "Failed to create mailbox";
    createError.value = msg;
    showErrorToast(msg);
  } finally {
    isCreatingMailbox.value = false;
  }
};

async function handleDeleteMailbox(mailboxId: string) {
  if (deleteMailboxConfirm.value !== mailboxId) {
    deleteMailboxConfirm.value = mailboxId;
    return;
  }
  deleteMailboxLoading.value = true;
  try {
    await api.deleteMailbox(mailboxId);
    await mailboxStore.fetchMailboxes();
    deleteMailboxConfirm.value = null;
  } catch (e: any) {
    showErrorToast(e.response?.data?.error || "Failed to delete mailbox");
  } finally {
    deleteMailboxLoading.value = false;
  }
}

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}
</script>
