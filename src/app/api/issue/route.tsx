import { NextResponse } from 'next/server';
import { getAgent } from '../veramoSetup';
import { MinimalImportableKey } from '@veramo/core';

const address =
  process.env.ADDRESS || '0xe8c79F750986cD74f0f793F2e790734c7878986B';
const pk =
  process.env.PRIVATE_KEY ||
  '5aaf3ef1c94aaa6ba52ece09d9017d1c38708dbaa9258f402195782480b35e85';

export async function POST(request: Request) {
  const { name, password, did } = await request.json();

  const agent = await getAgent();
  const controllerKeyId = 'key-1';
  const method = 'did:ethr';
  const issuerDid = await agent.didManagerImport({
    did: `did:ethr:mainnet:${address}`,
    provider: method,
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: 'Secp256k1',
        kms: 'local',
        privateKeyHex: pk,
      } as MinimalImportableKey,
    ],
  });
  const vc = await agent.createVerifiableCredential({
    credential: {
      issuer: { id: issuerDid.did },
      issuanceDate: new Date().toISOString(),
      type: ['VerifiableCredential', 'MascaWorkshopPOAP'],
      credentialSubject: {
        name: name,
        id: did,
      },
    },
    proofFormat: 'jwt',
  });

  return NextResponse.json(
    {
      credential: vc,
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
