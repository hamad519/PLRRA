"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'bot';
    content: string;
  };
}

/**
 * Converts plain-text / light-markdown into React elements.
 * Handles: numbered lists, bullet points, bold (**text**), line breaks.
 */
function formatBotMessage(text: string): React.ReactNode {
  if (!text) return null;

  // Split by double newlines for paragraphs, single newlines for lines
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: 'ol' | 'ul' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      if (listType === 'ol') {
        elements.push(<ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1.5 my-2">{listItems}</ol>);
      } else {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1.5 my-2">{listItems}</ul>);
      }
      listItems = [];
      listType = null;
    }
  };

  const formatInline = (line: string): React.ReactNode => {
    // Bold: **text** or __text__
    const parts = line.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Empty line = paragraph break
    if (!line) {
      flushList();
      continue;
    }

    // Numbered list: "1. ", "2) ", etc.
    const numberedMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    if (numberedMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(<li key={`li-${i}`} className="text-sm leading-relaxed">{formatInline(numberedMatch[2])}</li>);
      continue;
    }

    // Bullet list: "- ", "• ", "* "
    const bulletMatch = line.match(/^[-•*]\s+(.+)/);
    if (bulletMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(<li key={`li-${i}`} className="text-sm leading-relaxed">{formatInline(bulletMatch[1])}</li>);
      continue;
    }

    // Heading-like: lines ending with ":" or starting with "==="
    if (line.startsWith('===') || line.startsWith('###')) {
      flushList();
      const clean = line.replace(/^[=#]+\s*/, '').replace(/\s*[=#]+$/, '');
      elements.push(<p key={`h-${i}`} className="font-bold text-sm mt-3 mb-1">{clean}</p>);
      continue;
    }

    // Regular text line
    flushList();
    elements.push(<p key={`p-${i}`} className="text-sm leading-relaxed mb-1">{formatInline(line)}</p>);
  }

  flushList();
  return elements;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.role === 'bot';

  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "flex max-w-[85%] gap-3",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
          isBot ? "bg-plra-gold text-slate-950" : "bg-plra-accent-purple text-white"
        )}>
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>
        <div className={cn(
          "p-4 rounded-2xl shadow-sm",
          isBot
            ? "bg-white border border-gray-100 text-slate-700 rounded-tl-none"
            : "bg-slate-950 text-white rounded-tr-none"
        )}>
          {isBot ? formatBotMessage(message.content) : (
            <p className="text-sm font-medium leading-relaxed">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
