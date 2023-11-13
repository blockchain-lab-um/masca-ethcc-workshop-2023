import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { W3CVerifiableCredential } from '@veramo/core';
import React from 'react';

type VCCardProps = {
  vc: QueryCredentialsRequestResult;
  deleteVC: (id: string) => void;
  createVP: (vc: W3CVerifiableCredential) => any;
};

const VCCard = ({ vc, deleteVC, createVP }: VCCardProps) => {
  return (
    <div className="relative mb-4 h-40 w-72 rounded-xl bg-white p-4 text-gray-800">
      <div className="flex justify-between break-words font-semibold">
        {vc.data.type && vc.data.type[1]}
        <button
          onClick={() => deleteVC(vc.metadata.id)}
          className="text-red-500 active:opacity-50"
        >
          X
        </button>
      </div>
      {vc.data.credentialSubject.name && (
        <div className="mt-2">
          <span>Name: </span>
          {vc.data.credentialSubject.name}
        </div>
      )}
      <div className="text-xs">
        <span className="text-lg">Date: </span>
        {vc.data.issuanceDate}
      </div>
      <div className="bottom-0 mt-4 flex justify-end gap-x-1 text-xs">
        <button
          className="active:opacity-50"
          onClick={() => console.log(vc.data)}
        >
          Log
        </button>
        <button
          onClick={() => createVP(vc.data)}
          className="rounded-lg bg-orange-400 p-1 font-semibold hover:bg-orange-400/80 active:opacity-50"
        >
          <p>Create VP</p>
        </button>
      </div>
    </div>
  );
};
export default VCCard;
