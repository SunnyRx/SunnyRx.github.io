export interface WorkLink {
	label: string;
	href: string;
	external?: boolean;
	icon?: string;
}

export interface WorkItem {
	title: string;
	meta?: string;
	summary?: string;
	image?: string;
	imageAlt?: string;
	imageFit?: "cover" | "contain";
	links: WorkLink[];
}

export interface WorkCategory {
	id: string;
	title: string;
	icon: string;
	items: WorkItem[];
}

export const workCategories: WorkCategory[] = [
	{
		id: "games",
		title: "游戏",
		icon: "fa6-solid:gamepad",
		items: [
			{
				title: "拖拖拉拉小菲镇",
				meta: "2025-08-29 · Steam",
				summary:
					"通过拖拽角色推进建设与互动的轻量模拟建设游戏，于 2025 年 8 月登陆 Steam（开发者列表：LuzhangGames）。",
				image: "/img/works/taffy-town.webp",
				imageAlt: "拖拖拉拉小菲镇游戏封面",
				imageFit: "cover",
				links: [
					{
						label: "Steam",
						href: "https://store.steampowered.com/app/3186040/_/",
						external: true,
						icon: "fa6-brands:steam",
					},
				],
			},
			{
				title: "Card Empires",
				meta: "Ludum Dare 51 · Unity / HTML5",
				summary:
					"Ludum Dare 51 期间制作的快节奏策略卡牌原型——每回合仅有十秒，在建设发展与守城防御之间快速取舍。",
				image: "/img/works/card-empires.webp",
				imageAlt: "Card Empires 游戏封面",
				imageFit: "cover",
				links: [
					{
						label: "itch.io",
						href: "https://sunnyrx.itch.io/card-empires",
						external: true,
						icon: "fa6-solid:arrow-up-right-from-square",
					},
				],
			},
			{
				title: "回忆碎片",
				meta: "Ludum Dare 49",
				summary:
					"Ludum Dare 49 参赛平台游戏。玩家扮演失忆少女，在失重空间里探索并逐步找回遗失的记忆。",
				image: "/img/in-post/post-FOM/00.webp",
				imageAlt: "回忆碎片游戏画面",
				imageFit: "cover",
				links: [
					{
						label: "itch.io",
						href: "https://sunnyrx.itch.io/fragments-of-memory",
						external: true,
						icon: "fa6-solid:arrow-up-right-from-square",
					},
					{
						label: "设计复盘",
						href: "/posts/game-design-talk-about-fragments-of-memory/",
						external: false,
						icon: "fa6-solid:book-open",
					},
				],
			},
			{
				title: "异星时劫",
				links: [
					{
						label: "itch.io",
						href: "https://sunnyrx.itch.io/yixingshijie",
						external: true,
					},
					{
						label: "机核网",
						href: "https://www.gcores.com/games/67506",
						external: true,
					},
				],
			},
			{
				title: "Echiod",
				links: [
					{
						label: "GlobalGameJam",
						href: "http://globalgamejam.org/2017/games/echoid",
						external: true,
					},
				],
			},
			{
				title: "Jewel Thief",
				links: [
					{
						label: "itch.io",
						href: "https://sunnyrx.itch.io/jewel-thief",
						external: true,
					},
					{
						label: "App Store（已下架）",
						href: "https://itunes.apple.com/cn/app/jewel-thief-a-entertainment-jewel-catching-game/id1143529803",
						external: true,
					},
				],
			},
			{
				title: "这里没有格林达姆",
				links: [
					{
						label: "Steam",
						href: "https://store.steampowered.com/app/1109460/There_is_No_GreenDam/",
						external: true,
					},
					{
						label: "itch.io",
						href: "https://sunnyrx.itch.io/there-is-no-greendam",
						external: true,
					},
					{
						label: "百度贴吧",
						href: "http://tieba.baidu.com/p/3098681603",
						external: true,
					},
				],
			},
			{
				title: "Last day",
				links: [
					{
						label: "天窗联盟",
						href: "https://doujin.bgm.tv/blog/42460",
						external: true,
					},
				],
			},
			{
				title: "Kreuz Skelett Mann:saligiare",
				links: [
					{
						label: "天窗联盟",
						href: "https://doujin.bgm.tv/blog/34948",
						external: true,
					},
				],
			},
		],
	},
	{
		id: "tools",
		title: "工具",
		icon: "fa6-solid:wrench",
		items: [
			{
				title: "专注女仆（Focus Maid）",
				meta: "AI IDE · 番茄钟",
				summary:
					"使用 AI IDE 制作的番茄钟与专注辅助工具，以更轻松的界面陪伴日常专注时段。",
				image: "/img/works/focus-maid.webp",
				imageAlt: "专注女仆应用界面",
				imageFit: "contain",
				links: [
					{
						label: "GitHub",
						href: "https://github.com/SunnyRx/focus-maid",
						external: true,
						icon: "fa6-brands:github",
					},
					{
						label: "开发介绍",
						href: "/posts/focus-maid/",
						external: false,
						icon: "fa6-solid:book-open",
					},
				],
			},
			{
				title: "Weread2Discord",
				links: [
					{
						label: "GitHub",
						href: "https://github.com/SunnyRx/weread2discord",
						external: true,
					},
				],
			},
			{
				title: "骰子模拟器",
				links: [
					{
						label: "Google Play",
						href: "https://play.google.com/store/apps/details?id=ord.gd136.soft.diceSim",
						external: true,
					},
				],
			},
		],
	},
	{
		id: "video",
		title: "视频",
		icon: "fa6-solid:film",
		items: [
			{
				title: "绿坝娘大事记",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/av100499/",
						external: true,
					},
				],
			},
		],
	},
	{
		id: "drama",
		title: "广播剧",
		icon: "fa6-solid:headphones",
		items: [
			{
				title: "【苍绿祭】拉手两年 永恒约定~Greendam Forever 第1话",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/av99537/",
						external: true,
					},
				],
			},
			{
				title: "【苍绿祭】拉手两年 永恒约定~Greendam Forever 第2话",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/av283431/",
						external: true,
					},
				],
			},
			{
				title: "【苍绿祭】拉手两年 永恒约定~Greendam Forever 第3话",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/av599462/",
						external: true,
					},
				],
			},
			{
				title: "【苍绿祭】拉手两年 永恒约定~Greendam Forever 第4话",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/av1197210/",
						external: true,
					},
				],
			},
			{
				title: "【苍绿祭】小绿日常的一天",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/av283442/",
						external: true,
					},
				],
			},
		],
	},
	{
		id: "music",
		title: "歌曲",
		icon: "fa6-solid:music",
		items: [
			{
				title: "【苍绿祭】我才不说喜欢你",
				links: [
					{
						label: "YouTube",
						href: "https://www.youtube.com/watch?v=MhhkmeUa3oA",
						external: true,
					},
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/BV1ps411v7Cd",
						external: true,
					},
				],
			},
			{
				title: "【漫研社十周年】初心·拾终如一",
				links: [
					{
						label: "bilibili",
						href: "https://www.bilibili.com/video/BV1EJ41147wr",
						external: true,
					},
				],
			},
		],
	},
	{
		id: "models",
		title: "模型",
		icon: "fa6-solid:cube",
		items: [
			{
				title: "【苍绿祭】原创 3D 模型「绿坝娘」(GreenDam)",
				links: [
					{
						label: "BOOTH",
						href: "https://sunnyrx.booth.pm/items/2348604",
						external: true,
					},
				],
			},
			{
				title: "原创 3D 模型「マリちゃん」(marichan)",
				links: [
					{
						label: "BOOTH",
						href: "https://fairysteaparty.booth.pm/items/5585204",
						external: true,
					},
				],
			},
		],
	},
];
