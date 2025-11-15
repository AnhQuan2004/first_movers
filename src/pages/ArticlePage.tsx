import { useMemo, type HTMLAttributes, type ReactNode } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/modules/learn/articles";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Twitter,
  Link,
  MoreHorizontal,
  Facebook,
  Linkedin,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  title: string;
};

const formatDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const slugifyHeading = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const extractText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const element = node as { props?: { children?: ReactNode } };
    if (element.props?.children) {
      return extractText(element.props.children);
    }
  }

  return "";
};

const headingStyles: Record<string, string> = {
  h1: "mt-14 text-4xl font-semibold leading-tight first:mt-0",
  h2: "mt-12 text-3xl font-semibold leading-snug first:mt-0",
  h3: "mt-10 text-2xl font-semibold leading-snug first:mt-0",
  h4: "mt-8 text-xl font-semibold first:mt-0",
};

const createHeading =
  (Tag: keyof JSX.IntrinsicElements) =>
  ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
    const text = extractText(children);
    const id = slugifyHeading(text);

    return (
      <Tag
        id={id}
        className={cn(
          "scroll-mt-28 text-white",
          headingStyles[Tag] ?? "mt-6 text-lg font-semibold",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  };

const CodeBlock: Components["code"] = ({
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1]?.toUpperCase() ?? "CODE";
  const content =
    typeof children === "string"
      ? children.replace(/\n$/, "")
      : String(children ?? "").replace(/\n$/, "");

  if (inline) {
    return (
      <code
        className={cn(
          "rounded-md bg-white/10 px-2 py-0.5 text-sm font-medium text-sky-200",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#050c1a] shadow-[0_30px_80px_-40px_rgba(7,12,31,0.9)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-400">
        <span>{language}</span>
        <span className="text-[11px] font-semibold text-white/60">Snippet</span>
      </div>
      <pre className="overflow-auto px-4 py-4 text-sm leading-relaxed text-slate-100">
        <code className={className} {...props}>
          {content}
        </code>
      </pre>
    </div>
  );
};

const markdownComponents: Components = {
  h1: createHeading("h1"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  p: ({ children }) => (
    <p className="mt-6 leading-7 text-slate-200 first:mt-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-200">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2 pl-6 text-slate-200">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-slate-200">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-lg italic text-slate-200">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm text-slate-200">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-white/5 px-4 py-3 text-xs uppercase tracking-widest text-white">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-3 text-slate-200">{children}</td>,
  code: CodeBlock,
  img: ({ className, ...props }) => (
    <span className="my-8 block overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4">
      <img
        {...props}
        className={cn("mx-auto w-full rounded-2xl object-cover", className)}
      />
    </span>
  ),
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-sky-300 underline-offset-4 transition hover:text-white hover:underline"
    >
      {props.children}
    </a>
  ),
};

const ArticlePage = () => {
  const { slug } = useParams();
  const article = slug ? getArticleBySlug(slug) : undefined;

  const toc = useMemo<TocItem[]>(() => {
    if (!article) return [];
    const matches = Array.from(
      article.content.matchAll(/^##\s+(.*)$/gm),
    );

    return matches.map((match) => {
      const title = match[1]?.trim() ?? "";
      return {
        title,
        id: slugifyHeading(title),
      };
    });
  }, [article]);

  if (!article) {
    return (
      <div className="bg-[#0B0B0B] text-white min-h-screen flex flex-col">
        <NavBar />
        <main className="container mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Article not found</h1>
            <p className="text-muted-foreground max-w-lg">
              We could not find the resource you are looking for. Please return
              to the learn catalog and pick another article.
            </p>
          </div>
          <RouterLink
            to="/learn"
            className="inline-flex items-center gap-2 rounded-full border px-6 py-2 hover:bg-white hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to learn page
          </RouterLink>
        </main>
        <Footer />
      </div>
    );
  }

  const publishedLabel = formatDate(article.publishedAt);
  const updatedLabel = formatDate(article.updatedAt);

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen flex flex-col">
      <NavBar />
      <main className="container mx-auto px-6 py-16 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">
            First Movers Learn
          </p>
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {publishedLabel && <span>Published: {publishedLabel}</span>}
              {updatedLabel && <span>Updated: {updatedLabel}</span>}
              <span>{article.readingTimeMinutes} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Link className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
          {article.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="font-bold">Tags:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 text-base leading-relaxed text-slate-200">
            <div className="space-y-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        <aside>
          <div className="sticky top-24">
            <h3 className="text-lg font-bold">Table of Contents</h3>
            {toc.length ? (
              <ul className="mt-4 space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="hover:text-primary">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Headings will appear here when available.
              </p>
            )}
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
