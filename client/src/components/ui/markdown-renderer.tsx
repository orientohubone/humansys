
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const formatText = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      let formattedLine: React.ReactNode = line;
      
      // Headers (# ## ###)
      if (line.startsWith('### ')) {
        formattedLine = (
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        formattedLine = (
          <h2 key={index} className="text-xl font-bold text-gray-800 mt-5 mb-3">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        formattedLine = (
          <h1 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            {line.substring(2)}
          </h1>
        );
      }
      // Listas com - ou *
      else if (line.match(/^[\s]*[-*]\s/)) {
        const indent = line.match(/^(\s*)/)?.[1]?.length || 0;
        const content = line.replace(/^[\s]*[-*]\s/, '');
        formattedLine = (
          <li key={index} className="text-gray-700 mb-1" style={{ marginLeft: `${indent * 10}px` }}>
            {formatInlineText(content)}
          </li>
        );
      }
      // Listas numeradas
      else if (line.match(/^[\s]*\d+\.\s/)) {
        const indent = line.match(/^(\s*)/)?.[1]?.length || 0;
        const content = line.replace(/^[\s]*\d+\.\s/, '');
        formattedLine = (
          <li key={index} className="text-gray-700 mb-1 list-decimal" style={{ marginLeft: `${indent * 10}px` }}>
            {formatInlineText(content)}
          </li>
        );
      }
      // Linha vazia
      else if (line.trim() === '') {
        formattedLine = <br key={index} />;
      }
      // Texto normal
      else if (!React.isValidElement(formattedLine)) {
        formattedLine = (
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {formatInlineText(line)}
          </p>
        );
      }
      
      elements.push(formattedLine);
    });
    
    return elements;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    // Bold (**texto** ou __texto__)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic (*texto* ou _texto_)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code (`código`)
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {formatText(content)}
    </div>
  );
};
