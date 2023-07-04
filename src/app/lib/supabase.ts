import { useState, useEffect, SetStateAction } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface User {
  readonly id: number;
  username: string;
}

export interface IMessage {
  readonly id: number;
  message: string;
  user?: User;
}

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
  options
);

export const useSupabase = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users] = useState<User[]>([]);
  const [newMessage, handleNewMessage] = useState<IMessage | null>(null);
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<User | null>(
    null
  );
  // Load initial data and set up listeners
  useEffect(() => {
    fetchMessages(setMessages);
    // Listen for new and deleted messages
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) =>
          handleNewMessage(payload.new as SetStateAction<IMessage | null>)
      )
      .subscribe();
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) =>
          handleNewOrUpdatedUser(payload.new as SetStateAction<User | null>)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userListener);
      supabase.removeChannel(messageListener);
    };
  }, []);

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && Object.keys(newMessage).length > 0) {
      const handleAsync = async () => {
        // let authorId = newMessage.sender;
        // if (!users.get(authorId))
        //   await fetchUser(authorId, (user) => handleNewOrUpdatedUser(user));
        setMessages(messages.concat(newMessage));
      };
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage as IMessage]);

  // New or updated user received from Postgres
  useEffect(() => {
    // TODO: use map instead of array
    if (newOrUpdatedUser) users.push(newOrUpdatedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser]);

  return {
    // We can export computed values here to map the authors to each message
    messages,
    users,
  };
};

export const fetchUser = async (userId: string, setState: any) => {
  try {
    let { data } = (await supabase
      .from('users')
      .select(`*`)
      .eq('id', userId)) as any;
    let user = data[0] || '';
    if (setState) setState(user);
    return user;
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchMessages = async (setState: any) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, user:users(username, id)')
      .order('created_at', { ascending: true });

    if (error) {
      console.log('error', error);
      return;
    }

    if (setState) setState(messages);
    return messages;
  } catch (error) {
    console.log('error', error);
  }
};

export const addMessage = async (message: string, user_id: string) => {
  try {
    let { data } = await supabase
      .from('messages')
      .insert([{ message, user_id }])
      .select();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};
