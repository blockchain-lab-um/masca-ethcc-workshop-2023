import { useState, useEffect, type SetStateAction, type Dispatch } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { IMessage } from '@/types/message.types';
import type { IUser } from '@/types/user.types';
import { IChannel } from '@/types/channel.types';

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

export const useSupabaseStore = (params: {
  channelId: string;
  privileged: boolean;
}) => {
  const { channelId, privileged } = params;
  const [channel, setChannel] = useState<IChannel | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [newMessage, handleNewMessage] = useState<IMessage | null>(null);
  const [newUser, handleNewOrUpdatedUser] = useState<IUser | null>(null);
  // Load initial data and set up listeners
  useEffect(() => {
    const handleAsync = async () => {
      const channel = (await fetchChannel({
        channelId: channelId,
      })) as IChannel[];
      if (channel) setChannel(channel[0] as IChannel);
      if (channel[0].protected && !privileged) {
        return;
      }
      if (channel[0].protected && privileged) {
        fetchMessages({ channelId, setState: setMessages });
      }
      if (!channel[0].protected) {
        fetchMessages({ channelId, setState: setMessages });
      }
      fetchUsers({ setState: setUsers });
    };
    handleAsync();
    // Listen for new messages
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.channel === channelId) {
            handleNewMessage(payload.new as IMessage);
          }
        }
      )
      .subscribe();
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        (payload) => handleNewOrUpdatedUser(payload.new as IUser)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userListener);
      supabase.removeChannel(messageListener);
    };
  }, []);

  useEffect(() => {
    const handleAsync = async () => {
      if (newMessage?.channel !== channelId) return;
      const user = users.find((user) => {
        return user.id === newMessage.sender;
      });

      let msg: IMessage;
      if (user) {
        msg = { ...newMessage, user } as IMessage;
      } else {
        msg = {
          ...newMessage,
          user: { username: newMessage.senderDid },
        } as IMessage;
      }
      setMessages(messages.concat(msg));
    };
    if (newMessage && Object.keys(newMessage).length > 0) {
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage as IMessage]);

  // New or updated user received from Postgres
  useEffect(() => {
    if (newUser) setUsers(users.concat(newUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUser]);

  return {
    messages,
    users,
  };
};

export const fetchMessages = async (params: {
  channelId: string;
  setState: Dispatch<SetStateAction<IMessage[]>>;
}) => {
  const { channelId, setState } = params;
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, user:users(username, id)')
      .eq('channel', channelId)
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

export const fetchChannels = async (params: {
  setState?: Dispatch<SetStateAction<IChannel[]>>;
}) => {
  const { setState } = params;
  try {
    const { data: channels, error } = await supabase
      .from('channels')
      .select('*');
    if (error) {
      console.log('error', error);
      return;
    }
    if (setState) setState(channels);
    return channels as IChannel[];
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchChannel = async (params: { channelId: string }) => {
  const { channelId: id } = params;
  try {
    const { data: channel, error } = await supabase
      .from('channels')
      .select('*')
      .eq('id', id);
    if (error) {
      console.log('error', error);
      return;
    }
    return channel as IChannel[];
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
  channel: string;
  did: string;
}) => {
  try {
    const { message, sender, channel, did } = params;
    let { data, error } = await supabase
      .from('messages')
      .insert([{ message, sender, channel, senderDid: did }])
      .select();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const getUserBy = async (params: { col: string; value: string }) => {
  const { col, value } = params;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq(col, value)
    .single();
  if (error) {
    console.log('error', error);
    return;
  }

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
  const userByDid = await getUserBy({ col: 'did', value: did });
  if (userByDid) {
    return { user: userByDid, success: true };
  }
  const userByUsername = await getUserBy({ col: 'username', value: username });
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
