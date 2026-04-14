import { defineStore } from "pinia";

export type ComposeMode = "new" | "reply" | "reply-all" | "forward";

export interface ComposeOptions {
	mode: ComposeMode;
	originalEmail?: any;
}

export const useUIStore = defineStore("ui", {
	state: () => ({
		isComposeOpen: false,
		isComposeMinimized: false,
		composeOptions: {
			mode: "new" as ComposeMode,
			originalEmail: null,
		} as ComposeOptions,
		isDarkMode: localStorage.getItem("darkMode") !== null
			? localStorage.getItem("darkMode") === "true"
			: window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
	}),
	actions: {
		openComposeModal(options?: ComposeOptions) {
			this.composeOptions = options || { mode: "new", originalEmail: null };
			this.isComposeOpen = true;
			this.isComposeMinimized = false;
		},
		closeComposeModal() {
			this.isComposeOpen = false;
			this.isComposeMinimized = false;
			this.composeOptions = { mode: "new", originalEmail: null };
		},
		toggleDarkMode() {
			this.isDarkMode = !this.isDarkMode;
			localStorage.setItem("darkMode", String(this.isDarkMode));
			if (this.isDarkMode) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		},
		initDarkMode() {
			if (this.isDarkMode) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		},
	},
	getters: {
		isComposeModalOpen: (state) => state.isComposeOpen,
	},
});
