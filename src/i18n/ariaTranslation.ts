import { siteConfig } from "../config";
import type AriaI18nKey from "./ariaKey";
import { ariaEn } from "./languages/aria-en";
import { ariaJa } from "./languages/aria-ja";
import { ariaZhCN } from "./languages/aria-zh_CN";

// Full dictionary: every key required. Used as the English default and as
// the fallback source when a locale's partial dictionary below doesn't
// cover a key yet.
export type AriaTranslation = Record<AriaI18nKey, string>;
// Locale dictionaries only need the keys they have idiomatic copy for;
// anything missing resolves to the English string at runtime.
export type PartialAriaTranslation = Partial<AriaTranslation>;

const defaultAriaTranslation: AriaTranslation = ariaEn;

const map: { [key: string]: PartialAriaTranslation } = {
	en: ariaEn,
	en_us: ariaEn,
	en_gb: ariaEn,
	en_au: ariaEn,
	zh_cn: ariaZhCN,
	ja: ariaJa,
	ja_jp: ariaJa,
};

export function ariaI18n(key: AriaI18nKey, lang?: string): string {
	const normalizedLang = (lang || siteConfig.lang || "en").toLowerCase();
	const dict = map[normalizedLang];
	return dict?.[key] ?? defaultAriaTranslation[key];
}
