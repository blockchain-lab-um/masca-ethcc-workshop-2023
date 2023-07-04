import {
  createAgent,
  CredentialStatus,
  IIdentifier,
  type ICredentialVerifier,
  type IDataStore,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
  type TAgent,
  IKey,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import {
  CredentialPlugin,
  type ICredentialIssuer,
} from '@veramo/credential-w3c';
import {
  AbstractDIDStore,
  AbstractIdentifierProvider,
  DIDManager,
} from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    ICredentialIssuer &
    ICredentialVerifier
>;

const networks = [
  {
    name: 'mainnet',
    provider: new JsonRpcProvider(
      'https://mainnet.infura.io/v3/bf246ad3028f42318f2e996a7aa85bfc'
    ),
  },
  {
    name: '0x05',
    provider: new JsonRpcProvider(
      'https://goerli.infura.io/v3/bf246ad3028f42318f2e996a7aa85bfc'
    ),
  },
  {
    name: 'goerli',
    provider: new JsonRpcProvider(
      'https://goerli.infura.io/v3/bf246ad3028f42318f2e996a7aa85bfc'
    ),
    chainId: '0x5',
  },
  {
    name: 'sepolia',
    provider: new JsonRpcProvider(
      'https://sepolia.infura.io/v3/bf246ad3028f42318f2e996a7aa85bfc'
    ),
    chainId: '0xaa36a7',
  },
];

export const getAgent = async (): Promise<Agent> => {
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      ICredentialIssuer &
      ICredentialVerifier
  >({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:ethr',
        providers: {
          'did:ethr': new EthrDIDProvider({
            defaultKms: 'local',
            networks,
          }),
        },
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ networks }),
        }),
      }),
    ],
  });
  return agent;
};

// Create a class MemoryDIDStore that extends AbstractDIDStore
class MemoryDIDStore extends AbstractDIDStore {
  // Create a private property store of type Map<string, IIdentifier>
  #store: Map<string, IIdentifier> = new Map();

  // Implement the abstract methods
  async importDID(did: IIdentifier): Promise<boolean> {
    // Store the did in the store
    this.#store.set(did.did, did);
    return true;
  }

  async getDID(args: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    // Get the did from the store
    const did = this.#store.get(args.did);
    if (!did) throw Error('DID not found');
    return did;
  }

  async deleteDID(args: { did: string }): Promise<boolean> {
    // Delete the did from the store
    const did = this.#store.delete(args.did);
    if (!did) throw Error('DID not found');
    return true;
  }

  async listDIDs(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    // Return all the dids from the store
    return Array.from(this.#store.values());
  }
}
