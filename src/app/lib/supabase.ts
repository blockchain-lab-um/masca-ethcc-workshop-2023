import { useState, useEffect, type SetStateAction, type Dispatch } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { IMessage } from '@/types/messages.types';
import type { IUser } from '@/types/user.types';

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

export const useStore = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [newMessage, handleNewMessage] = useState<IMessage | null>(null);
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<IUser | null>(
    null
  );
  // Load initial data and set up listeners
  useEffect(() => {
    fetchMessages({ setState: setMessages });
    fetchUsers({ setState: setUsers });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const fetchMessages = async (params: {
  setState: Dispatch<SetStateAction<IMessage[]>>;
}) => {
  const { setState } = params;
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

export const addUser = async (params: { username: string; did: string }) => {
  const { username, did } = params;
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, did }])
      .select();
    if (error) {
      console.log('error', error);
      return null;
    }
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchUsers = async (params: {
  setState: Dispatch<SetStateAction<IUser[]>>;
}) => {
  const { setState } = params;
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

export const addMessage = async (params: {
  message: string;
  sender: number;
}) => {
  const { message, sender } = params;
  try {
    let { data, error } = await supabase
      .from('messages')
      .insert([{ message, sender }])
      .select();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const doesExist = async (params: { col: string; did: string }) => {
  const { col, did } = params;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq(col, did)
    .single();

  if (error) return console.error(error);

  if (data) {
    return data as IUser;
  }

  return null;
};

export const insertOrGetUser = async (params: {
  did: string;
  username: string;
}) => {
  const { did, username } = params;
  const userByDid = await doesExist({ col: 'did', did });
  if (userByDid) {
    return { user: userByDid, success: true };
  }
  const userByUsername = await doesExist({ col: 'username', did: username });
  if (userByUsername) {
    return {
      user: userByUsername,
      success: false,
      err: 'Username taken',
    };
  }

  const inserted = await addUser({ username, did });
  if (inserted) {
    return { user: inserted[0], success: true };
  }

  return { user: null, success: false, err: 'Something went wrong' };
};

export const getUser = async (did: string, username: string) => {};
