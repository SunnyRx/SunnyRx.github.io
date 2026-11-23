import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl, getPostUrlBySlug } from "@utils/url-utils.ts";

export function isJapanesePost(post: { slug: string; data: { lang?: string } }): boolean {
	return post.slug.startsWith("ja/") || post.data.lang === "ja";
}

// Retrieve posts and sort them by publication date
async function getRawSortedPosts(scope: "default" | "ja" | "all" = "default") {
	const allBlogPosts = await getCollection("posts", (entry) => {
		const isPublished = import.meta.env.PROD ? entry.data.draft !== true : true;
		if (!isPublished) return false;
		if (scope === "all") return true;
		const isJa = isJapanesePost(entry);
		return scope === "ja" ? isJa : !isJa;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts("default");

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export async function getSortedJapanesePosts() {
	const sorted = await getRawSortedPosts("ja");

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type PostTranslation = {
	lang: string;
	hreflang: string;
	label: string;
	url: string;
	title: string;
	slug: string;
};

export async function getPostTranslations(
	translationKey?: string,
): Promise<PostTranslation[]> {
	if (!translationKey) return [];
	const allPosts = await getRawSortedPosts("all");
	const matched = allPosts.filter(
		(post) => post.data.translationKey && post.data.translationKey === translationKey,
	);
	if (matched.length <= 1) return [];

	return matched
		.map((post) => {
			const isJa = isJapanesePost(post);
			return {
				lang: isJa ? "ja" : "zh_CN",
				hreflang: isJa ? "ja" : "zh-Hans",
				label: isJa ? "日本語" : "中文",
				url: getPostUrlBySlug(post.slug),
				title: post.data.title,
				slug: post.slug,
			};
		})
		.sort((a, b) => (a.lang === "zh_CN" ? -1 : b.lang === "zh_CN" ? 1 : 0));
}

export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts("default");

	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts("default");

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getRawSortedPosts("default");
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
