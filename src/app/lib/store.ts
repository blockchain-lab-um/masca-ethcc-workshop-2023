import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface IUser {
  readonly id: number;
  username: string;
}

export interface IMessage {
  readonly id: number;
  message: string;
  sender?: number;
  user?: IUser;
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
  const [users, setUsers] = useState<IUser[]>([]);
  const [newMessage, handleNewMessage] = useState<IMessage | null>(null);
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<IUser | null>(
    null
  );
  // Load initial data and set up listeners
  useEffect(() => {
    fetchMessages(setMessages);
    fetchUsers(setUsers);
    // Listen for new and deleted messages
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          handleNewMessage(payload.new as IMessage);
        }
      )
      .subscribe();
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => handleNewOrUpdatedUser(payload.new as IUser)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userListener);
      supabase.removeChannel(messageListener);
    };
  }, []);

  // New message received from Postgres
  useEffect(() => {
    console.log('newMessage', newMessage);
    if (newMessage && Object.keys(newMessage).length > 0) {
      const handleAsync = async () => {
        const user = users.find((user) => {
          return user.id === newMessage.sender;
        });
        setMessages(messages.concat({ ...newMessage, user } as IMessage));
      };
      handleAsync();
    }
  }, [newMessage as IMessage]);

  // New or updated user received from Postgres
  useEffect(() => {
    // TODO: use map instead of array
    if (newOrUpdatedUser) users.push(newOrUpdatedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser]);

  return {
    messages,
    users,
  };
};

export const fetchMessages = async (
  setState: Dispatch<SetStateAction<IMessage[]>>
) => {
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

export const fetchUsers = async (
  setState: Dispatch<SetStateAction<IUser[]>>
) => {
  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) {
      console.log('error', error);
      return;
    }
    if (setState) setState(users);
    return users;
  } catch (error) {
    console.log('error', error);
  }
};

export const addMessage = async (message: string, sender: number) => {
  try {
    let { data } = await supabase
      .from('messages')
      .insert([{ message, sender }])
      .select();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};
