---
heroImage: https://cdn.prod.website-files.com/6864f039b26f4afedada6bc5/6864f039b26f4afedada6c30_about-ilust.svg
---
# #1 Walrus101: A Comprehensive Guide to Decentralized Blob Storage

![](https://cdn.prod.website-files.com/6864f039b26f4afedada6bc5/6864f039b26f4afedada6c30_about-ilust.svg)
## Introduction

Walrus is the next generation of decentralized blob storage built on top of Sui. If you've ever used AWS S3 buckets, think of Walrus as a decentralized equivalent—but with powerful programmability, censorship resistance, and novel efficiency through erasure coding. This guide walks you through everything you need to know to get started with Walrus, from basic concepts to advanced deployment.

---

## Key Points at a Glance

- **What is Walrus?** Decentralized blob storage system built on Sui blockchain
- **Why the name?** Walrus is a marine mammal that looks like a blob—and Walrus itself is blob storage
- **Core innovation:** Uses erasure coding to dramatically reduce replication factors compared to traditional decentralized storage
- **Three ways to interact:** Publisher/Aggregator (HTTP), Walrus CLI, and TypeScript SDK
- **Testnet advantage:** Publisher and Aggregator services are completely free on testnet
- **Beyond storage:** Host decentralized websites (Walrus Sites) with CNS name registration

---

## Understanding Walrus and Why It Matters

### What is Walrus?

Walrus is a decentralized blob storage system designed for the Web3 era. Unlike traditional centralized storage services (like AWS S3, Google Cloud Storage, or Microsoft Azure), Walrus removes the middleman and puts data storage directly on the blockchain with cryptographic guarantees.

### Why Choose Decentralized Storage?

**Censorship Resistance and Privacy:** The most compelling use case for decentralized storage is protecting sensitive or controversial content that might be removed by centralized platforms. You can store encrypted personal data without relying on any central authority.

**Content Creator Independence:** Today's platforms like Instagram and TikTok monetize user content without sharing revenue or giving creators control. Walrus enables creators to store and serve their own content independently.

**NFT and Digital Asset Storage:** You can store static content assets and NFTs with true immutability. Your digital collectibles remain accessible even if centralized platforms disappear.

**Web3 Infrastructure:** Host decentralized websites, funny cat videos, or anything else with the guarantee that your content is truly yours and truly censorship-resistant.

### What Makes Walrus Different?

**Erasure Coding Innovation:** Walrus employs a novel erasure coding scheme that dramatically reduces the replication factor needed for data redundancy—making storage more efficient than competitors.

**Web2-Like Performance:** The Aggregator-Publisher layer provides performance characteristics similar to traditional centralized services, but with decentralization benefits.

**Smart Contract Integration:** Walrus is built into Sui, meaning all payment and storage management are fully programmable using Move smart contracts. You can delete blobs, free up storage claims, and even build secondary markets for storage.

---

## How Walrus Works?

![Lifecycle of Data in Walrus](https://cdn.prod.website-files.com/6864f039b26f4afedada6bc6/6864f039b26f4afedada6d39_Walrus_client_flow.jpg)
<em>A blob’s lifecycle on Walrus is managed by client software and validated on Sui. Beyond this lifecycle, further infrastructure supports Walrus’ practical utility and performance.</em>

### The Storage Architecture

Walrus serves two primary functions:

1. **Storing blobs** – Uploading files to the network
2. **Retrieving blobs** – Downloading files from the network

For hackathon participants and new users, the easiest entry point is through the **Publisher/Aggregator layer**:

- **Publisher:** Allows you to upload files
- **Aggregator:** Allows you to download files

Both provide an HTTP interface and browser-friendly interaction methods.

### Pricing Model

**Testnet:** Both Publisher and Aggregator services are completely free.

**Mainnet:** You'll need an account with established publishers and aggregators, which charge small fees in fiat currency or other payment methods for read/write operations.

**Performance Optimization:** For faster reads, you can cache or use a CDN on top of your blob URLs.

---

## Getting Started – Three Methods

### Method 1: HTTP API (Publisher/Aggregator) – Easiest for Beginners

This is the quickest way to get started without any wallet or CLI installation.

**Setup:**

1. Visit [docs.wal.app](https://docs.wal.app) for the HTTP API documentation
2. Configure environment variables for testnet aggregator and publisher
3. Use standard HTTP commands to upload and download

**Uploading a file:**

```bash
curl -X POST \
  -F "file=@your-file.txt" \
  https://publisher-testnet.walrus.space/v1/store
```

The response includes a **blob ID** that uniquely identifies your file.

**Downloading a file:**

```bash
curl https://aggregator-testnet.walrus.space/v1/read/BLOB_ID \
  -o downloaded-file.txt
```

**Advantages:**

- No wallet required
- No CLI installation needed
- Web-based interface available
- Perfect for quick testing and prototyping

**Limitations:**

- Maximum file size: 10MB on public publisher
- Best for simple use cases

---

### Method 2: Walrus CLI – Power User Approach

For more control and larger files, the Walrus CLI offers direct interaction with storage nodes.

**Installation:**

First, install `suiup`:

```bash
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh

```

Then, install Sui and Walrus CLI:

```bash
suiup install sui
suiup install walrus
```

**Prerequisites:**

- Configured Sui client
- Walrus tokens (testnet)

**Check your balance:**

```bash
walrus client balance
```

**Get SUI testnet tokens:**

```bash
sui client faucet
```

Or visit this link https://fmfaucet.xyz/

**Get WAL testnet tokens:**

```bash
walrus get-wal --context testnet
```

**Configure tooling for Walrus Testnet**
After installing Walrus it is important to configure the Walrus client, which tells it the RPC URLs to use to access Testnet or Mainnet, as well as the Sui objects that track the state of the Walrus network. The easiest way to configure Walrus is to download the following pre-filled configuration file.

```bash
curl --create-dirs https://docs.wal.app/setup/client_config.yaml -o ~/.config/walrus/client_config.yaml
```

Next, you need to configure the Sui client to connect to Testnet. The Sui client configuration is separate from the Walrus client configuration. Learn more about the Sui client configuration.

```bash
sui client
```

When prompted, enter the following:

- Connect to a Sui Full Node server? → Y
- Full node server URL → https://fullnode.testnet.sui.io:443
- Environment alias → testnet
- Select key scheme → 0 (for ed25519)
  This creates your Sui client configuration file with a Testnet environment and generates your first address.

If you already setup Sui client, just switch to Sui testnet

```bash
sui client switch --env testnet
```

For double check, it should show up `testnet`

```bash
sui client active-env
```

To confirm the Walrus configuration also uses Testnet, run the command:

```bash
walrus info
```

**Let's make a sample file and write `Hello FM` to it**

```bash
touch sample.txt
echo "Hello FM" > sample.txt
```

**Uploading a file:**

```bash
walrus store --epoch 1 sample.txt
```

This command:

- Encodes your file using REST-2 erasure coding
- Uploads directly to storage nodes
- Returns a **BLOB_ID** for retrieval

**Downloading a file:**

```bash
walrus read BLOB_ID > downloaded-file.txt
```

Now the downloaded-file.txt got the content inside sample.txt

**Advantages:**

- Direct interaction with storage network
- Supports files up to 1GB (through upload relay)
- Full control over the upload process
- Better for production use

**Limitations:**

- Requires Walrus CLI setup
- Requires Walrus tokens
- More network requests needed for reads

---

### Method 3: Upload Relay – Balanced Approach

The Upload Relay sits between the HTTP API and CLI, designed for users with Sui wallets who want to upload larger files with fewer network requests.

**Walrus Relay Example:** [https://relay.wal.app](https://relay.wal.app/)

**Key Differences from Publisher:**

- Assumes users have a Sui wallet (MetaMask, Sui Wallet, etc.)
- Maximum file size: 1GB (vs 10MB for public publisher)
- The upload Relay reduce the number of requests needed to write a blob, but
  reads through the walrus SDK will still require a lot of requests
  More details [https://docs.wal.app](https://docs.wal.app/operator-guide/upload-relay.html)
  ![Relay Flow](https://violet-defensive-monkey-718.mypinata.cloud/ipfs/bafkreifdpaz6obf27tq4e3pe75uhawqurcfv73hucbxn5qizonvm6ggozy "Relay Flow")

**Use case:** Ideal for web applications that need to handle user uploads while minimizing network overhead.

---

## The TypeScript SDK

For developers building applications on top of Walrus, the TypeScript SDK provides programmatic access to storage nodes, or with the walrus upload relay
[https://sdk.mystenlabs.com/walrus](https://sdk.mystenlabs.com/walrus)

### Important Note on SDK Usage

The TypeScript SDK is designed to:

- Work directly with storage nodes
- Serve as a foundation for building custom aggregators and publishers
- Handle complex interactions beyond simple uploads/downloads

**For browser-based applications:** Using the SDK directly from the frontend will create many network requests. The recommended approach is to use the Upload Relay instead.

### Client Write Files Flow

If you need direct access from the frontend, use the Warus File Flow method:

```typescript
const file = new TextEncoder().encode("Hello from the TS SDK !!! \n");

const { blobId } = await client.walrus.writeBlob({
  blob: file,
  deletable: false,
  epochs: 3,
  signer: keypair,
});
```

More details: [https://sdk.mystenlabs.com/walrus](https://sdk.mystenlabs.com/walrus)

This provides the most efficient way to write files directly to storage nodes while minimizing redundant requests.

---

## Hosting Decentralized Websites with Warus Sites

One of the most powerful features of Walrus is the ability to host fully decentralized websites.

### How Warus Sites Work

A website consists of multiple blobs (HTML, CSS, JavaScript, images, and other content). Walrus Sites allow you to:

1. Store all website components on Walrus
2. Register a domain name (using Sui Name Service)
3. Access your site through a browser via a **portal server**

### The Portal Resolution Flow

When you visit `docs.walrus.app`:

1. Your browser contacts the **site portal server**
2. The portal looks up the CNS (Sui Name Service) name
3. The CNS entry contains the **Walrus Site object ID**
4. The Walrus Site object ID points to all the blob IDs that make up the website
5. The portal retrieves and renders the resources
6. Your browser displays the fully decentralized website

### Deploying Your Own Walrus Site

**Step 1: Install site-builder**

```bash
suiup install site-builder
```

**Step 2: Deploy your site**

```bash
site-builder --context testnet deploy /path/to/your/website --epochs 1
```

This command:

- Stores all resources on Walrus
- Returns a **site object ID** and **local development link**

**Step 3: View locally (testnet)**

Since testnet doesn't have a public portal which supported by mainnet (wal.app), you need self-host a portal:

1. Clone the Walrus Sites repository:

```bash
cd /path/to/your/website
```

2. Install dependencies and start:

```bash
bun install # npm install
bun start   # npm run dev
```

3. Access your site locally at **local development link** that `site-builder` gave you

**Step 4: Register a domain name (optional, for prettier URLs)**

To get a nice domain like `mysite.walrus.app`:

1. Register a name on Sui Name Service ([testnet.suins.io](https://testnet.suins.io/account/my-names/#your_name) for testnet)
2. Link your Walrus Site object ID to the SNS name throuhg 3 dots icon and click `Link To Walrus Website`, paste your **site object ID** and apply it
3. The portal will recognize the association and serve your site `<your-domain-name>.localhost:3000`


On **mainnet**, you can register a real `walrus.app` domain for a professional appearance.

More details:

- [https://docs.wal.app/walrus-sites/intro.html](https://docs.wal.app/walrus-sites/intro.html)
- [https://github.com/MystenLabs/walrus-sites](https://github.com/MystenLabs/walrus-sites)

### Current Portal Availability

- **Testnet:** No public portal. You must self-host locally.
- **Mainnet:** `walrus.app` provides a public portal. Sites like `docs.walrus.app` are already decentralized websites stored on Walrus.

---

## Choosing the Right Method

### Use Publisher/Aggregator (HTTP API) if you:

- Want the fastest setup with zero configuration
- Don't need a wallet
- Are uploading files under 10MB
- Want a web-based interface

### Use Walrus CLI if you:

- Need direct control over storage operations
- Are uploading files larger than 10MB
- Want to manage configuration programmatically
- Are integrating Walrus into backend systems

### Use Upload Relay if you:

- Have a Sui wallet (MetaMask, Sui Wallet, etc.)
- Are building a web application with user uploads
- Need to handle files up to 1GB
- Want to minimize network requests

### Use TypeScript SDK if you:

- Are building a custom aggregator or publisher
- Need low-level programmatic access to storage nodes
- Are developing infrastructure-level tools

---

## Community SDKs and Tools

While official SDKs exist for TypeScript, the community has developed additional tools:

**Unofficial SDKs:**

- **Go SDK** – For backend systems built in Go
- **Python SDK** – For data science and automation workflows
- **PHP SDK** – For web applications
- **Rust SDK** – Currently embedded in the Walrus repository, being officially developed

**Alternative Services:**

- **Tusky** – A Dropbox-like interface built on top of Walrus for easier file management

---

## Next Steps and Resources
### Essential Resources

- **Official Documentation:** [docs.walrus.app](https://docs.walrus.app)
- **Walrus Website:** [walrus.xyz](https://walrus.xyz)
- **Discord Communities:**
  - [Sui Discord](https://discord.gg/sui)
  - [Walrus Discord](https://discord.gg/walrusprotocol)
  - [First Movers Discord](https://discord.gg/xRCWupVA)
  - 24/7 support for questions
- **Forum:** Official forum for community discussions

### Tips for Success

1. **Start on testnet:** Get comfortable with the basics before deploying mainnet
2. **Free testnet storage:** Take advantage of free Publisher/Aggregator services
3. **Ask questions:** The community is active and helpful on Discord
4. **Explore examples:** The Walrus repository contains example proqjects to learn from
5. **Participate in hackathons:** Hands-on experience is the best way to master the platform
