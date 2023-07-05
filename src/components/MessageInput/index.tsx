import { useState } from 'react';

interface IMessageInputProps {
  disabled: boolean;
  onSubmit: (text: string) => Promise<void>;
}
export const MessageInput = (props: IMessageInputProps) => {
  const { onSubmit } = props;
  const [messageText, setMessageText] = useState('');
  const submitOnEnter = (event: any) => {
    if (event.keyCode === 13 && messageText !== '') {
      onSubmit(messageText);
      setMessageText('');
    }
  };
  return (
    <input
      disabled={props.disabled}
      className="w-full appearance-none rounded border bg-opacity-100 px-3 py-2 leading-tight text-gray-700 shadow focus:bg-blue-300 focus:outline-none"
      type="text"
      placeholder="Send a message"
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      onKeyDown={(e) => submitOnEnter(e)}
    />
  );
};
