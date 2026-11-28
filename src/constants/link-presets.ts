import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

/**
 * Built on demand: the labels come from i18n(), whose language depends on the
 * page being rendered. A module-level constant would freeze the first language
 * it happened to be evaluated in.
 */
export function getLinkPresets(lang?: string): { [key in LinkPreset]: NavBarLink } {
	return {
		[LinkPreset.Home]: {
			name: i18n(I18nKey.home, lang),
			url: "/",
			urlJa: "/ja/",
		},
		[LinkPreset.About]: {
			name: i18n(I18nKey.about, lang),
			url: "/about/",
		},
		[LinkPreset.Archive]: {
			name: i18n(I18nKey.archive, lang),
			url: "/archive/",
		},
	};
}