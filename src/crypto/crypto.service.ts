/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import bs58check from 'bs58check';
import { ec as EC } from 'elliptic';
import { Tx } from 'src/tx/interfaces/tx.interface';

const hashAlgorithm = 'sha256';

const ec = new EC('secp256k1');

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.randomBytes(32); // Save securely (e.g., from env)
  private readonly iv = crypto.randomBytes(16); // Should also be stored or passed with cipher text

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${this.iv.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, content] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  generateWallet() {
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
  }
  generateKeyPair() {
    const wallet = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return wallet;
  }
  hashTransaction(tx: Tx): string {
    const txJson = JSON.stringify(tx);
    const hash = crypto.createHash('sha256');
    hash.update(txJson);
    return hash.digest('hex');
  }
  sign({ tx: txJson, privateKey }: { tx: Tx; privateKey: string }) {
    // 2. Define the message to be signed
    const tx = JSON.stringify(txJson);

    // 3. Create a Sign object and update it with the message
    const signer = crypto.createSign(hashAlgorithm);
    signer.update(tx);

    // 4. Sign the message with the private key
    // The signature is returned as a Buffer, convert to hex for display
    const signature = signer.sign(privateKey, 'hex');
    return { signature, tx };
  }

  verify({ publicKey, signature, message }): boolean {

    const verifier = crypto.createVerify(hashAlgorithm);
    verifier.update(message);

    const isVerified = verifier.verify(publicKey, signature, 'hex');

    return isVerified;
  }
}

// Run and print
// const wallet = generateBitcoinKeypair();
// console.log('🔐 Bitcoin Wallet:');
// console.log('Private Key (hex):', wallet.privateKeyHex);
// console.log('Private Key (WIF):', wallet.privateKeyWIF);
// console.log('Public Key:', wallet.publicKeyHex);
// console.log('Bitcoin Address:', wallet.address);


// import { ec as EC } from 'elliptic';
// import crypto from 'crypto';

// const ec = new EC('secp256k1');

// Generate keypair (in real use, persist the private key securely)
// const keyPair = ec.genKeyPair(); // or ec.keyFromPrivate(<hex>)

// Helper: Hash transaction (canonical stringified)






// Export public key for external verification
// export function getPublicKeyHex() {
//   return keyPair.getPublic('hex');
// }
