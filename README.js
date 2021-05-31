with node v14.15.1


npm install
node index.js

returns :
```
➜  dag-jose-bug git:(master) ✗ node index.js
DID: did:key:z6MkfDCZiMKpVmyzb7BT6PGAmhsbx4saBBYzdP84yfE3gDmG
{
  default: {
    name: 'dag-jose',
    code: 133,
    encode: [Function: encode],
    decode: [Function: decode]
  }
}
{
  defaultHashAlg: 'sha2-256',
  codec: undefined,
  util: {
    serialize: [Function: serialize],
    deserialize: [Function: deserialize],
    cid: [AsyncFunction: cid]
  },
  resolver: { resolve: [Function: resolve], tree: [Function: tree] }
}
Swarm listening on /ip4/127.0.0.1/tcp/4002/p2p/QmSQkWAotaQsfmdkXCPhck4zMSBp7AGPUrvvc3uBmu3UaY
Swarm listening on /ip4/192.168.1.27/tcp/4002/p2p/QmSQkWAotaQsfmdkXCPhck4zMSBp7AGPUrvvc3uBmu3UaY
Swarm listening on /ip4/127.0.0.1/tcp/4003/ws/p2p/QmSQkWAotaQsfmdkXCPhck4zMSBp7AGPUrvvc3uBmu3UaY
Loading IPLD format 112
JWE: {
  protected: 'eyJlbmMiOiJYQzIwUCJ9',
  iv: 'jm9GSgtbDF3krotdvIbtu7EIJbjGvskh',
  ciphertext: 'loXS2J22H_xvpt2f4k58W6JONAn-uzMHqL6JhND-JLGj899hQV03guXQjJuvqbFp',
  tag: '-hYtGcXhULsH5KLWo8kjeg',
  recipients: [
    {
      encrypted_key: 'Z-IRyjK0QL0_hHxIN9oynXTCCbMUg2kXG6NtNEr0dkU',
      header: [Object]
    },
    {
      encrypted_key: 'JiY4SdhuQ9IIAKYAGbR8_DUyFdTViPkgQf2hranTgZo',
      header: [Object]
    },
    {
      encrypted_key: 'c8jZE6Mjm6r42C96qPFsR6lw15fcgqystxCnrk1RTTI',
      header: [Object]
    }
  ]
}
Loading IPLD format 133
Promise { <pending> }
Error: Missing IPLD format "dag-jose"
    at IPLDResolver.loadFormat (/Users/oliviernerot/Devs/boardigo/dag-jose-bug/node_modules/ipfs-core/src/runtime/ipld.js:30:17)
    at IPLDResolver.getFormat (/Users/oliviernerot/Devs/boardigo/dag-jose-bug/node_modules/ipld/src/index.js:398:31)
    at IPLDResolver.put (/Users/oliviernerot/Devs/boardigo/dag-jose-bug/node_modules/ipld/src/index.js:186:35)
    at put (/Users/oliviernerot/Devs/boardigo/dag-jose-bug/node_modules/ipfs-core/src/components/dag/put.js:41:30)
    at DagAPI.put (/Users/oliviernerot/Devs/boardigo/dag-jose-bug/node_modules/ipfs-core-utils/src/with-timeout-option.js:20:46)
    at main (file:///Users/oliviernerot/Devs/boardigo/dag-jose-bug/index.js:52:25)
```
