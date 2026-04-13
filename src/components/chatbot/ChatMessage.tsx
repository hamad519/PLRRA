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

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.role === 'bot';

  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "flex max-w-[80%] gap-3",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
          isBot ? "bg-plra-gold text-slate-950" : "bg-plra-accent-purple text-white"
        )}>
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>
        <div className={cn(
          "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
          isBot 
            ? "bg-white border border-gray-100 text-slate-700 rounded-tl-none" 
            : "bg-slate-950 text-white rounded-tr-none"
        )}>
          {message.content}
        </div>
      </div>
    </div>
  );
};