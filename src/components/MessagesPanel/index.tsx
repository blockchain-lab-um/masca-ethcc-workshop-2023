import React from 'react';
import Message from '../Message';
import type { IMessage } from '@/types/message.types';
import { useEffect, useRef } from 'react';

interface MessagesPanelProps {
  messages: IMessage[];
}

export const MessagesPanel = ({ messages }: MessagesPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="no-scrollbar h-full flex-1 overflow-auto px-4 py-2">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
