'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '../../lib/store';
import { MessageInput } from '@/components/MessageInput';
import { Navbar } from '@/components/Navbar';
import { MessagesPanel } from '@/components/MessagesPanel';
import { addMessage, fetchChannel, useSupabaseStore } from '../../lib/supabase';
import { UserList } from '@/components/UserList';
import { useEffect, useState } from 'react';
import { IChannel } from '@/types/channel.types';
import { IMessage } from '@/types/message.types';
import { IUser } from '@/types/user.types';
import Message from '@/components/Message';

interface ChatProps {
  params: { id: string };
  connected: boolean;
}
export default function Chat({ params, connected }: ChatProps) {
  const router = useRouter();
  const [usersPanel, setUsersPanel] = useState(false);
  const [channel, setChannel] = useState<IChannel>({
    id: '0',
    title: '',
    protected: true,
  });
  const {
    username,
    authenticated,
    did,
    id: userId,
  } = useUserStore((state) => ({
    username: state.username,
    authenticated: state.authenticated,
    id: state.id,
    did: state.did,
  }));
  const { messages, users }: { messages: IMessage[]; users: IUser[] } =
    useSupabaseStore({ channelId: params.id, privileged: authenticated });

  useEffect(() => {
    const handleProtected = async () => {
      const { id } = params;
      const channel = await fetchChannel({ channelId: id });
      if (!did) router.push('/');
      if (!channel || channel.length === 0) {
        router.push('/');
        return;
      }

      if (channel[0].protected && !authenticated) {
        router.push('/');
        return;
      }
      setChannel(channel[0]);

      if (channel[0].protected) {
        setUsersPanel(true);
      }
    };
    handleProtected();
  }, []);

  const postMessage = async (text: string) => {
    console.log('sender', userId);
    addMessage({
      message: text,
      sender: userId as number,
      channel: channel.id,
      did: did,
    });
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-none">
        <Navbar connect={() => {}} username={username} connected={true} />
      </div>
      <div className="flex flex-1 overflow-auto border-b-2 border-white">
        <div className={`${usersPanel ? 'w-2/3' : 'w-full'}`}>
          <MessagesPanel messages={messages} />
        </div>
        {usersPanel && (
          <div className=" w-1/3">
            <UserList users={users} />
          </div>
        )}
      </div>
      <div className="w-full p-2">
        <MessageInput
          disabled={channel.protected && !authenticated}
          onSubmit={postMessage}
        />
      </div>
    </div>
  );
}
