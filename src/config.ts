import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Weekend",
	subtitle: "热心的博客",
	lang: "zh_CN",
	themeColor: {
		hue: 205,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "/img/home-bg.webp",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		{
			src: "/img/favicon.ico",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "Works",
			url: "/works/",
		},
		{
			name: "Tools",
			url: "/tools/",
		},
		LinkPreset.About,
		{
			name: "日本語",
			url: "/ja/",
		},
		{
			name: "GitHub",
			url: "https://github.com/SunnyRx",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/img/avatar-rx.webp",
	name: "热心人士 (SunnyRx)",
	bio: "热爱生活和追梦的魔法师。傻傻的，就是想做自己想做的事情。",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter",
			url: "https://twitter.com/SunnyRx",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/id/SunnyRx/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/SunnyRx",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-ND 4.0",
	url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
