import type { Guide } from "../data/guides.ts";

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; children: InlineNode[] }
  | { type: "emphasis"; children: InlineNode[] }
  | { type: "link"; label: InlineNode[]; href: string };

export type GuideBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string; id: string }
  | { type: "list"; ordered: boolean; items: string[]; start?: number }
  | { type: "code"; language?: string; code: string }
  | { type: "blockquote"; text: string }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "separator" };

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function safeGuideHref(href: string): string | undefined {
  const trimmed = href.trim();
  if (!trimmed || trimmed.includes("\\") || /[\u0000-\u001f\u007f]/.test(trimmed)) return undefined;
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if ((parsed.protocol === "https:" || parsed.protocol === "http:") && parsed.hostname) return trimmed;
  } catch {
    return undefined;
  }
  return undefined;
}

export function safeExternalGuideUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

export function renderGuideReferencesHtml(references: Guide["references"]): string {
  if (!references?.length) return "";
  const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const entries = references.map((reference) => {
    const url = safeExternalGuideUrl(reference.url);
    if (!url) return "";
    return `<li><a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(reference.title)}</a> — ${escape(reference.publisher)}</li>`;
  }).filter(Boolean);
  return entries.length ? `<section id="references"><h2>References &amp; Further Reading</h2><ul>${entries.join("")}</ul></section>` : "";
}

export function parseInlineMarkdown(value: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const token = /\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)|`([^`]+)`|\*\*(.+?)\*\*|__(.+?)__|\*([^*\n]+)\*/g;
  let last = 0;
  for (const match of value.matchAll(token)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push({ type: "text", value: value.slice(last, index) });
    if (match[1] !== undefined) {
      const href = safeGuideHref(match[2]);
      if (href) nodes.push({ type: "link", label: parseInlineMarkdown(match[1]), href });
      else nodes.push({ type: "text", value: match[1] });
    } else if (match[3] !== undefined) nodes.push({ type: "code", value: match[3] });
    else if (match[4] !== undefined || match[5] !== undefined) nodes.push({ type: "strong", children: parseInlineMarkdown(match[4] ?? match[5]) });
    else nodes.push({ type: "emphasis", children: parseInlineMarkdown(match[6]) });
    last = index + match[0].length;
  }
  if (last < value.length) nodes.push({ type: "text", value: value.slice(last) });
  return nodes;
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*|__|\*/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "") || "section";
}

function headingId(prefix: string, text: string, counts: Map<string, number>): string {
  const base = `${prefix}-${slugifyHeading(text)}`;
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function parseTableCells(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

export function parseGuideMarkdown(source: string, idPrefix: string): GuideBlock[] {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const blocks: GuideBlock[] = [];
  const headingCounts = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }

    const fence = line.match(/^```([\w-]*)\s*$/);
    if (fence) {
      const codeLines: string[] = [];
      index++;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) codeLines.push(lines[index++]);
      if (index < lines.length) index++;
      blocks.push({ type: "code", language: fence[1] || undefined, code: codeLines.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+?)\s*#*$/);
    if (heading) {
      const level = Math.min(4, heading[1].length) as 2 | 3 | 4;
      blocks.push({ type: "heading", level, text: heading[2], id: headingId(idPrefix, heading[2], headingCounts) });
      index++;
      continue;
    }

    if (/^(---+|\*\*\*+|___+)$/.test(line)) {
      blocks.push({ type: "separator" });
      index++;
      continue;
    }

    if (isTableRow(line) && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])) {
      const headers = parseTableCells(lines[index]);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && isTableRow(lines[index].trim())) rows.push(parseTableCells(lines[index++]));
      const prior = blocks.at(-1);
      const caption = prior?.type === "paragraph" && /^Table:\s*/i.test(prior.text) ? prior.text.replace(/^Table:\s*/i, "") : undefined;
      if (caption) blocks.pop();
      blocks.push({ type: "table", caption, headers, rows });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ""));
      blocks.push({ type: "blockquote", text: quote.join(" ") });
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*+]\s+|\d+[.)]\s+)(.*)$/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[2]);
      const items: string[] = [];
      const start = ordered ? Number.parseInt(listMatch[2], 10) : undefined;
      while (index < lines.length) {
        const item = lines[index].trim().match(/^([-*+]\s+|\d+[.)]\s+)(.*)$/);
        if (!item || /^\d/.test(item[1]) !== ordered) break;
        items.push(item[2]);
        index++;
      }
      blocks.push({ type: "list", ordered, items, start });
      continue;
    }

    const paragraph: string[] = [line];
    index++;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || /^```/.test(next) || /^#{2,4}\s/.test(next) || /^(---+|\*\*\*+|___+)$/.test(next) || /^>\s?/.test(next) || /^(?:[-*+]\s+|\d+[.)]\s+)/.test(next) || isTableRow(next)) break;
      paragraph.push(next);
      index++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

export function markdownHeadings(blocks: GuideBlock[]) {
  return blocks.filter((block): block is Extract<GuideBlock, { type: "heading" }> => block.type === "heading");
}

export function guideTocEntries(guide: Pick<Guide, "sections" | "quickAnswer" | "keyTakeaways" | "references" | "faqs">) {
  return [
    ...(guide.quickAnswer ? [{ id: "quick-answer", title: "Quick Answer", level: 2 }] : []),
    ...(guide.keyTakeaways?.length ? [{ id: "key-takeaways", title: "Key Takeaways", level: 2 }] : []),
    ...guide.sections.flatMap((section) => [
      { id: section.id, title: section.title, level: 2 },
      ...markdownHeadings(parseGuideMarkdown(section.content, section.id)).map((heading) => ({
        id: heading.id,
        title: heading.text,
        level: heading.level,
      })),
    ]),
    ...(guide.references?.length ? [{ id: "references", title: "References & Further Reading", level: 2 }] : []),
    ...(guide.faqs.length ? [{ id: "faqs", title: "Frequently Asked Questions", level: 2 }] : []),
  ];
}

export function renderInlineHtml(value: string): string {
  return parseInlineMarkdown(value).map((node) => {
    if (node.type === "text") return escapeHtml(node.value);
    if (node.type === "code") return `<code>${escapeHtml(node.value)}</code>`;
    if (node.type === "strong") return `<strong>${node.children.map(renderInlineNodeHtml).join("")}</strong>`;
    if (node.type === "emphasis") return `<em>${node.children.map(renderInlineNodeHtml).join("")}</em>`;
    const external = /^https?:/i.test(node.href);
    return `<a href="${escapeHtml(node.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${node.label.map(renderInlineNodeHtml).join("")}</a>`;
  }).join("");
}

function renderInlineNodeHtml(node: InlineNode): string {
  if (node.type === "text") return escapeHtml(node.value);
  if (node.type === "code") return `<code>${escapeHtml(node.value)}</code>`;
  if (node.type === "strong") return `<strong>${node.children.map(renderInlineNodeHtml).join("")}</strong>`;
  if (node.type === "emphasis") return `<em>${node.children.map(renderInlineNodeHtml).join("")}</em>`;
  const external = /^https?:/i.test(node.href);
  return `<a href="${escapeHtml(node.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${node.label.map(renderInlineNodeHtml).join("")}</a>`;
}

export function renderGuideMarkdownHtml(blocks: GuideBlock[]): string {
  return blocks.map((block) => {
    if (block.type === "paragraph") return `<p>${renderInlineHtml(block.text)}</p>`;
    if (block.type === "heading") return `<h${block.level} id="${escapeHtml(block.id)}">${renderInlineHtml(block.text)}</h${block.level}>`;
    if (block.type === "code") return `<pre><code${block.language ? ` class="language-${escapeHtml(block.language)}"` : ""}>${escapeHtml(block.code)}</code></pre>`;
    if (block.type === "blockquote") return `<blockquote><p>${renderInlineHtml(block.text)}</p></blockquote>`;
    if (block.type === "separator") return "<hr />";
    if (block.type === "list") {
      const tag = block.ordered ? "ol" : "ul";
      const start = block.ordered && block.start && block.start !== 1 ? ` start="${block.start}"` : "";
      return `<${tag}${start}>${block.items.map((item) => `<li>${renderInlineHtml(item)}</li>`).join("")}</${tag}>`;
    }
    return `<table>${block.caption ? `<caption>${renderInlineHtml(block.caption)}</caption>` : ""}<thead><tr>${block.headers.map((cell) => `<th scope="col">${renderInlineHtml(cell)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((cell, cellIndex) => cellIndex === 0 ? `<th scope="row">${renderInlineHtml(cell)}</th>` : `<td>${renderInlineHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }).join("\n");
}
