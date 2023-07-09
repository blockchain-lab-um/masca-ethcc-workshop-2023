'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '../../lib/store';
import MessageInput from '@/components/MessageInput';
import MessagesPanel from '@/components/MessagesPanel';
import { addMessage, fetchChannel, useSupabaseStore } from '../../lib/supabase';
import UserList from '@/components/UserList';
import { useEffect, useState } from 'react';
import type { IChannel } from '@/types/channel.types';
import type { IMessage } from '@/types/message.types';
import type { IUser } from '@/types/user.types';

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
    addMessage({
      message: text,
      sender: userId as number,
      channel: channel.id,
      did: did,
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 overflow-auto rounded-sm p-6">
        <div className={`${usersPanel ? 'w-2/3' : 'w-full'}`}>
          <MessagesPanel messages={messages} msgOnly={!usersPanel} />
        </div>
        {usersPanel && (
          <div className=" w-1/3">
            <UserList users={users} />
          </div>
        )}
      </div>
      <div className="h-16 w-full items-center justify-center self-center py-2 px-6">
        <MessageInput
          disabled={channel.protected && !authenticated}
          onSubmit={postMessage}
        />
      </div>
    </div>
  );
}
