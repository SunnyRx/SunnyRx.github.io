/**
 * Supplementary i18n keys for aria-label / accessibility-only strings.
 *
 * Kept separate from `I18nKey` (and `Translation`) because that type is a
 * full mapped type - `{ [K in I18nKey]: string }` - so adding a key there
 * forces every one of the 10 language dictionaries under
 * `src/i18n/languages/` to implement it immediately or `pnpm check` fails.
 * These aria strings only have idiomatic zh-Hans/ja copy so far; every
 * other locale silently falls back to English via `ariaTranslation.ts`.
 */
enum AriaI18nKey {
	backToTop = "backToTop",
	mainNavigation = "mainNavigation",
	displaySettings = "displaySettings",
	menu = "menu",
	searchPanel = "searchPanel",
	lightDarkMode = "lightDarkMode",
	resetToDefault = "resetToDefault",
	goToAboutPage = "goToAboutPage",
}

export default AriaI18nKey;
