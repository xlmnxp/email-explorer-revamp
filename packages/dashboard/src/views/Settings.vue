<template>
  <div class="h-full bg-white dark:bg-gray-800">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Settings</h1>
    </div>

    <div v-if="mailbox" class="max-w-xl px-6 py-4">
      <form @submit.prevent="updateSettings" class="space-y-5">
        <!-- Name -->
        <div>
          <label for="name" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Display Name</label>
          <input
            type="text"
            id="name"
            v-model="mailbox.name"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
          />
        </div>

        <!-- Email (readonly) -->
        <div>
          <label for="email" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="mailbox.email"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded cursor-not-allowed"
            disabled
          />
        </div>

        <!-- Signature section -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Email Signature</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Appended to outgoing emails</p>
            </div>
            <!-- Toggle switch -->
            <button
              type="button"
              @click="signatureEnabled = !signatureEnabled"
              class="relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none"
              :style="{ backgroundColor: signatureEnabled ? 'var(--color-primary)' : '' }"
              :class="signatureEnabled ? '' : 'bg-gray-300 dark:bg-gray-600'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                :class="signatureEnabled ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>
          <div v-if="signatureEnabled">
            <RichTextEditor v-model="signatureHtml" :border-less="false" />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            class="px-4 py-1.5 text-white text-sm rounded transition-colors"
            :style="{ backgroundColor: 'var(--color-primary)' }"
            @mouseover="($event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'"
            @mouseleave="($event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import RichTextEditor from "@/components/RichTextEditor.vue";
import { useMailboxStore } from "@/stores/mailboxes";

const mailboxStore = useMailboxStore();
const { currentMailbox: mailbox } = storeToRefs(mailboxStore);
const route = useRoute();

const signatureEnabled = ref(false);
const signatureHtml = ref("");

watch(
  mailbox,
  (m) => {
    if (m?.settings?.signature) {
      signatureEnabled.value = m.settings.signature.enabled;
      signatureHtml.value = m.settings.signature.html || m.settings.signature.text || "";
    }
  },
  { immediate: true },
);

onMounted(() => {
  mailboxStore.fetchMailbox(route.params.mailboxId as string);
});

const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const updateSettings = () => {
  if (mailbox.value) {
    const settings = {
      ...mailbox.value.settings,
      signature: {
        enabled: signatureEnabled.value,
        text: stripHtml(signatureHtml.value),
        html: signatureHtml.value,
      },
    };
    mailboxStore.updateMailbox(route.params.mailboxId as string, settings);
  }
};
</script>
