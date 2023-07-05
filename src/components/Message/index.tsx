import type { IMessage } from '@/types/messages.types';
import { useEffect, useState } from 'react';
import uniqolor from 'uniqolor';
import type Color from 'uniqolor';

export const Message = ({ message }: { message: IMessage }) => {
  const [color, setColor] = useState<any | null>(uniqolor(''));
  useEffect(() => {
    if (!message.user) return;
    setColor(uniqolor(message.user.username, { format: 'rgb' }));
  }, [message.user, message.user?.username]);

  const format = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.getDate() === today.getDate()) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="flex items-center space-x-2 py-1">
      <p
        style={{
          color: color.color,
        }}
        className="font-bold text-blue-700"
      >
        {message.user?.username}
      </p>
      <p className="text-xs text-gray-500">at {format(message.created_at)}</p>
      <p className="break-words text-white">{message.message}</p>
    </div>
  );
};

export default Message;
