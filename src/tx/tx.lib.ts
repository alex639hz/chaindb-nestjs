/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as crypto from 'crypto';

import bs58check from 'bs58check';
import { ec as EC } from 'elliptic';
import { TypeTxRaw } from './tx.types';

const hashAlgorithm = 'sha256';

// const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32); // Save securely (e.g., from env)
// const iv = crypto.randomBytes(16); // Should also be stored or passed with cipher text

export const isVerifyTxRawSignature = ({
  publicKey,
  signature,
  txRawJson,
}: TypeTxRaw): boolean => {
  const verifier = crypto.createVerify(hashAlgorithm);
  verifier.update(txRawJson);
  const isVerified = verifier.verify(publicKey, signature, 'hex');
  return isVerified;
};

// export const isVerifyTxRawDate = (date: TypeTxRaw): boolean => {
//   const verifier = crypto.createVerify(hashAlgorithm);
//   verifier.update(txRawJson);
//   const isVerified = verifier.verify(publicKey, signature, 'hex');
//   return isVerified;
// };

export function fetchTxHistory(senderAddress): Promise<any> {
  return this.txModel.find(
    {
      $or: [{ 'tx.receiver': senderAddress }, { 'tx.sender': senderAddress }],
    },
    {
      tx: 1,
    },
    {
      sort: {
        'tx.date': 1,
      },
    },
  );
}

export const stringifyTx = (tx) => JSON.stringify(tx);

export const hash = (msg: string) => {
  const sha256 = crypto.createHash('sha256').update(msg, 'ascii').digest('hex');

  return sha256;
};

export const signTx = ({ tx, privateKey }) => {
  const txJson = stringifyTx(tx);
  const signer = crypto.createSign(hashAlgorithm);
  signer.update(txJson);
  const signature = signer.sign(privateKey, 'hex');
  return { signature, tx, txJson };
};

export const generateWallet = () => {
  const ec = new EC('secp256k1');
  // Step 1: Generate private key (32 bytes)
  const privateKey = crypto.randomBytes(32);
  const keyPair = ec.keyFromPrivate(privateKey);

  // Step 2: Derive public key (uncompressed = 65 bytes, starts with 0x04)
  const publicKey = keyPair.getPublic().encode('hex', false); // false = uncompressed

  // Step 3: SHA-256 of public key
  const sha256 = crypto
    .createHash('sha256')
    .update(Buffer.from(publicKey, 'hex'))
    .digest();

  // Step 4: RIPEMD-160 of SHA-256
  const ripemd160 = crypto.createHash('ripemd160').update(sha256).digest();

  // Step 5: Add version byte (0x00 for mainnet)
  const versionedPayload = Buffer.concat([Buffer.from([0x00]), ripemd160]);

  // Step 6: Base58Check encode to get address
  const address = bs58check.encode(versionedPayload);

  // Step 7: Convert private key to Wallet Import Format (WIF)
  const wifPayload = Buffer.concat([Buffer.from([0x80]), privateKey]);
  const wif = bs58check.encode(wifPayload);

  return {
    privateKeyHex: privateKey.toString('hex'),
    privateKeyWIF: wif,
    publicKeyHex: publicKey,
    address,
    keyPair,
  };
};

export const generateKeys = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1', // Common curve for cryptocurrencies
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { privateKey, publicKey };
};

export const getTimeStamp = () => new Date().toISOString();

export const strToBaseEncoding = () => new Date().toISOString();
export const baseToStrDecoding = () => new Date().toISOString();


export const txlib = {
  isVerifyTxRawSignature,
  signTx,
  generateKeys,
  stringifyTx,
  getTimeStamp,
  hash,
};
