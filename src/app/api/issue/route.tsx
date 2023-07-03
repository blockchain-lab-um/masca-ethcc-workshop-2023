import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    {
      message: 'Hello from the Issuer',
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
