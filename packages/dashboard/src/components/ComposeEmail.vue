<template>
  <transition name="compose-slide">
    <div
      v-if="uiStore.isComposeOpen"
      class="fixed bottom-0 right-6 w-[520px] z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-0 rounded-t shadow-lg flex flex-col"
      :style="uiStore.isComposeMinimized ? 'height: 40px; overflow: hidden' : 'height: 480px'"
    >
      <!-- Panel header -->
      <div
        class="flex items-center justify-between px-3 py-2 bg-gray-700 dark:bg-gray-900 text-white flex-shrink-0 cursor-pointer select-none"
        @click="uiStore.isComposeMinimized = !uiStore.isComposeMinimized"
      >
        <span class="text-sm font-medium">{{ modalTitle }}</span>
        <div class="flex items-center gap-1" @click.stop>
          <button
            @click="uiStore.isComposeMinimized = !uiStore.isComposeMinimized"
            class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
            :title="uiStore.isComposeMinimized ? 'Expand' : 'Minimize'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="uiStore.isComposeMinimized" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            @click="closeModal"
            class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
            title="Close"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="send" class="flex flex-col flex-1 overflow-hidden">
        <!-- Error -->
        <div v-if="error" class="px-3 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </div>

        <!-- Fields -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center border-b border-gray-100 dark:border-gray-700">
            <label class="text-xs text-gray-400 dark:text-gray-500 w-14 px-3 flex-shrink-0">To</label>
            <input
              type="email"
              v-model="to"
              class="flex-1 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="recipient@example.com"
              required
            />
          </div>
          <div class="flex items-center">
            <label class="text-xs text-gray-400 dark:text-gray-500 w-14 px-3 flex-shrink-0">Subject</label>
            <input
              type="text"
              v-model="subject"
              class="flex-1 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Subject"
              required
            />
          </div>
        </div>

        <!-- Body editor -->
        <div class="flex-1 overflow-hidden">
          <RichTextEditor v-model="body" class="h-full" border-less />
        </div>

        <!-- Send bar -->
        <div class="flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex-shrink-0">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-60"
          >
            <svg v-if="!isLoading" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? "Sending..." : "Send" }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/composables/useToast";
import api from "@/services/api";
import { useEmailStore } from "@/stores/emails";
import { useMailboxStore } from "@/stores/mailboxes";
import { useUIStore } from "@/stores/ui";
import RichTextEditor from "./RichTextEditor.vue";

const uiStore = useUIStore();
const { composeOptions } = storeToRefs(uiStore);
const emailStore = useEmailStore();
const mailboxStore = useMailboxStore();
const { currentMailbox } = storeToRefs(mailboxStore);
const route = useRoute();
const { success: showSuccessToast, error: showErrorToast } = useToast();

const to = ref("");
const subject = ref("");
const body = ref("");
const error = ref<string | null>(null);
const isLoading = ref(false);

const modalTitle = computed(() => {
  switch (composeOptions.value.mode) {
    case "reply": return "Reply";
    case "reply-all": return "Reply All";
    case "forward": return "Forward";
    default: return "New Message";
  }
});

const getSignatureBlock = (): string => {
  const sig = currentMailbox.value?.settings?.signature;
  if (sig?.enabled && (sig?.html || sig?.text)) {
    const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const content = sig.html || escapeHtml(sig.text);
    return `<div style="border-top: 1px solid #ccc; margin-top: 16px; padding-top: 12px;">${content}</div>`;
  }
  return "";
};

const closeModal = () => {
  error.value = null;
  to.value = "";
  subject.value = "";
  body.value = "";
  uiStore.closeComposeModal();
};

watch(() => uiStore.isComposeOpen, (isOpen) => {
  if (isOpen) {
    const options = composeOptions.value;
    const original = options.originalEmail;
    const sigBlock = getSignatureBlock();

    if (options.mode === "reply" && original) {
      to.value = original.sender;
      subject.value = original.subject.startsWith("Re: ") ? original.subject : `Re: ${original.subject}`;
      body.value = `<br>${sigBlock}<br><blockquote style="border-left: 2px solid #ccc; margin: 0; padding-left: 1em; color: #666;">On ${original.date}, ${original.sender} wrote:<br><br>${original.body}</blockquote>`;
    } else if (options.mode === "reply-all" && original) {
      const recipients = new Set([original.sender]);
      if (original.recipient && original.recipient !== currentMailbox.value?.email) {
        recipients.add(original.recipient);
      }
      to.value = Array.from(recipients).join(", ");
      subject.value = original.subject.startsWith("Re: ") ? original.subject : `Re: ${original.subject}`;
      body.value = `<br>${sigBlock}<br><blockquote style="border-left: 2px solid #ccc; margin: 0; padding-left: 1em; color: #666;">On ${original.date}, ${original.sender} wrote:<br><br>${original.body}</blockquote>`;
    } else if (options.mode === "forward" && original) {
      to.value = "";
      subject.value = original.subject.startsWith("Fwd: ") ? original.subject : `Fwd: ${original.subject}`;
      body.value = `<br>${sigBlock}<br><div style="border: 1px solid #ddd; padding: 1em; background-color: #f9f9f9; margin: 1em 0;"><strong>Forwarded message:</strong><br><strong>From:</strong> ${original.sender}<br><strong>Date:</strong> ${original.date}<br><strong>Subject:</strong> ${original.subject}<br><br>${original.body}</div>`;
    } else {
      to.value = "";
      subject.value = "";
      body.value = sigBlock ? `<br><br>${sigBlock}` : "";
    }
  }
});

const htmlToPlainText = (html: string): string => {
  const div = document.createElement("div");
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n");
  div.innerHTML = text;
  return (div.textContent || div.innerText || "").trim();
};

const send = async () => {
  error.value = null;
  if (!currentMailbox.value) { error.value = "No mailbox selected."; return; }
  isLoading.value = true;
  try {
    const mailboxId = route.params.mailboxId as string;
    const emailData = { to: to.value, from: currentMailbox.value.email, subject: subject.value, html: body.value, text: htmlToPlainText(body.value) };
    if (composeOptions.value.mode === "reply" || composeOptions.value.mode === "reply-all") {
      const id = composeOptions.value.originalEmail?.id;
      if (!id) throw new Error("Original email not found");
      await api.replyToEmail(mailboxId, id, emailData);
    } else if (composeOptions.value.mode === "forward") {
      const id = composeOptions.value.originalEmail?.id;
      if (!id) throw new Error("Original email not found");
      await api.forwardEmail(mailboxId, id, emailData);
    } else {
      await emailStore.sendEmail(mailboxId, emailData);
    }
    closeModal();
    showSuccessToast("Email sent successfully!");
  } catch (e: any) {
    const msg = e.response?.data?.error || "An unexpected error occurred.";
    error.value = msg;
    showErrorToast(msg);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.compose-slide-enter-active,
.compose-slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.compose-slide-enter-from,
.compose-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
