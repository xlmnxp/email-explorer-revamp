<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top bar -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
        <h1 class="text-base font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
        <router-link to="/" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          ← Back to Home
        </router-link>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-6 space-y-6">

      <!-- Branding Section -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Branding</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize the app name, logo, and primary color</p>
        </div>
        <form @submit.prevent="saveBranding" class="px-4 py-4 space-y-4">
          <div v-if="brandingError" class="text-xs text-red-600 dark:text-red-400">{{ brandingError }}</div>
          <div v-if="brandingSuccess" class="text-xs text-green-600 dark:text-green-400">{{ brandingSuccess }}</div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- App Name -->
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">App Name</label>
              <input
                v-model="brandingForm.appName"
                type="text"
                class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="Email Explorer"
              />
            </div>

            <!-- Primary Color -->
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Primary Color</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="brandingForm.primaryColor"
                  type="color"
                  class="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5 bg-white dark:bg-gray-700"
                />
                <input
                  v-model="brandingForm.primaryColor"
                  type="text"
                  class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 font-mono"
                  placeholder="#4f46e5"
                  pattern="^#[0-9a-fA-F]{6}$"
                />
                <div class="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 flex-shrink-0" :style="{ backgroundColor: brandingForm.primaryColor || 'var(--color-primary)' }"></div>
              </div>
            </div>
          </div>

          <!-- Logo URL -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Logo URL</label>
            <div class="flex items-center gap-3">
              <input
                v-model="brandingForm.logoUrl"
                type="url"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="https://example.com/logo.png"
              />
              <img
                v-if="brandingForm.logoUrl"
                :src="brandingForm.logoUrl"
                class="h-8 w-auto max-w-[80px] object-contain border border-gray-200 dark:border-gray-600 rounded p-1 bg-white"
                alt="Logo preview"
                @error="logoPreviewError = true"
              />
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Shown in sidebar and login page. Use a transparent PNG for best results.</p>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <button
              type="submit"
              :disabled="brandingLoading"
              class="px-4 py-1.5 text-sm text-white rounded transition-colors disabled:opacity-60"
              :style="{ backgroundColor: 'var(--color-primary)' }"
            >
              {{ brandingLoading ? 'Saving...' : 'Save Branding' }}
            </button>
            <button
              type="button"
              @click="resetBranding"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset to defaults
            </button>
          </div>
        </form>
      </section>

      <!-- Register New User -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Register New User</h2>
        </div>
        <form @submit.prevent="handleRegisterUser" class="px-4 py-4">
          <div v-if="registerError" class="mb-3 text-xs text-red-600 dark:text-red-400">{{ registerError }}</div>
          <div v-if="registerSuccess" class="mb-3 text-xs text-green-600 dark:text-green-400">{{ registerSuccess }}</div>
          <div class="flex items-end gap-3">
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <input v-model="newUser.email" type="email" required class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none" placeholder="user@example.com" />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Password</label>
              <input v-model="newUser.password" type="password" required minlength="8" class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none" placeholder="Min 8 characters" />
            </div>
            <button type="submit" :disabled="registerLoading" class="px-4 py-1.5 text-sm text-white rounded transition-colors disabled:opacity-60" :style="{ backgroundColor: 'var(--color-primary)' }">
              {{ registerLoading ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Users List -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Users</h2>
          <button @click="loadUsers" :disabled="usersLoading" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50">
            {{ usersLoading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>

        <div v-if="usersLoading && users.length === 0" class="px-4 py-6 text-sm text-gray-400 text-center">Loading users...</div>
        <div v-else-if="users.length === 0" class="px-4 py-6 text-sm text-gray-400 text-center">No users found</div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="user in users" :key="user.id">
            <!-- User row -->
            <div
              class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              @click="toggleUserExpand(user.id)"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 dark:text-gray-100 truncate">{{ user.email }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(user.createdAt) }}</p>
              </div>
              <span class="text-xs px-1.5 py-0.5 rounded font-medium" :class="user.isAdmin ? '' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'" :style="user.isAdmin ? { backgroundColor: 'rgb(var(--color-primary-rgb) / 0.1)', color: 'var(--color-primary)' } : {}">
                {{ user.isAdmin ? 'Admin' : 'User' }}
              </span>
              <!-- Delete user (hidden for admins) -->
              <template v-if="!user.isAdmin">
                <button
                  v-if="deleteUserConfirm !== user.id"
                  @click.stop="handleDeleteUser(user)"
                  class="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete user"
                >
                  Delete
                </button>
                <template v-else>
                  <button @click.stop="handleDeleteUser(user)" :disabled="deleteUserLoading" class="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded transition-colors disabled:opacity-60">
                    {{ deleteUserLoading ? '...' : 'Confirm' }}
                  </button>
                  <button @click.stop="deleteUserConfirm = null" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-1.5 py-0.5">Cancel</button>
                </template>
              </template>
              <svg class="w-4 h-4 text-gray-400 transition-transform" :class="expandedUserId === user.id ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Inline access management panel -->
            <div v-if="expandedUserId === user.id" class="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Manage Access — {{ user.email }}</p>

              <!-- Permissions (hidden for admins — they always have full access) -->
              <div v-if="!user.isAdmin" class="mb-4 flex items-center gap-3">
                <span class="text-xs text-gray-600 dark:text-gray-300">Can create mailboxes</span>
                <button
                  type="button"
                  :disabled="permissionLoading === user.id"
                  @click="toggleCanCreateMailbox(user)"
                  class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 disabled:opacity-50"
                  :style="{ backgroundColor: user.canCreateMailbox ? 'var(--color-primary)' : '#d1d5db' }"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"
                    :class="user.canCreateMailbox ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
                <span class="text-xs" :class="user.canCreateMailbox ? '' : 'text-gray-400'" :style="user.canCreateMailbox ? { color: 'var(--color-primary)' } : {}">
                  {{ user.canCreateMailbox ? 'Allowed' : 'Denied' }}
                </span>
              </div>

              <div v-if="accessError" class="mb-2 text-xs text-red-600 dark:text-red-400">{{ accessError }}</div>
              <div v-if="accessSuccess" class="mb-2 text-xs text-green-600 dark:text-green-400">{{ accessSuccess }}</div>
              <form @submit.prevent="() => handleGrantAccess(user)" class="flex items-end gap-2 flex-wrap">
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mailbox ID</label>
                  <input v-model="accessForm.mailboxId" type="text" required class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none w-52" placeholder="user@example.com" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Role</label>
                  <select v-model="accessForm.role" class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none">
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="write">Write</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                <button type="submit" :disabled="accessLoading" class="px-3 py-1.5 text-sm text-white rounded transition-colors disabled:opacity-60" :style="{ backgroundColor: 'var(--color-primary)' }">
                  Grant
                </button>
                <button type="button" @click="() => handleRevokeAccess(user)" :disabled="accessLoading || !accessForm.mailboxId" class="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-60">
                  Revoke
                </button>
              </form>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Owner · Admin · Write · Read — ordered by permission level</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppSettings, applyBranding } from "@/composables/useAppSettings";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  canCreateMailbox: boolean;
  createdAt: number;
  updatedAt: number;
}

const router = useRouter();
const authStore = useAuthStore();
const { branding } = useAppSettings();

if (!authStore.isAdmin) router.push("/");

// Branding state
const brandingForm = ref({
  appName: branding.value.appName || "",
  primaryColor: branding.value.primaryColor || "#4f46e5",
  logoUrl: branding.value.logoUrl || "",
});
const brandingLoading = ref(false);
const brandingError = ref("");
const brandingSuccess = ref("");
const logoPreviewError = ref(false);

// Register state
const newUser = ref({ email: "", password: "" });
const registerLoading = ref(false);
const registerError = ref("");
const registerSuccess = ref("");

// Users state
const users = ref<User[]>([]);
const usersLoading = ref(false);
const expandedUserId = ref<string | null>(null);

// Access state
const accessForm = ref({ mailboxId: "", role: "read" });
const accessLoading = ref(false);
const accessError = ref("");
const accessSuccess = ref("");

// Permission toggle state
const permissionLoading = ref<string | null>(null);

// Delete user state
const deleteUserConfirm = ref<string | null>(null);
const deleteUserLoading = ref(false);

onMounted(() => {
  loadUsers();
  // Sync form with loaded branding
  brandingForm.value = {
    appName: branding.value.appName || "",
    primaryColor: branding.value.primaryColor || "#4f46e5",
    logoUrl: branding.value.logoUrl || "",
  };
});

async function saveBranding() {
  brandingLoading.value = true;
  brandingError.value = "";
  brandingSuccess.value = "";
  try {
    await api.updateBranding(brandingForm.value);
    applyBranding(brandingForm.value);
    brandingSuccess.value = "Branding saved successfully!";
  } catch (e: any) {
    brandingError.value = e.response?.data?.error || "Failed to save branding";
  } finally {
    brandingLoading.value = false;
  }
}

function resetBranding() {
  brandingForm.value = { appName: "", primaryColor: "#4f46e5", logoUrl: "" };
}

async function handleRegisterUser() {
  registerLoading.value = true;
  registerError.value = "";
  registerSuccess.value = "";
  try {
    await api.adminRegisterUser(newUser.value.email, newUser.value.password);
    registerSuccess.value = `User ${newUser.value.email} created successfully!`;
    newUser.value = { email: "", password: "" };
    await loadUsers();
  } catch (e: any) {
    registerError.value = e.response?.data?.error || "Failed to create user";
  } finally {
    registerLoading.value = false;
  }
}

async function loadUsers() {
  usersLoading.value = true;
  try {
    const response = await api.adminListUsers();
    users.value = response.data;
  } catch (e) {
    console.error("Failed to load users:", e);
  } finally {
    usersLoading.value = false;
  }
}

function toggleUserExpand(userId: string) {
  expandedUserId.value = expandedUserId.value === userId ? null : userId;
  accessForm.value = { mailboxId: "", role: "read" };
  accessError.value = "";
  accessSuccess.value = "";
}

async function handleGrantAccess(user: User) {
  accessLoading.value = true;
  accessError.value = "";
  accessSuccess.value = "";
  try {
    await api.adminGrantAccess(user.id, accessForm.value.mailboxId, accessForm.value.role);
    accessSuccess.value = "Access granted!";
    accessForm.value.mailboxId = "";
  } catch (e: any) {
    accessError.value = e.response?.data?.error || "Failed to grant access";
  } finally {
    accessLoading.value = false;
  }
}

async function handleDeleteUser(user: User) {
  if (deleteUserConfirm.value !== user.id) {
    deleteUserConfirm.value = user.id;
    return;
  }
  deleteUserLoading.value = true;
  try {
    await api.adminDeleteUser(user.id);
    users.value = users.value.filter((u) => u.id !== user.id);
    deleteUserConfirm.value = null;
    if (expandedUserId.value === user.id) expandedUserId.value = null;
  } catch (e: any) {
    console.error("Failed to delete user:", e);
  } finally {
    deleteUserLoading.value = false;
  }
}

async function toggleCanCreateMailbox(user: User) {
  permissionLoading.value = user.id;
  try {
    await api.adminUpdateUser(user.id, { canCreateMailbox: !user.canCreateMailbox });
    user.canCreateMailbox = !user.canCreateMailbox;
  } catch (e: any) {
    console.error("Failed to update permission:", e);
  } finally {
    permissionLoading.value = null;
  }
}

async function handleRevokeAccess(user: User) {
  if (!accessForm.value.mailboxId) return;
  accessLoading.value = true;
  accessError.value = "";
  accessSuccess.value = "";
  try {
    await api.adminRevokeAccess(user.id, accessForm.value.mailboxId);
    accessSuccess.value = "Access revoked!";
    accessForm.value.mailboxId = "";
  } catch (e: any) {
    accessError.value = e.response?.data?.error || "Failed to revoke access";
  } finally {
    accessLoading.value = false;
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
</script>
