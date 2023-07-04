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

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    ICredentialIssuer &
    ICredentialVerifier
>;

const INFURA_PROJECT_ID = 'da2069d93bdf491f992fb8cae21ba41b';

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
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:ethr:rinkeby',
        providers: {
          'did:ethr:rinkeby': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'rinkeby',
            rpcUrl: 'https://rinkeby.infura.io/v3/' + INFURA_PROJECT_ID,
            gas: 1000001,
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
          ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
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
