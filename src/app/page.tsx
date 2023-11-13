'use client';
import VCCard from '@/components/VCCard';
import type { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { isError } from '@blockchain-lab-um/utils';
import type { W3CVerifiableCredential } from '@veramo/core';
import { useEffect, useState } from 'react';
import { useUserStore } from '../lib/store';
import { useRouter } from 'next/navigation';
import { insertOrGetUser } from '../lib/supabase';
import ChannelList from '@/components/ChannelList';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  const {
    setUsername,
    username,
    connected,
    setUser,
    setAuthenticated,
    api,
    did,
  } = useUserStore((state) => ({
    username: state.username,
    setUsername: state.setUsername,
    setUser: state.setUser,

    connected: state.connected,

    did: state.did,
    setDid: state.setDid,

    api: state.api,
    setApi: state.setApi,

    setAuthenticated: state.setAuthenticated,
  }));
  const router = useRouter();
  const [hasValidVc, setHasValidVc] = useState(false);
  const [vcs, setVcs] = useState<QueryCredentialsRequestResult[]>([]);
  const [vcsQueried, setVcsQueried] = useState(false);
  // const [password, setPassword] = useState<string>('');
  const [issuer, setIssuer] = useState<string>('');
  const [requiredType, setRequiredType] = useState<string>('');
  const [querying, setQuerying] = useState(false);

  useEffect(() => {
    const handleAsync = async () => {
      const response = await fetch('/api/issue', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { issuer, requiredType } = await response.json();
      setIssuer(issuer);
      setRequiredType(requiredType);
    };
    handleAsync();
  });

  useEffect(() => {
    const handleVcsChange = async (vcs: QueryCredentialsRequestResult[]) => {
      setHasValidVc(false);
      vcs.forEach((vc) => {
        if (vc.data?.type?.includes(requiredType)) {
          setHasValidVc(true);
          return;
        }
      });
    };
    handleVcsChange(vcs);
  }, [vcs]);

  const queryVCs = async () => {
    setQuerying(true);
    if (!api) {
      return;
    }
    const filter = `$[?((@.data.type == "${requiredType}" || @.data.type.includes("${requiredType}")) && ((@.data.issuer == "${issuer}") || (@.data.issuer.id == "${issuer}")))]`;
    // An example of using JSONPath to filter VCs
    const vcs = await api.queryCredentials({
      filter: {
        type: 'JSONPath',
        filter,
      },
    });
    if (isError(vcs)) {
      console.error(vcs.error);
      setQuerying(false);
      return;
    }
    setVcs(vcs.data);
    setVcsQueried(true);
    setQuerying(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.target.value);
  // };

  const getVC = async () => {
    if (!api) {
      return;
    }

    const { user, success, err } = await insertOrGetUser({
      did,
      username,
    });
    if (!success) {
      alert(err);
      return;
    }
    setUser(user);

    // Post request with fetch API
    const response = await fetch('/api/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: user.username /*, password*/, did }),
    });

    const credentialResponse = await response.json();
    if (credentialResponse.status === 401) {
      alert(credentialResponse.error);
    }

    console.log(
      '🚀 ~ file: page.tsx:136 ~ getVC ~ credential.credential: ',
      credentialResponse.credential
    );
    const saveResult = await api.saveCredential(credentialResponse.credential, {
      store: 'snap',
    });
    if (isError(saveResult)) {
      console.error(saveResult.error);
      return;
    }

    setVcs([
      ...vcs,
      { data: credentialResponse.credential, metadata: saveResult.data[0] },
    ]);
    setHasValidVc(true);
  };

  const createVP = async (vc: W3CVerifiableCredential) => {
    if (!api) {
      return;
    }
    const vp = await api.createPresentation({
      vcs: [vc],
      proofFormat: 'EthereumEip712Signature2021',
    });
    if (isError(vp)) {
      console.error(vp.error);
      return;
    }
    if (!vp.data.verifiableCredential) {
      console.error(
        'No VerifiableCredential found in the VerifiablePresentation'
      );
      return;
    }
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vp: vp.data }),
    });

    const result = await response.json();
    console.log('Generated VP: ', vp.data);
    return result.valid;
  };

  const deleteVC = async (id: string) => {
    if (!api) {
      return;
    }
    const deleteResult = await api.deleteCredential(id);
    if (isError(deleteResult)) {
      console.error(deleteResult.error);
      return;
    }

    setVcs(vcs.filter((vc) => vc.metadata.id !== id));
  };

  // An example on how to ask for VP from a VC, and give special permissions based on that.
  // In this case, if the user has a VC with type REQUIRED_TYPE, they can enter the
  // restricted chatroom.
  const enterChat = async (channelId: string) => {
    if (!api) {
      return;
    }
    const vc = vcs.find((vc) => {
      return vc.data?.type?.includes(requiredType);
    });
    if (!vc) {
      alert('You do not have the required VC to enter this chatroom');
      console.error('No VC found');
      return;
    }
    const result = await createVP(vc.data);

    if (!result) {
      alert('You do not have the required VC to enter this chatroom');
      return;
    }
    if (result) {
      const { user, success, err } = await insertOrGetUser({
        did,
        username,
      });
      if (!success) {
        alert(err);
        return;
      }
      setUser(user);
      setAuthenticated(true);
      router.push(`/chat/${channelId}`);
      return;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex h-full w-full flex-1 flex-col p-6">
        {!connected && (
          <div className="flex h-full w-1/2 flex-col items-center justify-center self-center p-16">
            <p className="text-center text-xl">Welcome to</p>
            <p className="m-4 text-center text-3xl">
              <span className="font-bold text-orange-400">
                Decentralized Identity meets MetaMask
              </span>
            </p>
            <p className="items-center text-center text-lg italic">
              This dApp is a part of the EthCC[6] workshop where we explore the
              exciting intersection of decentralized identity and MetaMask. We
              will take a look at how to integrate Masca into a dApp, set it up,
              and get our{' '}
              <span className="font-bold not-italic">
                demo{' '}
                <Link
                  className="text-sky-400"
                  target="_blank"
                  href="https://www.ethcc.io/"
                >
                  EthCC[6]
                </Link>{' '}
                x{' '}
                <Link
                  className="text-orange-400"
                  target="_blank"
                  href="https://masca.io"
                >
                  Masca
                </Link>{' '}
                Workshop Verifiable Credential
              </span>
              . We will show you how decentralized identity and MetaMask can
              work together to create a more secure and decentralized web.
            </p>
            <p className="m-4">
              Feel free to check out this dApp&apos;s{' '}
              <Link
                className="text-sky-400 underline hover:opacity-80 active:opacity-50"
                href="https://github.com/blockchain-lab-um/masca-ethcc-workshop-2023"
                target="_blank"
              >
                codebase
              </Link>
              .
            </p>
          </div>
        )}
        {connected && !vcsQueried && (
          <div className="flex h-full items-center justify-center p-16">
            <button
              className="h-12 rounded-lg bg-white p-2 font-semibold text-gray-800 transition-all hover:bg-white/60 active:opacity-50"
              onClick={queryVCs}
              disabled={querying}
            >
              Query VCs
            </button>
          </div>
        )}
        {connected && vcsQueried && (
          <div className="flex flex-1 ">
            <div className="w-2/3">
              {!hasValidVc && (
                <div className="flex flex-col items-center justify-center p-16">
                  <div className="text-xl font-semibold">
                    Get your Workshop VC
                  </div>
                  <div className="mt-4 p-2">
                    <div className="flex justify-end gap-x-2">
                      <label className="font-semibold text-gray-300">
                        Name
                      </label>
                      <input
                        onChange={handleNameChange}
                        className="text-gray-800"
                        type="text"
                      />
                    </div>
                    {/* <div className="mt-4 flex justify-end gap-x-2">
                      <label className="font-semibold text-gray-300">
                        Password
                      </label>
                      <input
                        onChange={handlePasswordChange}
                        className="text-gray-800"
                        type="password"
                      />
                    </div> */}
                  </div>
                  <button
                    onClick={getVC}
                    className="mt-2 rounded-lg bg-orange-500 p-2 font-semibold text-slate-100 transition-all hover:bg-orange-500/80 active:opacity-50"
                  >
                    Get VC
                  </button>
                </div>
              )}
              {vcs.length > 0 && (
                <div className="flex flex-col items-center justify-center p-16">
                  {vcs.map((vc) =>
                    vc.data.type?.includes(requiredType) ? (
                      <VCCard
                        vc={vc}
                        key={vc.metadata.id}
                        createVP={createVP}
                        deleteVC={deleteVC}
                      />
                    ) : null
                  )}
                </div>
              )}
            </div>
            <div className="w-1/3">
              <ChannelList enterChat={enterChat} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
