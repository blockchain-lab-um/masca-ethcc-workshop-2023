'use client';
import { VCCard } from '@/components/VCCard';
import type { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import type { W3CVerifiableCredential } from '@veramo/core';
import { useEffect, useState } from 'react';
import { useUserStore } from './lib/store';
import { useRouter } from 'next/navigation';
import { insertOrGetUser } from './lib/supabase';
import { ChannelList } from '@/components/ChannelList';

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
  const [vcs, setVcs] = useState<QueryVCsRequestResult[]>([]);
  const [vcsQueried, setVcsQueried] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [issuer, setIssuer] = useState<string>('');
  const [requiredType, setRequiredType] = useState<string>('');

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
    const handleVcsChange = async (vcs: QueryVCsRequestResult[]) => {
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
    if (!api) {
      return;
    }
    const filter = `$[?((@.data.type == "${requiredType}" || @.data.type.includes("${requiredType}")) && ((@.data.issuer == "${issuer}") || (@.data.issuer.id == "${issuer}")))]`;
    // An example of using JSONPath to filter VCs
    const vcs = await api.queryVCs({
      filter: {
        type: 'JSONPath',
        filter,
      },
    });
    if (isError(vcs)) {
      console.error(vcs.error);
      return;
    }
    setVcs(vcs.data);
    setVcsQueried(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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
      body: JSON.stringify({ name: user.username, password, did }),
    });
    const credential = await response.json();

    const saveResult = await api.saveVC(credential.credential, {
      store: 'snap',
    });
    if (isError(saveResult)) {
      console.error(saveResult.error);
      return;
    }

    setVcs([
      ...vcs,
      { data: credential.credential, metadata: saveResult.data[0] },
    ]);
    setHasValidVc(true);
  };

  const createVP = async (vc: W3CVerifiableCredential) => {
    if (!api) {
      return;
    }
    const vp = await api.createVP({
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
    const deleteResult = await api.deleteVC(id);
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
      {connected && !vcsQueried && (
        <div className="flex justify-center p-16">
          <button
            className="rounded-lg bg-white p-2 font-semibold text-gray-800 transition-all hover:bg-white/60"
            onClick={queryVCs}
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
                    <label className="font-semibold text-gray-300">Name</label>
                    <input
                      onChange={handleNameChange}
                      className="text-gray-800"
                      type="text"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-x-2">
                    <label className="font-semibold text-gray-300">
                      Password
                    </label>
                    <input
                      onChange={handlePasswordChange}
                      className="text-gray-800"
                      type="password"
                    />
                  </div>
                </div>
                <button
                  onClick={getVC}
                  className="mt-2 rounded-lg bg-orange-500 p-2 font-semibold text-slate-100 transition-all hover:bg-orange-500/80"
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
  );
}
