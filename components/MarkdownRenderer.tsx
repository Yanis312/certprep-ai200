"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-100 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-indigo-700 mt-7 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-700 mt-5 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-600 leading-7 mb-4 text-sm">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1.5 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-1.5 list-decimal pl-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-600 text-sm flex items-start gap-2 leading-6">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span>{children}</span>
            </li>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            return isBlock ? (
              <code className="block bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto mb-4 font-mono leading-6 shadow-inner">
                {children}
              </code>
            ) : (
              <code className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-slate-900 rounded-xl mb-4 overflow-x-auto shadow-md">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-300 bg-indigo-50 pl-4 pr-3 py-3 rounded-r-lg italic text-slate-500 text-sm mb-4">{children}</blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-800">{children}</strong>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-slate-600">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-b border-slate-100 text-sm">{children}</td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 transition-colors">{children}</tr>
          ),
          hr: () => <hr className="border-slate-100 my-6" />,
          a: ({ children, href }) => (
            <a href={href} className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors">{children}</a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
