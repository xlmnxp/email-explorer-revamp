import { readonly, ref } from "vue";
import api from "@/services/api";

export interface Branding {
	appName?: string;
	primaryColor?: string;
	logoUrl?: string;
}

interface AppSettings {
	auth: {
		enabled: boolean;
		registerEnabled: boolean;
	};
	accountRecovery: {
		enabled: boolean;
	};
	branding?: Branding;
}

const settings = ref<AppSettings | null>(null);
const branding = ref<Branding>({});
const isLoading = ref(false);
const error = ref<string | null>(null);

// Convert hex color to slightly darker shade for hover states
function darkenHex(hex: string, amount = 15): string {
	const num = parseInt(hex.replace("#", ""), 16);
	const r = Math.max(0, (num >> 16) - amount);
	const g = Math.max(0, ((num >> 8) & 0xff) - amount);
	const b = Math.max(0, (num & 0xff) - amount);
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Convert hex to rgb components for opacity utilities
function hexToRgb(hex: string): string {
	const num = parseInt(hex.replace("#", ""), 16);
	const r = (num >> 16) & 255;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return `${r} ${g} ${b}`;
}

export function applyBranding(b: Branding) {
	const root = document.documentElement;
	const color = b.primaryColor || "#4f46e5";
	root.style.setProperty("--color-primary", color);
	root.style.setProperty("--color-primary-hover", darkenHex(color));
	root.style.setProperty("--color-primary-rgb", hexToRgb(color));
}

export function useAppSettings() {
	const fetchSettings = async () => {
		isLoading.value = true;
		error.value = null;
		try {
			const response = await api.getAppSettings();
			settings.value = response.data;
			if (response.data.branding) {
				branding.value = response.data.branding;
				applyBranding(response.data.branding);
			}
		} catch (e: any) {
			error.value = e.message || "Failed to fetch app settings";
			console.error("Failed to fetch app settings:", e);
		} finally {
			isLoading.value = false;
		}
	};

	const isRegistrationEnabled = () => {
		return settings.value?.auth.registerEnabled ?? false;
	};

	const isAccountRecoveryEnabled = () => {
		return settings.value?.accountRecovery.enabled ?? false;
	};

	return {
		settings: readonly(settings),
		branding: readonly(branding),
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchSettings,
		isRegistrationEnabled,
		isAccountRecoveryEnabled,
	};
}
