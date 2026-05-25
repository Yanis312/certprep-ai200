"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-blue-400">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">{children}</h3>,
        p: ({ children }) => <p className="text-gray-300 leading-7 mb-4">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-300">{children}</ol>,
        li: ({ children }) => <li className="text-gray-300">{children}</li>,
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          return isBlock ? (
            <code className="block bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto mb-4 font-mono">
              {children}
            </code>
          ) : (
            <code className="bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          );
        },
        pre: ({ children }) => <pre className="bg-gray-800 rounded-lg mb-4 overflow-x-auto">{children}</pre>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-4">{children}</blockquote>
        ),
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-gray-300 border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="bg-gray-800 text-left px-3 py-2 border border-gray-700 text-white font-semibold">{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 border border-gray-700">{children}</td>,
        hr: () => <hr className="border-gray-700 my-6" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
