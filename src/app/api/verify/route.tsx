import { NextResponse } from 'next/server';
import { getAgent } from '../veramoSetup';
import { MinimalImportableKey } from '@veramo/core';

const address = '0x5c74DbEf6e5cA7eCBA05de2a1A1eE65b7D662ffF';
const pk = 'acb96d1a413eea8e2ff39d6675e39fd1f7d78629c057e1fba1f0cc9dafb7e1f4';

export async function POST(request: Request) {
  const agent = await getAgent();

  return NextResponse.json(
    {
      message: 'Hello from the Verifier',
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
