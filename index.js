"use strict";
import IPFS from 'ipfs-core';
import uint8ArrayConcat from 'uint8arrays/concat.js';
import uint8ArrayToString from 'uint8arrays/to-string.js';

// dag-jose
import dagJose from 'dag-jose';
import { convert } from 'blockcodec-to-ipld-format'
import { sha256 } from 'multiformats/hashes/sha2';
//or https://github.com/ceramicnetwork/js-dag-jose
// import multiformats from 'multiformats/basics.js'
import legacy from 'multiformats/legacy'

// DID
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyDidResolver from 'key-did-resolver'
import { randomBytes } from '@stablelib/random'
import { fromString } from 'uint8arrays'

async function main () {

  const seed = fromString('4064a4f557bb7aaa0b7b9f52c1dfeaa82749ed36a7be44d3f3db39b32694b887', 'base16')
  const did = new DID({
    provider: new Ed25519Provider(seed),
    resolver: { ...KeyDidResolver.default.getResolver() }
  })
  await did.authenticate();
  console.info('DID:',did.id);

  // setup ipfs with dag-jose for signing and encryption
  const dagJoseFormat = convert(dagJose)
  // or (same result...)
  // const hasher = {
  //   [sha256.code]: sha256
  // }
  // const dagJoseFormat = legacy(dagJose, {hashes: hasher})
  console.info(dagJose)
  console.info(dagJoseFormat);
  const ipfs = await IPFS.create({ ipld: { formats: [dagJoseFormat] } })

  const jwe = await did.createDagJWE({
    company: 'brdg',
    content: 'big secret',
  },[
    'did:key:z6MkmuPSwwq8MZTcLMk5uLN9oTMyEfJyN9aF7eCJo3ZZy7U2',
    'did:key:z6MkpXt3dqTbUu7KK9z1QVeuKazxwr52ZdT9LRViENmfpxrH',
    'did:key:z6MkgHyS8dpuk4ZdjveNBf92zGhY4U7BsoKmBMTTxp2rQUvQ',
  ]);
  console.info('JWE:',jwe);
  const cidE = ipfs.dag.put(jwe, { format: 'dag-jose', hashAlg: 'sha2-256' }).catch((err)=>console.log(err))
  console.log(cidE)
}

main()
