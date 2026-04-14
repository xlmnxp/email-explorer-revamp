<template>
  <div v-if="email" class="flex flex-col h-full bg-white dark:bg-gray-800">
    <!-- Toolbar -->
    <div class="flex items-center gap-1 px-4 h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex-shrink-0">
      <!-- Back -->
      <button
        @click="router.back()"
        class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        title="Back"
      >
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <!-- Reply -->
      <button @click="handleReply" class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Reply">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <button @click="handleReplyAll" class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Reply All">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      </button>
      <button @click="handleForward" class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" title="Forward">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <!-- Read toggle -->
      <button @click="toggleReadStatus" class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" :title="email.read ? 'Mark unread' : 'Mark read'">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      <!-- Star toggle -->
      <button @click="toggleStarStatus" class="w-7 h-7 flex items-center justify-center rounded transition-colors" :class="email.starred ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'" :title="email.starred ? 'Unstar' : 'Star'">
        <svg v-if="email.starred" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      <!-- Move to folder inline select -->
      <div class="flex items-center gap-1 ml-1">
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        <select
          @change="handleMoveSelect"
          class="text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
        >
          <option value="">Move to...</option>
          <option v-for="folder in moveToFolders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
        </select>
      </div>

      <!-- Delete -->
      <div class="ml-auto">
        <div v-if="showDeleteConfirm" class="flex items-center gap-1.5">
          <span class="text-xs text-red-600 dark:text-red-400">Delete?</span>
          <button @click="confirmDelete" class="px-2 py-0.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Yes</button>
          <button @click="showDeleteConfirm = false" class="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">No</button>
        </div>
        <button
          v-else
          @click="showDeleteConfirm = true"
          class="w-7 h-7 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Delete"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Email header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <h1 class="text-base font-semibold text-gray-900 dark:text-white mb-3">{{ email.subject }}</h1>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {{ email.sender.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ email.sender }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">To: {{ email.recipient }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ email.date }}</p>
      </div>
    </div>

    <!-- Email body -->
    <div class="flex-1 overflow-y-auto">
      <EmailIframe :body="emailBodyWithInlineImages" />
    </div>

    <!-- Attachments -->
    <div v-if="email.attachments && email.attachments.length > 0" class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/80">
      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Attachments ({{ email.attachments.length }})</p>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="attachment in email.attachments"
          :key="attachment.id"
          :href="getAttachmentUrl(attachment.id)"
          target="_blank"
          class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          :title="attachment.filename"
        >
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span class="truncate max-w-[140px]">{{ attachment.filename }}</span>
          <span class="text-gray-400 dark:text-gray-500 flex-shrink-0">{{ formatBytes(attachment.size) }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import EmailIframe from "@/components/EmailIframe.vue";
import { useEmailStore } from "@/stores/emails";
import { useFolderStore } from "@/stores/folders";
import { useUIStore } from "@/stores/ui";

const emailStore = useEmailStore();
const { currentEmail: email } = storeToRefs(emailStore);
const folderStore = useFolderStore();
const { folders } = storeToRefs(folderStore);
const uiStore = useUIStore();
const route = useRoute();
const router = useRouter();

const showDeleteConfirm = ref(false);

const moveToFolders = computed(() => {
  const fromFolder = route.query.fromFolder as string;
  return folders.value.filter((folder) => folder.id !== fromFolder);
});

const emailBodyWithInlineImages = computed(() => {
  if (!email.value?.body) return "";
  let body = email.value.body;
  if (email.value.attachments?.length) {
    for (const attachment of email.value.attachments) {
      if (attachment.disposition === "inline" && attachment.content_id) {
        const url = getAttachmentUrl(attachment.id);
        const cid = attachment.content_id.startsWith("<")
          ? attachment.content_id.slice(1, -1)
          : attachment.content_id;
        body = body.replace(new RegExp(`cid:${cid}`, "g"), url);
      }
    }
  }
  return body;
});

const getAttachmentUrl = (attachmentId: string) => {
  const mailboxId = route.params.mailboxId as string;
  const emailId = route.params.id as string;
  return `/api/v1/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attachmentId}`;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

onMounted(async () => {
  const mailboxId = route.params.mailboxId as string;
  const emailId = route.params.id as string;
  await emailStore.fetchEmail(mailboxId, emailId);
  folderStore.fetchFolders(mailboxId);
  if (email.value && !email.value.read) {
    emailStore.updateEmail(mailboxId, emailId, { read: true });
  }
});

const toggleReadStatus = () => {
  if (email.value) {
    emailStore.updateEmail(route.params.mailboxId as string, email.value.id, { read: !email.value.read });
  }
};

const toggleStarStatus = () => {
  if (email.value) {
    emailStore.updateEmail(route.params.mailboxId as string, email.value.id, { starred: !email.value.starred });
  }
};

const handleMoveSelect = (event: Event) => {
  const folderId = (event.target as HTMLSelectElement).value;
  if (folderId && email.value) {
    emailStore.moveEmail(route.params.mailboxId as string, email.value.id, folderId);
    router.back();
  }
  (event.target as HTMLSelectElement).value = "";
};

const confirmDelete = () => {
  if (email.value) {
    emailStore.deleteEmail(route.params.mailboxId as string, email.value.id);
    router.push({ name: "EmailList", params: { mailboxId: route.params.mailboxId, folder: "inbox" } });
  }
};

const handleReply = () => {
  if (email.value) uiStore.openComposeModal({ mode: "reply", originalEmail: email.value });
};
const handleReplyAll = () => {
  if (email.value) uiStore.openComposeModal({ mode: "reply-all", originalEmail: email.value });
};
const handleForward = () => {
  if (email.value) uiStore.openComposeModal({ mode: "forward", originalEmail: email.value });
};
</script>
