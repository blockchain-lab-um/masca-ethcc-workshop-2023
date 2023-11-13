import { MascaApi } from '@blockchain-lab-um/masca-connector';
import { create } from 'zustand';

interface UserStore {
  id: number | null;
  username: string;
  authenticated: boolean;
  connected: boolean;
  api: MascaApi;
  did: string;
  method: string;

  setUsername: (username: string) => void;
  setId: (id: number) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setApi: (api: MascaApi) => void;
  setDid: (did: string) => void;
  setUser: (user: Partial<UserStore>) => void;
  setConnected: (connected: boolean) => void;
  setMethod: (method: string) => void;
}

export const userStoreInitialState = {
  id: null,
  username: '',
  authenticated: false,
  connected: false,
  api: {} as MascaApi,
  did: '',
  method: 'did:ethr',
};

export const useUserStore = create<UserStore>()((set) => ({
  ...userStoreInitialState,

  setUsername: (username: string) => set({ username }),
  setUser: (user: Partial<UserStore>) => set(user),
  setId: (id: number) => set({ id }),
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
  setApi: (api: MascaApi) => set({ api }),
  setDid: (did: string) => set({ did }),
  setConnected: (connected: boolean) => set({ connected }),
  setMethod: (method: string) => set({ method }),
}));
