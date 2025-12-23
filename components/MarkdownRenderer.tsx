import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text
          strong: ({ children }) => (
            <strong className="font-bold text-indigo-300">{children}</strong>
          ),
          // Italic text
          em: ({ children }) => (
            <em className="italic text-slate-300">{children}</em>
          ),
          // Code inline
          code: ({ children }) => (
            <code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-amber-300 text-xs font-mono">
              {children}
            </code>
          ),
          // Code blocks
          pre: ({ children }) => (
            <pre className="bg-slate-900/70 p-3 rounded-lg overflow-x-auto my-2 border border-slate-700/50">
              {children}
            </pre>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2 ml-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 ml-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-200">{children}</li>
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-indigo-300 mt-3 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-indigo-300 mt-2 mb-1">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-indigo-400 mt-2 mb-1">{children}</h3>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              {children}
            </a>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500/50 pl-3 italic text-slate-400 my-2">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="border-t border-slate-700/50 my-3" />
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-slate-200 my-1 leading-relaxed">
              {children}
            </p>
          ),
          // Tables
          table: ({ children }) => (
            <table className="border-collapse border border-slate-700/50 my-2 text-xs">
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-slate-700/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="border border-slate-700/50 px-2 py-1 text-indigo-300 font-bold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-700/50 px-2 py-1">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
