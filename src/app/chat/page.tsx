'use client';

import { useRouter } from 'next/navigation';
import Message from '@/components/Message';
import { MessageInput } from '@/components/MessageInput';
import type { IMessage } from '@/types/messages.types';
import type { IUser } from '@/types/user.types';
import { useStore, addMessage } from '../lib/supabase';
import { useUserStore } from '../lib/store';
import { useEffect, useRef } from 'react';

export default function Chat(props: any) {
  const router = useRouter();
  const { messages, users }: { messages: IMessage[]; users: IUser[] } =
    useStore();
  const {
    username,
    authenticated,
    id: userId,
  } = useUserStore((state) => ({
    username: state.username,
    authenticated: state.authenticated,
    id: state.id,
  }));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('user', username);
    if (typeof window !== 'undefined' && !authenticated) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [messages]);

  const postMessage = async (text: string) => {
    addMessage({ message: text, sender: userId as number });
  };

  return (
    <div>
      {authenticated && (
        <div className="flex h-screen">
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
      )}
    </div>
  );
}
