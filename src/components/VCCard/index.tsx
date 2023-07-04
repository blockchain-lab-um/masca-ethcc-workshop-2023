import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import {
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';
import React from 'react';

type VCCardProps = {
  vc: QueryVCsRequestResult;
  deleteVC: (id: string) => void;
  createVP: (vc: W3CVerifiableCredential) => any;
};

export const VCCard = ({ vc, deleteVC, createVP }: VCCardProps) => {
  return (
    <div className="w-64 h-40 p-4 text-gray-800 bg-white rounded-xl">
      <div className="flex justify-between font-semibold">
        {vc.data.type[1]}
        <button
          onClick={() => deleteVC(vc.metadata.id)}
          className="text-red-500"
        >
          X
        </button>
      </div>
      <div className="mt-2">
        <span>Name: </span>
        {vc.data.credentialSubject.name}
      </div>
      <div className="text-xs">
        <span className="text-lg">Date: </span>
        {vc.data.issuanceDate}
      </div>
      <div className="flex justify-end mt-4 text-xs gap-x-1">
        <button onClick={() => console.log(vc.data)}>Log</button>
        <button
          onClick={() => createVP(vc.data)}
          className="p-1 font-semibold bg-orange-400 rounded-lg hover:bg-orange-400/80"
        >
          Create VP
        </button>
      </div>
    </div>
  );
};
