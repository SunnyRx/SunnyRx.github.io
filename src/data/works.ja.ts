/**
 * Japanese translations for strings in works.ts, keyed by the canonical
 * Chinese text so works.ts stays untouched as the single source of truth.
 */
const WORKS_JA: Record<string, string> = {
	// Categories
	游戏: "ゲーム",
	工具: "ツール",
	视频: "動画",
	广播剧: "ラジオドラマ",
	歌曲: "楽曲",
	模型: "3Dモデル",

	// Item titles
	异星时劫: "異星時劫",
	回忆碎片: "記憶の欠片（Fragments of Memory）",
	这里没有格林达姆: "ここにグリーンダムはいない（There is No GreenDam）",
	"专注女仆（Focus Maid）": "Focus Maid",
	骰子模拟器: "ダイスシミュレーター",
	绿坝娘大事记: "グリーンダムたん年代記",
	"【苍绿祭】拉手两年 永恒约定~Greendam Forever 第1话":
		"【蒼緑祭】手をつないで2年 永遠の約束〜Greendam Forever 第1話",
	"【苍绿祭】拉手两年 永恒约定~Greendam Forever 第2话":
		"【蒼緑祭】手をつないで2年 永遠の約束〜Greendam Forever 第2話",
	"【苍绿祭】拉手两年 永恒约定~Greendam Forever 第3话":
		"【蒼緑祭】手をつないで2年 永遠の約束〜Greendam Forever 第3話",
	"【苍绿祭】拉手两年 永恒约定~Greendam Forever 第4话":
		"【蒼緑祭】手をつないで2年 永遠の約束〜Greendam Forever 第4話",
	"【苍绿祭】小绿日常的一天": "【蒼緑祭】みどりちゃんの日常の一日",
	"【苍绿祭】我才不说喜欢你": "【蒼緑祭】好きだなんて言わないんだから",
	"【漫研社十周年】初心·拾终如一": "【漫研部10周年】初心・変わらずに",
	"【苍绿祭】原创 3D 模型「绿坝娘」(GreenDam)":
		"【蒼緑祭】オリジナル3Dモデル「グリーンダムたん」(GreenDam)",
	"原创 3D 模型「マリちゃん」(marichan)":
		"オリジナル3Dモデル「マリちゃん」(marichan)",

	// Meta
	"AI IDE · 番茄钟": "AI IDE · ポモドーロタイマー",

	// Summaries
	"通过拖拽角色推进建设与互动的轻量模拟建设游戏，于 2025 年 8 月登陆 Steam（开发者列表：LuzhangGames）。":
		"キャラクターをドラッグして街づくりや交流を進めるカジュアルなシミュレーションゲーム。2025年8月に Steam でリリース（開発：LuzhangGames）。",
	"Ludum Dare 51 期间制作的快节奏策略卡牌原型——每回合仅有十秒，在建设发展与守城防御之间快速取舍。":
		"Ludum Dare 51 で制作したハイテンポな戦略カードゲームのプロトタイプ。1ターンわずか10秒のなかで、街の発展と防衛のバランスを素早く見極めます。",
	"Ludum Dare 49 参赛平台游戏。玩家扮演失忆少女，在失重空间里探索并逐步找回遗失的记忆。":
		"Ludum Dare 49 への参加作品となるプラットフォームゲーム。記憶を失った少女となり、無重力空間を探索しながら失われた記憶を少しずつ取り戻していきます。",
	"使用 AI IDE 制作的番茄钟与专注辅助工具，以更轻松的界面陪伴日常专注时段。":
		"AI IDE を使って制作したポモドーロタイマー＆集中サポートツール。肩の力を抜いて使えるUIで、日々の作業時間をやさしく支えます。",

	// Image alts
	拖拖拉拉小菲镇游戏封面: "拖拖拉拉小菲镇 カバー画像",
	"Card Empires 游戏封面": "Card Empires カバー画像",
	回忆碎片游戏画面: "記憶の欠片 ゲーム画面",
	专注女仆应用界面: "Focus Maid アプリ画面",

	// Link labels
	设计复盘: "ゲームデザインの振り返り",
	机核网: "GCORES",
	"App Store（已下架）": "App Store（配信終了）",
	百度贴吧: "百度貼吧",
	天窗联盟: "天窓連盟",
	开发介绍: "開発紹介",
};

export function getWorksText(text: string, lang: string): string {
	if (lang.toLowerCase().startsWith("ja")) {
		return WORKS_JA[text] ?? text;
	}
	return text;
}
