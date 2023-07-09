import { NextResponse } from 'next/server';
import { getAgent } from '../veramoSetup';
import { ISSUER, REQUIRED_TYPE } from '../constants';

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
      decodedVerifiableCredential.iss === ISSUER &&
      decodedVerifiableCredential.vc.type[1] === REQUIRED_TYPE
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
