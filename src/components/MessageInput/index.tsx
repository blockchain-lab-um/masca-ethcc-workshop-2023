import { useState } from 'react';

interface IMessageInputProps {
  disabled: boolean;
  onSubmit: (text: string) => Promise<void>;
}
export const MessageInput = ({ disabled, onSubmit }: IMessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const submitOnEnter = (event: any) => {
    if (event.keyCode === 13 && messageText !== '') {
      onSubmit(messageText);
      setMessageText('');
    }
  };
  return (
    <input
      disabled={disabled}
      className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:bg-slate-300 focus:outline-none"
      type="text"
      placeholder="Send a message"
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      onKeyDown={(e) => submitOnEnter(e)}
    />
  );
};
