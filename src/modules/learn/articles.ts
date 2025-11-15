import matter from "gray-matter";
import { Buffer } from "buffer";

const globalScope = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer;
};

if (!globalScope.Buffer) {
  globalScope.Buffer = Buffer;
}

const rawArticles = import.meta.glob("./mockup/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const sanitizeFrontmatter = (value: unknown) => {
  const source = String(value ?? "");
  return source
    .replace(/^\uFEFF/, "")
    .replace(/^\s+(?=---)/, "");
};

export type LearnArticle = {
  slug: string;
  title: string;
  description: string;
  icon?: string;
  heroImage?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  readingTimeMinutes: number;
  content: string;
  order?: number;
};

const FALLBACK_DESCRIPTION =
  "Educational resources aggregated by the First Movers Community. Discover to expand your knowledge about blockchain and Sui.";

const WORDS_PER_MINUTE = 200;

function formatSlug(filePath: string) {
  const fileName = filePath.split("/").pop() ?? "";
  return fileName.replace(/\.md$/i, "");
}

function deriveTitle(slug: string, content: string) {
  const headingMatch = content.match(/^#\s+(.*)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function createExcerpt(content: string) {
  const cleaned = content
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]*]\([^)]+\)/g, "")
    .replace(/[#>*_`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return FALLBACK_DESCRIPTION;
  }

  return cleaned.length > 200
    ? `${cleaned.slice(0, 197).trim()}...`
    : cleaned;
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag));
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function computeReadingTime(content: string) {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

const learnArticles: LearnArticle[] = Object.entries(rawArticles).map(
  ([path, fileContent]) => {
    const slug = formatSlug(path);
    const sanitized = sanitizeFrontmatter(fileContent);
    const { data, content } = matter(sanitized);

    const title = data.title || deriveTitle(slug, content);
    const description = data.description || createExcerpt(content);
    const order =
      typeof data.order === "number"
        ? data.order
        : Number.isFinite(Number(data.order))
        ? Number(data.order)
        : undefined;

    return {
      slug,
      title,
      description,
      icon: data.icon,
      heroImage: data.heroImage,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      tags: normalizeTags(data.tags),
      readingTimeMinutes:
        data.readingTimeMinutes || computeReadingTime(content),
      content,
      order,
    };
  },
);

learnArticles.sort((a, b) => {
  if (a.order != null && b.order != null) {
    return a.order - b.order;
  }

  if (a.order != null) return -1;
  if (b.order != null) return 1;

  if (a.publishedAt && b.publishedAt) {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  }

  if (a.publishedAt) return -1;
  if (b.publishedAt) return 1;

  return a.title.localeCompare(b.title);
});

export { learnArticles };

export function getArticleBySlug(slug: string) {
  return learnArticles.find((article) => article.slug === slug);
}
