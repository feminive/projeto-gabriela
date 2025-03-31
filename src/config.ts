import type {
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Feminive Fanfics 🌸 O prazer feminino",
	subtitle:
		"Explore os melhores contos eróticos focados no prazer feminino, repletos de paixão, desejo e fantasias irresistíveis para apimentar sua imaginação.",
	lang: "pt-BR", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 360, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "dddd", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: false, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		//Leave this array empty to use the default favicon
		{
			src: "/favicon/favicon.png", // Path of the favicon, relative to the /public directory
			// 	theme: "light", // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			// 	sizes: "32x32", // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Blog,
		{
			name: "Instagram",
			url: "https://www.instagram.com/feminivefanfics/", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/perfil.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Feminive Fanfics",
	bio: "Escritora de Contos Eróticos e outras coisas duvidosas em seu tempo vago.",
	links: [
		{
			name: "",
			icon: "fa6-brands:instagram", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://instagram.com/feminivefanfics",
		},
		{
			name: "",
			icon: "lucide:mail", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "mailto:contos@www.feminivefanfics.com.br",
		},
		{
			name: "",
			icon: "fa6-brands:whatsapp", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://wa.me/5521967867385?text=Oi,%20eu%20cliquei%20no%20link%20do%20site%20e%20vim%20até%20aqui!",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
