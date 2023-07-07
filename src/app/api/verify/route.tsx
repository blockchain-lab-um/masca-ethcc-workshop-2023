import { NextResponse } from 'next/server';
import { getAgent } from '../veramoSetup';
import { MinimalImportableKey } from '@veramo/core';

const address =
  process.env.ADDRESS || '0xe8c79F750986cD74f0f793F2e790734c7878986B';
const pk =
  process.env.PRIVATE_KEY ||
  '5aaf3ef1c94aaa6ba52ece09d9017d1c38708dbaa9258f402195782480b35e85';
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
