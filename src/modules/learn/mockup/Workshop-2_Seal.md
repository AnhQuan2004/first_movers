---
heroImage: https://img.bgstatic.com/multiLang/image/social/3159479ca29491bb231f6d3994f033f11744022405288.jpeg
---
# #2 Walrus101: Seal - Decentralized Secret Management for Walrus

## Introduction

In the previous Walrus workshop, we learned how to store and retrieve files using decentralized blob storage. Now we take the next step: securing that data with advanced encryption and granular access control. **Seal** is a decentralized secret management protocol that transforms how you handle encryption keys and access policies in Web3 applications.

If you've ever needed to share encrypted data but worried about managing decryption keys securely, Seal solves this problem elegantly. By combining on-chain access control policies with off-chain key servers, Seal enables you to define exactly who gets access to your encrypted content—without ever directly sharing secret keys.

---

## Key Points at a Glance

- **What is Seal?** A decentralized secret management protocol using threshold encryption for access control
- **Core innovation:** Splits secrets into fragments; key servers only release fragments when on-chain criteria are met
- **Two components:** On-chain access policies (Move smart contracts) + Off-chain key servers
- **Client-side operations:** Encryption and decryption happen entirely on the client side
- **Threshold mechanism:** Configure how many key servers must approve access before decryption is possible
- **Layered encryption:** For large files, encrypt with a passphrase first, then use Seal to encrypt the passphrase
- **Use cases:** Content subscriptions, secure messaging, token-gated access, time-locked voting, gaming state management
- **Zero secret sharing:** Content creators manage policies, not keys

---

## Understanding Seal and Why It Matters

### The Problem It Solves

Before Seal, securing data involved a fundamental challenge: **the key distribution problem**. Here's what typically happened:

1. You encrypt your data and store it on Walrus
2. You need to share it with others
3. You must somehow distribute the decryption key
4. This introduces security risks—anyone with the key can decrypt everything

This approach forced content creators to either:

- Manage complicated key distribution systems
- Trust centralized intermediaries to safeguard keys
- Risk exposing keys to unauthorized parties

### How Seal Changes Everything

Seal eliminates the need to directly share keys. Instead, it lets you define **access control policies on-chain** that automatically govern who can access your encrypted data.

Here's the revolutionary part: **Seal key servers never share the complete decryption key.** They split it into cryptographic fragments and only release fragments when the access policy criteria are satisfied.

This means:

- Content creators manage policies, not secrets
- Access can be revoked by updating the policy
- Multiple conditions can be enforced (payments, subscriptions, time locks, etc.)
- Users prove they meet the criteria, then receive decryption capability

### The Architecture

Seal consists of two main components:

**1. On-Chain Access Control Policy (Move Smart Contracts)**

- Defines who can access encrypted data
- Implemented as an `entry function` called `seal_approve` in your Move contract
- Can enforce subscription payments, token gating, time locks, or custom logic
- Lives on the Sui blockchain

**2. Off-Chain Key Servers**

- Hold fragments of the decryption key
- Verify access criteria by dry-running the policy transaction
- Only issue key fragments when verification succeeds
- Never expose the complete key
- Work collaboratively using threshold cryptography

---

## How Seal Works Under the Hood

![How does Seal work](https://cdn.prod.website-files.com/687615731a76518b8c27cf39/68762e87046affebfb9d62fe_Frame%202147265714.svg)

### The Encryption Process

When you encrypt data with Seal, several steps happen automatically:

- **Step 1: Base Key Generation**
  The client generates a base cryptographic key that will be used for all subsequent operations.

- **Step 2: Key Fragment Creation**
  Seal splits this base key into multiple fragments. Each key server receives a piece of the key.

- **Step 3: Public Key Encryption**

  - Each key server has a public key
  - The client encrypts its share of the secret key using each key server's public key
  - This ensures only that specific key server can decrypt its fragment

- **Step 4: Derivation Key Creation**
  From the base key, the client derives another key, which is then split and encrypted with key servers' public keys.

- **Step 5: Data Encryption**
  A symmetric key is derived from the base key and used to encrypt the actual data (file content, messages, etc.).

- **Step 6: Storage**
  - The encrypted data is stored on Walrus or any storage medium
  - The encrypted key shares are stored however you choose
  - Your access policy is registered on-chain

### The Decryption Process

When someone needs to access your encrypted data:

- **Step 1: Fetch Encrypted Blob**
  The user retrieves the encrypted blob from Walrus or your storage location.

- **Step 2: Sign Request (Client-Side Only)**

  - The user signs a request proving they own the wallet address requesting access. This happens entirely on the client—**no on-chain transaction required**.

  - The signature is valid for about 10 minutes, so if you're accessing multiple files, you only sign once.

- **Step 3: Construct Proof Transaction**
  The client constructs a Programmable Transaction Block (PTB) that calls your access policy's `seal_approve` function.

- **Step 4: Key Server Verification**
  The key server receives:

  - The signature proving wallet ownership
  - The PTB describing the access policy
  - The subscription/access object the user holds

  The key server **dry-runs** the PTB against the current on-chain state to verify the user meets the criteria.

- **Step 5: Conditional Key Fragment Release**
  If verification succeeds, the key server sends back:

  - The decryption key fragment
  - Only if the criteria are met

- **Step 6: Threshold Assembly**
  Once enough key fragments are collected (based on your configured threshold), the client can reconstruct the original symmetric key.

- **Step 7: Decryption**
  With the symmetric key, the client decrypts the blob content entirely on the client side.

### The Threshold Mechanism

You specify during encryption how many key servers must approve your request. For example:

- **Threshold = 1:** Only 1 key server needs to approve (faster, less secure)
- **Threshold = 3:** You need 3 out of 5 key servers to approve (balanced)
- **Threshold = 5:** All 5 key servers must approve (most secure, slowest)

This is similar to multi-signature schemes in blockchain, but applied to decryption. The more key servers you require, the more trustless your system becomes.

---

## Building with Seal

You can get demo project from [here](https://github.com/MystenLabs/seal/tree/main/examples) from Mysten Labs repository.

There are many Seal access policy patterns :`Private Data`, `Allowlist`, `Subscription`, `Time-lock encryption`, `Variation - Pre-signed URLs`, `Secure voting`,... more details can be found on [Seal Docs](https://seal-docs.wal.app/ExamplePatterns/)

Now `run the demo project` and upload a random image from your computer that must less than 10MB on `Admin View` for the further exploration.

Then, `Encrypt and upload to Walrus` and it will return **Encrypted blob** and **Sui Object**.

After that `Associate file to Sui object` which means attaching this Sui object (the presentation of this encrypted file on Walrus) with our policies so that if you are part of this access policy and fullfil the criteria then you'll be able to access this file. Approve the transaction call `publish` function underline which mean adding `blob ID` to the actual policy as a dynamic field.

```rust
/// Encapsulate a blob into a Sui object and attach it to the Subscription
public fun publish(service: &mut Service, cap: &Cap, blob_id: String) {
    assert!(cap.service_id == object::id(service), EInvalidCap);
    df::add(&mut service.id, blob_id, MARKER);
}
```

**Essential Component: The `entry func seal_approve`**
This function is what Seal key servers look for. Your function can enforce any logic by checking `approve_internal` in `subscription.move`.

```rust
/// All allowlisted addresses can access all IDs with the prefix of the allowlist
/// Only if you have subscription object then you will be able to release the fragment
/// of the key pair for encrypting data
fun approve_internal(id: vector<u8>, sub: &Subscription, service: &Service, c: &Clock): bool {
    if (object::id(service) != sub.service_id) {
        return false
    };
    if (c.timestamp_ms() > sub.created_at + service.ttl) {
        return false
    };

    // Check if the id has the right prefix
    is_prefix(service.id.to_bytes(), id)
}

entry fun seal_approve(id: vector<u8>, sub: &Subscription, service: &Service, c: &Clock) {
    assert!(approve_internal(id, sub, service, c), ENoAccess);
}
```

### Using the Seal SDK

On the frontend, the TypeScript SDK handles encryption and decryption:

**Initialization:**

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { fromHex, toHex } from "@mysten/sui/utils";
import { Seal } from "@mysten/seal";

const NUM_EPOCH = 1;
const packageId = useNetworkVariable("packageId");
const suiClient = useSuiClient();
const serverObjectIds = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8",
];
const client = new SealClient({
  suiClient,
  serverConfigs: serverObjectIds.map((id) => ({
    objectId: id,
    weight: 1,
  })),
  verifyKeyServers: false,
});
```

**Encryption:**
From the frontend interaction

```Typescript
// This button call the handleSubmit function in frontend/src/EncryptAndUpload.tsx

const handleSubmit = () => {
    setIsUploading(true);
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        if (event.target && event.target.result) {
          const result = event.target.result;
          if (result instanceof ArrayBuffer) {
            const nonce = crypto.getRandomValues(new Uint8Array(5));
            const policyObjectBytes = fromHex(policyObject);
            // Create unique ID by combining policy object bytes and nonce
            const id = toHex(new Uint8Array([...policyObjectBytes, ...nonce]));

            // Where Seal SDK do their job
            const { encryptedObject: encryptedBytes } = await client.encrypt({
              threshold: 2,
              packageId,  // The package of deployed Move smart contract that have your custom approve function
              id,         // The identity of file that you want to encrypted
              data: new Uint8Array(result),
            });

            // Then, you store encrypted file as a blob on Walrus
            const storageInfo = await storeBlob(encryptedBytes);

            displayUpload(storageInfo.info, file.type);
            setIsUploading(false);
          } else {
            console.error('Unexpected result type:', typeof result);
            setIsUploading(false);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error('No file selected');
    }
};
```

Clicking the share `this link` with other users on the demo page, with the demo of `Subscription` pattern, you have to pay an amount of Sui to see the content by clicking `Subcribe for 1000 MIST for 30 minutes` and approve the transaction on your wallet that calling this smart contract below.

```rust
public fun subscribe(
    fee: Coin<SUI>,
    service: &Service,
    c: &Clock,
    ctx: &mut TxContext,
): Subscription {
    // Checking the fee payment and transfer to the content creator (service.owner)
    assert!(fee.value() == service.fee, EInvalidFee);
    transfer::public_transfer(fee, service.owner);
    // Issue the Subscription object as Subcriber which grant you access to this access policy
    Subscription {
        id: object::new(ctx),
        service_id: object::id(service),
        created_at: c.timestamp_ms(),
    }
}

public fun transfer(sub: Subscription, to: address) {
    transfer::transfer(sub, to);
}
```

**Decryption (Client-Side Only):**
Now you got `Subcription` object and allow to `Download and Decrypt All Files`

```typescript
// This button call the onView function in frontend/sr/SubscriptionView.tsx
const onView = async (
  blobIds: string[],
  serviceId: string,
  fee: number,
  subscriptionId?: string
) => {
  if (!subscriptionId) {
    return handleSubscribe(serviceId, fee);
  }

  if (
    currentSessionKey &&
    !currentSessionKey.isExpired() &&
    currentSessionKey.getAddress() === suiAddress
  ) {
    const moveCallConstructor = constructMoveCall(
      packageId,
      serviceId,
      subscriptionId
    );

    // fully code below
    downloadAndDecrypt(
      blobIds,
      currentSessionKey,
      suiClient,
      client,
      moveCallConstructor,
      setError,
      setDecryptedFileUrls,
      setIsDialogOpen,
      setReloadKey
    );

    return;
  }
  setCurrentSessionKey(null);

  const sessionKey = await SessionKey.create({
    address: suiAddress,
    packageId,
    ttlMin: TTL_MIN,
    suiClient,
  });

  try {
    signPersonalMessage(
      {
        message: sessionKey.getPersonalMessage(),
      },
      {
        onSuccess: async (result) => {
          await sessionKey.setPersonalMessageSignature(result.signature);
          const moveCallConstructor = await constructMoveCall(
            packageId,
            serviceId,
            subscriptionId
          );
          await downloadAndDecrypt(
            blobIds,
            sessionKey,
            suiClient,
            client,
            moveCallConstructor,
            setError,
            setDecryptedFileUrls,
            setIsDialogOpen,
            setReloadKey
          );
          setCurrentSessionKey(sessionKey);
        },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
  }
};
```

```Typescript
// downloadAndDecrypt can be found on frontend/src/utils.ts
export const downloadAndDecrypt = async (
  blobIds: string[],
  sessionKey: SessionKey,
  suiClient: SuiClient,
  sealClient: SealClient,
  moveCallConstructor: (tx: Transaction, id: string) => void,
  setError: (error: string | null) => void,
  setDecryptedFileUrls: (urls: string[]) => void,
  setIsDialogOpen: (open: boolean) => void,
  setReloadKey: (updater: (prev: number) => number) => void,
) => {
  const aggregators = [
    'aggregator1',
    'aggregator2',
    'aggregator3',
    'aggregator4',
    'aggregator5',
    'aggregator6',
  ];
  // First, download all encrypted version files in parallel (ignore errors)
  const downloadResults = await Promise.all(
    blobIds.map(async (blobId) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const randomAggregator = aggregators[Math.floor(Math.random() * aggregators.length)];
        const aggregatorUrl = `/${randomAggregator}/v1/blobs/${blobId}`;
        const response = await fetch(aggregatorUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) {
          return null;
        }
        return await response.arrayBuffer();
      } catch (err) {
        console.error(`Blob ${blobId} cannot be retrieved from Walrus`, err);
        return null;
      }
    }),
  );

  // Filter out failed downloads
  const validDownloads = downloadResults.filter((result): result is ArrayBuffer => result !== null);
  console.log('validDownloads count', validDownloads.length);

  if (validDownloads.length === 0) {
    const errorMsg =
      'Cannot retrieve files from this Walrus aggregator, try again (a randomly selected aggregator will be used). Files uploaded more than 1 epoch ago have been deleted from Walrus.';
    console.error(errorMsg);
    setError(errorMsg);
    return;
  }

  // Fetch keys in batches of <=10
  for (let i = 0; i < validDownloads.length; i += 10) {
    const batch = validDownloads.slice(i, i + 10);
    const ids = batch.map((enc) => EncryptedObject.parse(new Uint8Array(enc)).id);
    const tx = new Transaction();
    ids.forEach((id) => moveCallConstructor(tx, id));
    const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });
    try {
      // By constructing this PTB that return cached decrypted fragement of the original keys as a proof that you own the address that is described onchain
      await sealClient.fetchKeys({ ids, txBytes, sessionKey, threshold: 2 });
    } catch (err) {
      console.log(err);
      const errorMsg =
        err instanceof NoAccessError
          ? 'No access to decryption keys'
          : 'Unable to decrypt files, try again';
      console.error(errorMsg, err);
      setError(errorMsg);
      return;
    }
  }

  // Then, decrypt files sequentially
  const decryptedFileUrls: string[] = [];
  for (const encryptedData of validDownloads) {
    const fullId = EncryptedObject.parse(new Uint8Array(encryptedData)).id;
    const tx = new Transaction();
    moveCallConstructor(tx, fullId);
    const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });
    try {
      // Note that all keys are fetched above, so this only local decryption is done
      const decryptedFile = await sealClient.decrypt({
        data: new Uint8Array(encryptedData),
        sessionKey,
        txBytes,
      });

      // That's why I guide you to upload images
      const blob = new Blob([decryptedFile], { type: 'image/jpg' });
      decryptedFileUrls.push(URL.createObjectURL(blob));
    } catch (err) {
      console.log(err);
      const errorMsg =
        err instanceof NoAccessError
          ? 'No access to decryption keys'
          : 'Unable to decrypt files, try again';
      console.error(errorMsg, err);
      setError(errorMsg);
      return;
    }
  }

  ...
};

```

## Handling Large Files with Layered Encryption

A critical limitation of Seal: directly encrypting files larger than 16MB can be slow. The solution is **layered encryption**.

### The Problem with Direct Large File Encryption

If you try to encrypt a 700MB video file directly with Seal, the encryption/decryption process becomes computationally expensive because Seal needs to handle the entire file with its threshold cryptography operations.

### The Solution: Encrypt-Then-Seal Pattern

Instead of encrypting the entire file with Seal, use this approach:

**Step 1: Generate Random Passphrase**

```bash
openssl rand -base64 32 > passphrase.txt
```

**Step 2: Encrypt File with Passphrase (AES-256)**

```bash
gpg --symmetric --cipher-algo AES256 \
    --passphrase-file passphrase.txt \
    large_video.mp4
# Output: large_video.mp4.gpg
```

This produces `large_video.mp4.gpg` and a tiny `passphrase.txt` (typically 45 bytes).

**Step 3: Encrypt Only the Passphrase with Seal**

```typescript
// Only encrypt the 45-byte passphrase, not the 700MB video
const { encryptedObject: encryptedPassphrase } = await client.encrypt({
  threshold: 2,
  packageId: packageId,
  id: "video-passphrase",
  data: passphraseContent,
});
```

**Step 4: Upload Both to Walrus**

```typescript
// Store the encrypted video file
const videoBlobId = await uploadToWalrus(encryptedVideo);

// Store the encrypted passphrase with Seal separately
const passphraseBlobId = await uploadToWalrus(encryptedPassphrase);
```

**Decryption Workflow:**

1. Fetch encrypted passphrase from Walrus
2. Use Seal to decrypt passphrase (gets key fragments, assembles key, decrypts)
3. Fetch encrypted video file from Walrus
4. Use decrypted passphrase to decrypt video locally with GPG
5. User has original video file

**Why This Works:**

- Seal operations are fast (45 bytes vs. 700MB)
- Video file encryption/decryption is simple local AES-256
- Access control is enforced at the passphrase level
- If you lose access rights, you can't decrypt the passphrase, so the video remains protected

---

## Real-World Use Cases

![Seal Use Cases](https://violet-defensive-monkey-718.mypinata.cloud/ipfs/bafkreibpa44esrhglxi2fxgtzzoqrjdrmqheuiw7pnl7jiy5m2xhlrbp5y)

### Content Creation & Monetization

**Use Case:** A filmmaker wants to sell exclusive content to subscribers.

**Implementation:**

- Encrypt video with Seal using layered encryption
- Create subscription NFTs as access tokens
- Only users with valid subscription NFTs can decrypt
- When subscription expires, `seal_approve` function returns false
- User can no longer access content

### Secure Messaging

The example app demonstrates a messaging SDK using Seal:

**Components:**

- **Sui Smart Contracts:** Manage channels, membership, message metadata
- **Walrus:** Store encrypted messages and attachments
- **Seal:** Encrypt messages and enforce access policies

**Features:**

- End-to-end encrypted messaging using only wallet addresses
- Group chats with programmable access policies
- Message history encrypted and stored on Walrus
- Only channel members can decrypt messages

### Token-Gated Content

**Use Case:** Access content only if you hold a specific NFT.

```move
public entry fun seal_approve(
    nft_collection: &NFTCollection,
    holder: address,
) {
    // Verify user holds the required NFT
    assert!(nft_collection.owner_of(holder), ENoNFT);
}
```

### Time-Locked Secrets

**Use Case:** Reveal content after a specific date (e.g., will reading, scheduled announcements).

```move
public entry fun seal_approve(
    _: &Object,
    _: address,
    clock: &Clock,
) {
    assert!(clock::timestamp_ms(clock) > REVEAL_TIME, ENotYetRevealed);
}
```

### Games with Hidden State

**Use Case:** Games where certain state must remain hidden until revealed.

```move
public entry fun seal_approve(
    game_proof: &GameProgress,
    player: address,
) {
    // Only the player who earned the achievement can decrypt
    assert!(game_proof.player == player, ENotAuthorized);
    assert!(game_proof.achievement_unlocked, ENoAccess);
}
```

---

## Key Takeaways

### The Seal Philosophy

**Traditional Encryption:** You share the key.
**Seal Encryption:** You define the rules; the network enforces them.

### Why It Matters for Web3

- **Programmable Access:** Policies are smart contracts, not static rules
- **No Key Management:** Don't track and rotate secrets—manage policies instead
- **Verifiable Access:** Anyone can verify that access was granted correctly
- **Scalable Security:** Threshold cryptography means no single point of failure
- **Decentralized:** Key servers are distributed; no one party controls decryption

### Common Mistakes to Avoid

- **Forgetting the `entry func seal_approve` function:** Key servers can't verify access without it
- **Hardcoding secrets:** Don't put real keys in your Move code
- **Ignoring thresholds:** Don't set threshold too low (security risk) or too high (availability risk)
- **Direct large file encryption:** Always use layered encryption for files > 16MB
- **Not testing on testnet:** Thoroughly test your policies before mainnet

---

## Section 8: What's Next

### The Complete Walrus Ecosystem

The Walrus workshops follow this progression:

1. **Workshop 1 (Completed):** File storage and retrieval with Walrus
2. **Workshop 2 (You are here):** Encryption and access control with Seal
3. **Workshop 3 (Upcoming):** Nautilus—verifying off-chain computation on Sui

### Nautilus Preview

The next workshop covers **Nautilus**, which enables:

- Verifying off-chain computation on the Sui blockchain
- Using Trusted Execution Environments (TEEs) for secure off-chain processing
- Generating cryptographic receipts proving correct execution
- Combining on-chain and off-chain logic

### Preparing for the Hackathon

The All Out Hackathon using Walrus is designed to showcase:

- Complex data storage solutions
- Privacy-preserving applications
- Access-controlled dApps
- Novel use cases for decentralized infrastructure

**Prize pools** support projects across all levels of sophistication.

---

## Next Steps and Resources

### Essential Resources

- **Official DocsDocumentation:** `docs.walrus.app` (look for Seal section)
- **Walrus Documentation:** `walrus.xyz`
- **GitHub Repository:** `github.com/MystenLabs/seal`
- **Discord Communities:**
  - [Sui Discord](https://discord.gg/sui)
  - [Walrus Discord](https://discord.gg/walrusprotocol)
  - [First Movers Discord](https://discord.gg/xRCWupVA)
  - 24/7 support for questions
- **Forum:** Official forum for community discussions

### Example Applications

- **Messaging SDK:** Reference implementation showing encrypted messaging programmable access control policies, more details [here](https://github.com/MystenLabs/sui-stack-messaging-sdk)
- **Subscription Service:** Demonstrates token-gated content access
- **Allowlist System:** Simple access control example

### Tips for Success

1. **Start on testnet:** Get comfortable with the basics before deploying mainnet
2. **Free testnet storage:** Take advantage of free Publisher/Aggregator services
3. **Ask questions:** The community is active and helpful on Discord
4. **Explore examples:** The Walrus repository contains example proqjects to learn from
5. **Participate in hackathons:** Hands-on experience is the best way to master the platform
