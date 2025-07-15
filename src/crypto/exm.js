const crypto = require("crypto");

async function generateAndSignECDSA() {
  // 1. Generate an EC key pair
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1', // Common curve for cryptocurrencies
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    },
  });

  console.log("Generated Private Key:\n", privateKey);
  console.log("Generated Public Key:\n", publicKey);

  // 2. Define the message to be signed
  const message = "This is a secret message to be digitally signed.";
  const hashAlgorithm = "sha256";

  // 3. Create a Sign object and update it with the message
  const signer = crypto.createSign(hashAlgorithm);
  signer.update(message);

  // 4. Sign the message with the private key
  // The signature is returned as a Buffer, convert to hex for display
  const signature = signer.sign(privateKey, 'hex');

  console.log("\nOriginal Message:", message);
  console.log("Hash Algorithm:", hashAlgorithm);
  console.log("ECDSA Signature (hex):", signature);

  // 5. Verify the signature with the public key
  const verifier = crypto.createVerify(hashAlgorithm);
  verifier.update(message);

  const isVerified = verifier.verify(publicKey, signature, 'hex');

  console.log("Signature Verified:", isVerified);
}

generateAndSignECDSA().catch(console.error);