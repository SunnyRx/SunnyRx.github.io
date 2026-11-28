import { defineMiddleware } from "astro:middleware";
import { siteConfig } from "./config";

const JAPANESE_PREFIX = "/ja";

/**
 * Every render gets its language from the URL, so components can ask
 * Astro.locals.lang instead of every page passing a prop down.
 */
export const onRequest = defineMiddleware((context, next) => {
	const path = context.url.pathname;
	const isJapanese =
		path === JAPANESE_PREFIX || path.startsWith(`${JAPANESE_PREFIX}/`);

	context.locals.lang = isJapanese ? "ja" : siteConfig.lang;
	return next();
});