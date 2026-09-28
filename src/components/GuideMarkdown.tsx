import React from "react";
import {
  parseGuideMarkdown,
  parseInlineMarkdown,
  type GuideBlock,
  type InlineNode,
  safeGuideHref,
} from "@/lib/guideMarkdown";

function InlineContent({ nodes }: { nodes: InlineNode[] }) {
  return <>{nodes.map((node, index) => {
    if (node.type === "text") return <React.Fragment key={index}>{node.value}</React.Fragment>;
  if (node.type === "code") return <code key={index} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.92em]">{node.value}</code>;
  if (node.type === "strong") return <strong key={index}><InlineContent nodes={node.children} /></strong>;
  if (node.type === "emphasis") return <em key={index}><InlineContent nodes={node.children} /></em>;
    const href = safeGuideHref(node.href);
    if (!href) return <InlineContent key={index} nodes={node.label} />;
    const external = /^https?:/i.test(href);
    return <a key={index} href={href} className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><InlineContent nodes={node.label} /></a>;
  })}</>;
}

function GuideBlockView({ block }: { block: GuideBlock }) {
  if (block.type === "paragraph") return <p><InlineContent nodes={parseInlineMarkdown(block.text)} /></p>;
  if (block.type === "heading") {
    const content = <InlineContent nodes={parseInlineMarkdown(block.text)} />;
    if (block.level === 2) return <h2 id={block.id} className="scroll-mt-24 font-semibold text-slate-900">{content}</h2>;
    if (block.level === 3) return <h3 id={block.id} className="scroll-mt-24 font-semibold text-slate-900">{content}</h3>;
    return <h4 id={block.id} className="scroll-mt-24 font-semibold text-slate-900">{content}</h4>;
  }
  if (block.type === "code") return <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100"><code className={block.language ? `language-${block.language}` : undefined}>{block.code}</code></pre>;
  if (block.type === "blockquote") return <blockquote className="border-l-4 border-blue-300 pl-4 italic text-slate-600"><p><InlineContent nodes={parseInlineMarkdown(block.text)} /></p></blockquote>;
  if (block.type === "separator") return <hr className="border-slate-200" />;
  if (block.type === "list") {
    const items = block.items.map((item, index) => <li key={index}><InlineContent nodes={parseInlineMarkdown(item)} /></li>);
    return block.ordered ? <ol start={block.start} className="list-decimal space-y-1 pl-6">{items}</ol> : <ul className="list-disc space-y-1 pl-6">{items}</ul>;
  }
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm">
    {block.caption && <caption className="mb-2 text-left font-medium text-slate-600">{<InlineContent nodes={parseInlineMarkdown(block.caption)} />}</caption>}
    <thead><tr>{block.headers.map((cell, index) => <th key={index} scope="col" className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold"><InlineContent nodes={parseInlineMarkdown(cell)} /></th>)}</tr></thead>
    <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0
      ? <th key={cellIndex} scope="row" className="border border-slate-200 px-3 py-2 font-semibold"><InlineContent nodes={parseInlineMarkdown(cell)} /></th>
      : <td key={cellIndex} className="border border-slate-200 px-3 py-2"><InlineContent nodes={parseInlineMarkdown(cell)} /></td>)}</tr>)}</tbody>
  </table></div>;
}

export function GuideMarkdown({ content, idPrefix }: { content: string; idPrefix: string }) {
  const blocks = parseGuideMarkdown(content, idPrefix);
  return <div className="guide-markdown space-y-4">{blocks.map((block, index) => <GuideBlockView key={`${block.type}-${index}`} block={block} />)}</div>;
}
