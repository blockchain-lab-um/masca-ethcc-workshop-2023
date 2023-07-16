import { NextResponse } from 'next/server';
import { getAgent } from '../veramoSetup';
import { MinimalImportableKey } from '@veramo/core';
import { ADDRESS, ISSUER, PRIVATE_KEY, REQUIRED_TYPE } from '../constants';
import { keccak256 } from 'ethers';

export async function GET(request: Request) {
  return NextResponse.json(
    {
      issuer: ISSUER,
      requiredType: REQUIRED_TYPE,
    },
    {
      status: 200,
    }
  );
}

export async function POST(request: Request) {
  const { name, password, did } = await request.json();
  const passwordHash = keccak256(Buffer.from(password));
  if (passwordHash !== process.env.PASSWORD_HASH) {
    return NextResponse.json({
      error: 'Invalid password',
      status: 401,
    });
  }
  const agent = await getAgent();
  const controllerKeyId = 'key-1';
  const method = 'did:ethr';
  const issuerDid = await agent.didManagerImport({
    did: `did:ethr:mainnet:${ADDRESS}`,
    provider: method,
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: 'Secp256k1',
        kms: 'local',
        privateKeyHex: PRIVATE_KEY,
      } as MinimalImportableKey,
    ],
  });
  const vc = await agent.createVerifiableCredential({
    credential: {
      issuer: { id: issuerDid.did },
      issuanceDate: new Date().toISOString(),
      type: ['VerifiableCredential', REQUIRED_TYPE],
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
