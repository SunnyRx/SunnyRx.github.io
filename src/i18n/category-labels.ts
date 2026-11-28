/**
 * Category names are stored in the content as one canonical value (Chinese),
 * so a Chinese post and its Japanese translation share the same key. Only the
 * display label changes per language.
 */
const JAPANESE_LABELS: Record<string, string> = {
	游戏: "ゲーム",
	技术: "技術",
	随笔: "エッセイ",
	AI: "AI",
};

export function getCategoryLabel(
	category: string | null | undefined,
	lang: string,
): string {
	if (!category) return "";
	if (lang.toLowerCase().startsWith("ja")) {
		return JAPANESE_LABELS[category] ?? category;
	}
	return category;
}