import { useState } from 'react';

interface IMessageInputProps {
  disabled: boolean;
  onSubmit: (text: string) => Promise<void>;
}
const MessageInput = ({ disabled, onSubmit }: IMessageInputProps) => {
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
      className="h-full w-full appearance-none rounded border px-3 leading-tight text-gray-700 shadow focus:bg-slate-300 focus:outline-none"
      type="text"
      placeholder="Send a message"
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      onKeyDown={(e) => submitOnEnter(e)}
    />
  );
};

export default MessageInput;
