import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none p-8">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}