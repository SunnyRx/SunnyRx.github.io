export interface ToolItem {
	name: string;
	monogram: string;
	description: string;
	href: string;
	linkLabel: string;
	subtag?: string;
	wide?: boolean;
}

export interface ToolCategory {
	id: string;
	title: string;
	icon: string;
	items: ToolItem[];
}

export const toolCategories: ToolCategory[] = [
	{
		id: "life",
		title: "生活",
		icon: "fa6-solid:mug-hot",
		items: [
			{
				name: "记账城市",
				monogram: "记",
				description: "游戏化记账App",
				href: "https://fortunecityapp.com/",
				linkLabel: "访问官网",
			},
			{
				name: "Sleep Cycle",
				monogram: "SC",
				description: "每天用的闹钟，同时也是睡眠质量监控好帮手",
				href: "https://www.sleepcycle.com/",
				linkLabel: "访问官网",
			},
			{
				name: "MoneyForward",
				monogram: "MF",
				description:
					"日本的一个自动追踪财务情况的平台。支持绑定银行卡、信用卡和证券账户等，自动记账很方便。",
				href: "https://moneyforward.com/",
				linkLabel: "访问官网",
				wide: true,
			},
		],
	},
	{
		id: "brainstorm",
		title: "头脑风暴",
		icon: "fa6-solid:lightbulb",
		items: [
			{
				name: "MapNote（无限笔记）",
				monogram: "MN",
				description:
					"iOS App，无限大的画布任写，iPad上配合Apple Pencil使用效果更佳",
				href: "https://itunes.apple.com/cn/app/map-note-infinity-size-note/id1013469088#?platform=ipad",
				linkLabel: "App Store",
			},
			{
				name: "coggle",
				monogram: "Cg",
				description: "在线思维导图，支持多人协作",
				href: "https://coggle.it/",
				linkLabel: "访问官网",
			},
		],
	},
	{
		id: "notes",
		title: "笔记",
		icon: "fa6-solid:book-open",
		items: [
			{
				name: "Notion",
				monogram: "N",
				description: "集合了各种功能于一身的工具，用就对了",
				href: "https://www.notion.so/?r=6bb2b5741cfb40c1892b53adb709f89f",
				linkLabel: "访问官网",
			},
			{
				name: "Nebo",
				monogram: "Nb",
				description: "可以识别你手写的字并快捷排版的笔记应用，支持移动端PC端皆支持",
				href: "https://www.myscript.com/nebo/",
				linkLabel: "访问官网",
			},
			{
				name: "Logseq",
				monogram: "Ls",
				description:
					"基于 Markdown 的知识图谱工具。笔者用于 Notion 之外的辅助记录，主要是用它做笔记的时候不会太愁「这个笔记应该放到哪一个分页？」和花找分页的时间。日常在做什么、对自己有什么思考或觉察、日语词汇等，都是记录在 Logseq 中，偶尔觉得需要的时候就会整理到 Notion。",
				href: "https://logseq.com/",
				linkLabel: "访问官网",
				wide: true,
			},
		],
	},
	{
		id: "server",
		title: "群晖 & 服务器",
		icon: "fa6-solid:server",
		items: [
			{
				name: "Vultr",
				monogram: "V",
				description: "梯子、搭建frp等，全靠它了",
				href: "https://www.vultr.com/?ref=6967230",
				linkLabel: "访问官网",
			},
			{
				name: "frp",
				monogram: "frp",
				description: "外网映射，全靠它了。下面引入笔者的frp相关博文链接",
				href: "https://sunnyrx.com/2016/10/21/simple-to-use-frp/",
				linkLabel: "相关博文",
			},
			{
				name: "MagicMirror",
				monogram: "MM",
				description: "用来做智能镜子的工具，笔者用来做电脑的DIY桌面",
				href: "https://github.com/MichMich/MagicMirror",
				linkLabel: "GitHub",
				wide: true,
			},
		],
	},
	{
		id: "dev",
		title: "编程",
		icon: "fa6-solid:code",
		items: [
			{
				name: "Sublime Text",
				monogram: "ST",
				description: "轻量、扩展强的编辑器",
				href: "https://www.sublimetext.com/",
				linkLabel: "访问官网",
			},
			{
				name: "Unity",
				monogram: "U",
				description: "游戏引擎，无需介绍。",
				href: "https://unity.com/",
				linkLabel: "访问官网",
			},
			{
				name: "JetBrains Rider",
				monogram: "JR",
				description:
					"做 C# 开发用它非常方便，不管是做 Unity 开发还是 DOTNET 开发。自动补全、修正和重构都很方便。",
				href: "https://www.jetbrains.com/rider/",
				linkLabel: "访问官网",
				wide: true,
			},
		],
	},
	{
		id: "assets",
		title: "素材",
		icon: "fa6-solid:volume-high",
		items: [
			{
				name: "Bfxr",
				monogram: "Bx",
				subtag: "Audio",
				description: "在线生成8bit的音效",
				href: "https://www.bfxr.net/",
				linkLabel: "访问官网",
			},
		],
	},
];
