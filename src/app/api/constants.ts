export const ADDRESS =
  process.env.ADDRESS || '0xe8c79F750986cD74f0f793F2e790734c7878986B';
export const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  '5aaf3ef1c94aaa6ba52ece09d9017d1c38708dbaa9258f402195782480b35e85';
export const ISSUER = `did:ethr:mainnet:${ADDRESS}`;
export const REQUIRED_TYPE = process.env.REQUIRED_TYPE || 'MascaWorkshopPOAP';
