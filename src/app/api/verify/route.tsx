import { NextResponse } from 'next/server';
import { getAgent } from '../veramoSetup';
import { MinimalImportableKey } from '@veramo/core';

const address = '0x5c74DbEf6e5cA7eCBA05de2a1A1eE65b7D662ffF';
const pk = 'acb96d1a413eea8e2ff39d6675e39fd1f7d78629c057e1fba1f0cc9dafb7e1f4';
const issuer = `did:ethr:mainnet:${address}`;

export async function POST(request: Request) {
  const { vp } = await request.json();
  const agent = await getAgent();

  let valid = false;
  const res = await agent.verifyPresentation({ presentation: vp });
  if (res.verified) {
    const decodedVerifiableCredential = JSON.parse(
      atob(vp.verifiableCredential[0].split('.')[1])
    );

    if (
      vp.holder === decodedVerifiableCredential.sub &&
      decodedVerifiableCredential.iss === issuer &&
      decodedVerifiableCredential.vc.type[1] === 'MascaWorkshopPOAP'
    ) {
      valid = true;
    }
  }

  return NextResponse.json(
    {
      valid: valid,
    },
    {
      status: 200,
    }
  );
}

export async function OPTIONS(_: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
