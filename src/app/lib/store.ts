import { MascaApi } from '@blockchain-lab-um/masca-types';
import { create } from 'zustand';

interface UserStore {
  id: number | null;
  username: string;
  authenticated: boolean;
  api: MascaApi;
  did: string;

  setUsername: (username: string) => void;
  setId: (id: number) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setApi: (api: MascaApi) => void;
  setDid: (did: string) => void;
  setUser: (user: Partial<UserStore>) => void;
}

export const userStoreInitialState = {
  id: null,
  username: '',
  authenticated: false,
  api: {} as MascaApi,
  did: '',
};

export const useUserStore = create<UserStore>()((set) => ({
  ...userStoreInitialState,

  setUsername: (username: string) => set({ username }),
  setUser: (user: Partial<UserStore>) => set(user),
  setId: (id: number) => set({ id }),
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
  setApi: (api: MascaApi) => set({ api }),
  setDid: (did: string) => set({ did }),
}));
