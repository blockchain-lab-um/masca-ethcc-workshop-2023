import Image from 'next/image';
import React from 'react';

type NavbarProps = {
  connect: () => void;
  connected: boolean;
  did: string;
};

export const Navbar = ({ connect, connected, did }: NavbarProps) => {
  return (
    <div>
      <div className="flex justify-between w-full p-6">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Image
            src="/masca_white.png"
            alt="masca-logo"
            width={40}
            height={36}
          />
          <span className="text-orange-400">Masca</span> Demo
        </div>
        <div className="flex items-center">
          {connected && (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Connected</span>
              <span className="text-lg text-gray-300">{did}</span>
            </div>
          )}
          {!connected && (
            <button
              className="p-2 font-semibold text-gray-800 transition-all bg-white rounded-lg hover:bg-white/60"
              onClick={connect}
            >
              Connect
            </button>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
};
