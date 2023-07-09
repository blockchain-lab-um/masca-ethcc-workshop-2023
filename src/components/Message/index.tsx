import type { IMessage } from '@/types/message.types';
import { useEffect, useState } from 'react';
import uniqolor from 'uniqolor';

const Message = ({ message }: { message: IMessage }) => {
  const [color, setColor] = useState<any | null>(uniqolor(''));
  useEffect(() => {
    let seed = message.senderDid;
    if (message.user) seed = message.user.username;
    setColor(uniqolor(seed || 'Anonymous', { format: 'rgb' }));
  }, [message]);

  const format = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });
    }

    return date.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="flex w-full items-center space-x-2 py-1">
      <p
        style={{
          color: color.color,
        }}
        className="font-bold "
      >
        {message.user?.username || message.senderDid || 'Anonymous'}
      </p>
      <p className="text-xs text-gray-500">
        at {format(message.created_at || '')}
      </p>
      <p className="w-full break-all text-white">{message.message}</p>
    </div>
  );
};

export default Message;
