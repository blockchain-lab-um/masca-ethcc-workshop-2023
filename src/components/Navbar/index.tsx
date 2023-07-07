import { useUserStore } from '@/app/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type NavbarProps = {
  connect: () => void;
  connected: boolean;
  username?: string;
};

export const Navbar = ({ connect, connected, username }: NavbarProps) => {
  const { did } = useUserStore((state) => ({
    did: state.did,
  }));

  return (
    <div className="flex w-full justify-between border-b-2 border-white p-6">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Image src="/masca_white.png" alt="masca-logo" width={40} height={36} />
        <span className="text-orange-400">EthCC[6]</span> Workshop
      </div>
      <div className="flex items-center">
        {connected && (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Connected</span>
            <Link target="_blank" href={`https://dev.uniresolver.io/#${did}`}>
              <span className="text-lg text-gray-300">
                {username && '(' + username + ') '}
                {did}
              </span>
            </Link>
          </div>
        )}
        {!connected && (
          <button
            className="rounded-lg bg-white p-2 font-semibold text-gray-800 transition-all hover:bg-white/60"
            onClick={connect}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};
