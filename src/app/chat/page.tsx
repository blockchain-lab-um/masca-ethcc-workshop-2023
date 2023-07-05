'use client';

import { useRouter } from 'next/navigation';
import Message from '@/components/Message';
import { MessageInput } from '@/components/MessageInput';
import type { IMessage } from '@/types/messages.types';
import type { IUser } from '@/types/user.types';
import { useSupabaseStore, addMessage } from '../lib/supabase';
import { useUserStore } from '../lib/store';
import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserList } from '@/components/UserList';

export default function Chat(props: any) {
  const router = useRouter();
  const { messages, users }: { messages: IMessage[]; users: IUser[] } =
    useSupabaseStore();
  const {
    username,
    authenticated,
    id: userId,
    did,
  } = useUserStore((state) => ({
    username: state.username,
    authenticated: state.authenticated,
    id: state.id,
    did: state.did,
  }));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <div className="flex h-screen flex-col">
      <Navbar
        connect={() => {}}
        username={username}
        connected={true}
        did={did}
      />
      {authenticated && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex">
            <div className="flex-1">
              <div className="mb-auto">
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <UserList users={users} />
          </div>
        </div>
      )}
      <div className="sticky bottom-0 left-0 w-full p-2">
        <MessageInput disabled={!authenticated} onSubmit={postMessage} />
      </div>
    </div>
  );
}
