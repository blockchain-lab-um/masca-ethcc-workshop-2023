'use client';

import Message from '@/components/Message';
import { MessageInput } from '@/components/MessageInput';
import type { IMessage, IUser } from '../lib/store';
import { useSupabase, addMessage } from '../lib/store';
import { MutableRefObject, useEffect, useRef } from 'react';

export default function Chat(props: any) {
  const { messages, users }: { messages: IMessage[]; users: IUser[] } =
    useSupabase();
  // const messagesEndRef = useRef(null);
  const user = 'urban';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [messages]);

  const postMessage = async (text: string) => {
    // get from state
    addMessage(text, 1);
  };

  return (
    <div className="relative h-screen">
      <div className="h-full pb-16">
        <div className="overflow-y-auto p-2">
          {messages.length !== 0 &&
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          <div ref={messagesEndRef} style={{ height: 0 }} />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-2">
          <MessageInput onSubmit={postMessage} />
        </div>
      </div>
    </div>
  );
}
