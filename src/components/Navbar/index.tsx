'use client';
import { useUserStore } from '@/lib/store';
import { getUserBy } from '@/lib/supabase';
import { enableMasca } from '@blockchain-lab-um/masca-connector';
import { isError } from '@blockchain-lab-um/utils';
import Image from 'next/image';
import Link from 'next/link';
import DropdownMenu from '../Dropdown';
import { AvailableMethods } from '@blockchain-lab-um/masca-types';

export const Navbar = (props: any) => {
  const {
    connected,
    username,
    setUser,
    setApi,
    setConnected,
    setDid,
    did,
    api,
    method,
    setMethod,
  } = useUserStore((state) => ({
    username: state.username,
    setUsername: state.setUsername,
    setUser: state.setUser,

    connected: state.connected,
    setConnected: state.setConnected,

    did: state.did,
    setDid: state.setDid,
    method: state.method,
    setMethod: state.setMethod,

    api: state.api,
    setApi: state.setApi,

    setAuthenticated: state.setAuthenticated,
  }));

  const connect = async () => {
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const masca = await enableMasca((addresses as string[])[0]);

    if (isError(masca)) {
      console.error(masca.error);
      return;
    }

    const api = masca.data.getMascaApi();
    const did = await api.getDID();
    const method = await api.getSelectedMethod();
    setApi(api);
    setMethod(method.success ? method.data : '');
    setConnected(true);
    if (isError(did)) {
      console.error(did.error);
      return;
    }
    const user = await getUserBy({ col: 'did', value: did.data });
    if (user) setUser(user);
    setDid(did.data);
  };

  const handleMethodSelect = async (method: string) => {
    const selectedMethod = await api.switchDIDMethod(
      method as AvailableMethods
    );
    if (isError(selectedMethod)) {
      console.error(selectedMethod.error);
      return;
    }
    const currMethod = await api.getSelectedMethod();
    if (isError(currMethod)) {
      console.error(currMethod.error);
      return;
    }

    setMethod(currMethod.data);
    setDid(selectedMethod.data);
  };

  return (
    <div className="flex w-full justify-between p-6">
      <Link href="/">
        <div className="flex items-center gap-2 font-ubuntu text-2xl">
          <Image
            src="/masca_white.png"
            alt="masca-logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-orange-400">EthCC[6]</span> Workshop
        </div>
      </Link>
      <div className="flex items-center">
        {connected && (
          <div className="flex">
            <div className="p-4 align-middle">
              <DropdownMenu
                size="method"
                rounded="full"
                shadow="none"
                variant="gray"
                items={['did:ethr', 'did:pkh']}
                selected={method}
                setSelected={handleMethodSelect}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Connected</span>
              <Link target="_blank" href={`https://dev.uniresolver.io/#${did}`}>
                <span className="text-lg text-gray-300">
                  {username && '(' + username + ') '}
                  {did}
                </span>
              </Link>
            </div>
          </div>
        )}
        {!connected && (
          <button
            className="rounded-lg bg-white p-2 font-semibold text-gray-800 transition-all hover:bg-white/60 active:opacity-50"
            onClick={connect}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
