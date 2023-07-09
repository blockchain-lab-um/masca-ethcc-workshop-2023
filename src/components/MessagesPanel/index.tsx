import React from 'react';
import Message from '../Message';
import type { IMessage } from '@/types/message.types';
import { useEffect, useRef } from 'react';

interface MessagesPanelProps {
  messages: IMessage[];
  msgOnly?: boolean;
}

const MessagesPanel = ({ messages, msgOnly }: MessagesPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div
      className={`no-scrollbar ${
        msgOnly ? 'mr-6' : ''
      }mr-6 h-full flex-1 overflow-auto rounded-xl bg-slate-700 p-4 shadow-sm`}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesPanel;
