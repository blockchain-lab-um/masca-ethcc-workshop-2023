'use client';
import { Navbar } from '@/components/Navbar';
import { VCCard } from '@/components/VCCard';
import { enableMasca } from '@blockchain-lab-um/masca-connector';
import {
  MascaApi,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import {
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';
import { useState } from 'react';

export default function Home() {
  const [api, setApi] = useState<MascaApi | null>(null);
  const [connected, setConnected] = useState(false);
  const [vcs, setVcs] = useState<QueryVCsRequestResult[]>([]);
  const [vcsQueried, setVcsQueried] = useState(false);
  const [did, setDid] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const connect = async () => {
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const masca = await enableMasca(addresses[0]);

    if (isError(masca)) {
      console.error(masca.error);
      return;
    }

    const api = masca.data.getMascaApi();
    const did = await api.getDID();
    setApi(api);
    setConnected(true);
    if (isError(did)) {
      console.error(did.error);
      return;
    }
    setDid(did.data);
  };

  const queryVCs = async () => {
    if (!api) {
      return;
    }
    const vcs = await api.queryVCs();
    if (isError(vcs)) {
      console.error(vcs.error);
      return;
    }
    setVcs(vcs.data);
    setVcsQueried(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const getVC = async () => {
    if (!api) {
      return;
    }

    // Post request with fetch API
    const response = await fetch('/api/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password, did }),
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
    console.log(vp);

    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vp: vp.data }),
    });

    const result = await response.json();

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
    console.log(deleteResult);

    setVcs(vcs.filter((vc) => vc.metadata.id !== id));
  };

  return (
    <div className="w-full h-full">
      <Navbar connect={connect} connected={connected} did={did} />
      {connected && !vcsQueried && (
        <div className="flex justify-center p-16">
          <button
            className="p-2 font-semibold text-gray-800 transition-all bg-white rounded-lg hover:bg-white/60"
            onClick={queryVCs}
          >
            Query VCs
          </button>
        </div>
      )}
      {connected && vcsQueried && vcs.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16">
          <div className="text-xl font-semibold">Get your first VC</div>
          <div className="p-2 mt-4">
            <div className="flex justify-end gap-x-2">
              <label className="font-semibold text-gray-300">Name</label>
              <input
                onChange={handleNameChange}
                className="text-gray-800"
                type="text"
              />
            </div>
            <div className="flex justify-end mt-4 gap-x-2">
              <label className="font-semibold text-gray-300">Password</label>
              <input
                onChange={handlePasswordChange}
                className="text-gray-800"
                type="password"
              />
            </div>
          </div>
          <button
            onClick={getVC}
            className="p-2 mt-2 font-semibold transition-all bg-orange-500 rounded-lg text-slate-100 hover:bg-orange-500/80"
          >
            Get your first VC
          </button>
        </div>
      )}
      {connected && vcsQueried && vcs.length > 0 && (
        <div className="flex flex-col items-center justify-center p-16">
          {vcs.map((vc) => (
            <VCCard
              vc={vc}
              key={vc.metadata.id}
              createVP={createVP}
              deleteVC={deleteVC}
            />
          ))}
        </div>
      )}
    </div>
  );
}
