import { fetchChannels } from '@/app/lib/supabase';
import { IChannel } from '@/types/channel.types';
import Link from 'next/link';
import { MouseEventHandler, useEffect, useState } from 'react';

interface ChannelListProps {
  enterChat: (channelId: string) => Promise<void>;
}
export const ChannelList = (props: ChannelListProps) => {
  const { enterChat } = props;
  const [protectedChannels, setProtectedChannels] = useState<IChannel[]>([]);
  const [publicChannels, setPublicChannels] = useState<IChannel[]>([]);

  useEffect(() => {
    const getChannels = async () => {
      const channels = await fetchChannels({});
      const protectedChannels: IChannel[] = [];
      const publicChannels: IChannel[] = [];
      channels?.forEach((c) => {
        if (c.protected) {
          protectedChannels.push(c);
        }
        if (!c.protected) {
          publicChannels.push(c);
        }
      });
      setProtectedChannels(protectedChannels as IChannel[]);
      setPublicChannels(publicChannels as IChannel[]);
    };
    getChannels();
  }, []);

  return (
    <div className="h-full border-l-2 border-white p-2">
      <div>
        <p className="mb-2 px-4 text-lg text-slate-300">Public chatrooms</p>
        <div className="rounded-md bg-slate-700 px-4 py-2">
          {publicChannels.map((c) => (
            <Link href={`/chat/${c.id}`} key={c.id}>
              <div className="flex cursor-pointer justify-between rounded-md bg-slate-700">
                <p>{c.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <br></br>
      <div>
        <p className="mb-2 px-4 text-lg text-slate-300">
          Restricted chatrooms 🔐
        </p>
        <div className="rounded-md bg-slate-700 px-4 py-2">
          {protectedChannels.map((c) => (
            <div
              onClick={() => enterChat(c.id as string)}
              key={c.id}
              className="flex cursor-pointer justify-between rounded-md bg-slate-700"
            >
              <p>{c.title}</p>
              <p className="self-center text-xs text-slate-500">
                (Needs MascaWorkshopPOAP)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
