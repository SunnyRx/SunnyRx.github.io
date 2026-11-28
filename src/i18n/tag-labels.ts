/**
 * Tag names are stored in the content as canonical values (mostly Chinese),
 * so links and archive filter queries stay language-agnostic. Only the
 * display label changes per language.
 */
const JAPANESE_LABELS: Record<string, string> = {
	随笔: "エッセイ",
	游戏评论: "ゲームレビュー",
	分享: "シェア",
	编程: "プログラミング",
	年度回顾: "年間振り返り",
	游戏制作: "ゲーム制作",
	游戏设计: "ゲームデザイン",
	群晖: "Synology",
	内网穿透: "NAT越え",
	工具: "ツール",
	日语: "日本語",
	游戏策划: "ゲーム企画",
	生产力: "生産性",
	自动化测试: "自動テスト",
};

export function getTagLabel(tag: string | null | undefined, lang = ""): string {
	const trimmed = tag?.trim();
	if (!trimmed) return "";
	if (lang.toLowerCase().startsWith("ja")) {
		return JAPANESE_LABELS[trimmed] ?? trimmed;
	}
	return trimmed;
}
