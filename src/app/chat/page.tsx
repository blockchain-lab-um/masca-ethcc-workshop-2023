'use client';

import Message from '@/components/Message';
import { IMessage, User } from '../lib/supabase';
import { useSupabase } from '../lib/supabase';

export default function Chat(props: any) {
  const { messages, users }: { messages: IMessage[]; users: User[] } =
    useSupabase();
  return (
    <div className="relative h-screen">
      <div className="h-full pb-16">
        <div className="overflow-y-auto p-2">
          {messages.length !== 0 &&
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
        </div>
      </div>
    </div>
  );
}
