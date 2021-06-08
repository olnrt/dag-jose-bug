"use strict";
import IPFS from 'ipfs-core';
import uint8ArrayConcat from 'uint8arrays/concat.js';
import uint8ArrayToString from 'uint8arrays/to-string.js';

// dag-jose
import dagJose from 'dag-jose';
import { convert } from 'blockcodec-to-ipld-format'
import { sha256 } from 'multiformats/hashes/sha2';
import legacy from 'multiformats/legacy'

// DID
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyDidResolver from 'key-did-resolver'
import { fromString } from 'uint8arrays'

import fs from 'fs'

// DIDs
// encrypter
// 4064a4f557bb7aaa0b7b9f52c1dfeaa82749ed36a7be44d3f3db39b32694b887 did:key:z6Mkr6KyLSAdNN8NNBBriYTuzMioufT7T4Kk6XaBKTg1jmqY
// decoder
// 650e4ec042b2c676cce1c4ea7ba0defdfefe39d3b12715dabbcc6b623d9ef8d8 did:key:z6MkmuPSwwq8MZTcLMk5uLN9oTMyEfJyN9aF7eCJo3ZZy7U2
// a979fd55f4382ca7a4edf0e7539fda5341a6a0c0af0f608cdbfacdcb5028fa55 did:key:z6MkpXt3dqTbUu7KK9z1QVeuKazxwr52ZdT9LRViENmfpxrH
// 5767c6d427fc3566bd482b321505af14c708f48b77d5e82d22fb08a2ccbd4baa did:key:z6MkgHyS8dpuk4ZdjveNBf92zGhY4U7BsoKmBMTTxp2rQUvQ

// a039d7d252710efe7bd7503dbd8dddaee7395ffa4c7b469f756d7f8aa551b9b0 did:key:z6MkiecsBfENz1UDKhFsUQUtVbNk4J5Um3vtvnnDg2wTBvEL
// 2e095c3eafbcfe1191cf1b35c6cd5ccc610583095f13e6f18be4c19822321c88 did:key:z6MkgCJiUb6GxUWd9QnP4TYsi6KgA5SyR6ghuPJj3pVpq21R
// 4064a4f557bb7aaa0b7b9f52c1dfeaa82749ed36a7be44d3f3db39b32694b887 did:key:z6MkfDCZiMKpVmyzb7BT6PGAmhsbx4saBBYzdP84yfE3gDmG

async function authenticate(pk) {
  const seed = fromString(pk, 'base16')
  const did = new DID({
    provider: new Ed25519Provider(seed),
    resolver: { ...KeyDidResolver.default.getResolver() }
  })
  await did.authenticate();
  return did;
}

async function main (data) {

  const did  = await authenticate('4064a4f557bb7aaa0b7b9f52c1dfeaa82749ed36a7be44d3f3db39b32694b887');
  const did1 = await authenticate('650e4ec042b2c676cce1c4ea7ba0defdfefe39d3b12715dabbcc6b623d9ef8d8');
  const did2 = await authenticate('a979fd55f4382ca7a4edf0e7539fda5341a6a0c0af0f608cdbfacdcb5028fa55');
  const did3 = await authenticate('5767c6d427fc3566bd482b321505af14c708f48b77d5e82d22fb08a2ccbd4baa');
  const did4 = await authenticate('a039d7d252710efe7bd7503dbd8dddaee7395ffa4c7b469f756d7f8aa551b9b0');

  console.info('DID:',did.id);
  console.info('DID1:',did1.id);
  console.info('DID2:',did2.id);
  console.info('DID3:',did3.id);
  console.info('DID4:',did4.id);

  // setup ipfs with dag-jose for signing and encryption
  console.info(dagJose.default)
  const dagJoseFormat = convert(dagJose.default)
  // or (same result...)
  // const hasher = {
  //   [sha256.code]: sha256
  // }
  // const dagJoseFormat = legacy(dagJose.default, {hashes: hasher})
  console.info(dagJoseFormat);
  const ipfs = await IPFS.create({ ipld: { formats: [dagJoseFormat] } })

  // document payload
  const payload = {
    title: 'secret pdf',
    content: 'test', // data,
  };


  // JWS : SIGN
  const DagJWS =  await did.createDagJWS(payload);
  console.info('DagJWS',DagJWS);
  const { jws, linkedBlock } = DagJWS; //await did.createDagJWS(payload)
  console.info('JWS ', jws)

  // const { jwsb, linkedBlockb } = await did.createDagJWS(jws)
  // console.info('JWSb ', jwsb)

  const jwsCid = await ipfs.dag.put(jws, { format: 'dag-jose', hashAlg: 'sha2-256' })
  console.log('jwsCid', jwsCid);
  const block = await ipfs.block.put(linkedBlock, { cid: jws.link })

  // get the value of the payload using the payload cid
  console.info('jws.link',jws.link);
  // const jwslink = await ipfs.dag.get(jws.link)
  // console.log('JWS link', jwslink.value)

  // alternatively get it using the ipld path from the JWS cid
  const jwspath = await ipfs.dag.get(jwsCid, { path: '/link' })
  console.log('got payload by path ', jwspath.value)

  // get the jws from the dag
  const getjws = await ipfs.dag.get(jwsCid);
  console.info('got JWS ', getjws.value)

  // verify signature
  const verify = await did.verifyJWS(getjws.value)
  console.info('verify JWS did',verify.didResolutionResult.didDocument);

  const verify1 = await did1.verifyJWS(getjws.value)
  console.info('verify JWS did1 ',verify1.didResolutionResult.didDocument);


  // JWE : ENCRYPTION
  const jwe = await did.createDagJWE(
    payload
  ,[
    did1.id, // 'did:key:z6MkmuPSwwq8MZTcLMk5uLN9oTMyEfJyN9aF7eCJo3ZZy7U2',
    did2.id, // 'did:key:z6MkpXt3dqTbUu7KK9z1QVeuKazxwr52ZdT9LRViENmfpxrH',
    did3.id, // 'did:key:z6MkgHyS8dpuk4ZdjveNBf92zGhY4U7BsoKmBMTTxp2rQUvQ',
  ]);
  console.info('JWE:',jwe);
  const cidE = await ipfs.dag.put(jwe, { format: 'dag-jose', hashAlg: 'sha2-256' })
  console.log(cidE)

  const getJWE = await ipfs.dag.get(cidE)
  console.info('get JWE',getJWE)

  // OK : did1 did2 did3
  const cleartext1 = await did1.decryptDagJWE(jwe)
  console.info('decrypt 1',cleartext1)

  const cleartext2 = await did2.decryptDagJWE(jwe)
  console.info('decrypt 2',cleartext2)

  const cleartext3 = await did3.decryptDagJWE(jwe)
  console.info('decrypt 3',cleartext3)

  fs.writeFileSync('./paper-out.pdf',cleartext3.content)

  // NOT OK : did4
  const cleartext4 = await did4.decryptDagJWE(jwe).catch((err) => console.log(err))
  console.info('decrypt 4',cleartext4)

}

// read file
fs.readFile('./paper-in.pdf', (err, data) => {
  if (err) throw err;
  main(data)
})

