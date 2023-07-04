import { IMessage } from '@/app/lib/supabase';

export const Message = ({ message }: { message: IMessage }) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      <p className="font-bold text-blue-700">{message.user?.username}</p>
      <p className="text-white">{message.message}</p>
    </div>
  );
};

export default Message;
