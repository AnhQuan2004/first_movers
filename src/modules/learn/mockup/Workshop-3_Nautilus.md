---
heroImage: https://blog.sui.io/content/images/size/w1200/2025/04/Nautilus-2.png
---
# #3 Walrus101: Nautilus - Bringing Verified Off-Chain Computation On-Chain

## Introduction

In the first two Walrus workshops, we learned how to store files decentrally with Walrus and manage access with Seal's programmable policies. Now we unlock the final piece of the puzzle: **Nautilus**, a framework that enables trustworthy off-chain computation with on-chain verification.

Nautilus solves a fundamental limitation of blockchain: **not everything can or should be computed on-chain**. Whether due to cost, latency requirements, privacy concerns, or computational complexity, many real-world applications need off-chain processing. Nautilus bridges this gap using **Trusted Execution Environments (TEEs)** to generate cryptographic receipts proving that off-chain computation was executed correctly and securely.

---

## Key Points at a Glance

- **What is Nautilus?** A framework for verifiable off-chain computation using Trusted Execution Environments
- **Core innovation:** Combines Enclaves with remote attestation to prove code executed correctly
- **Two components:** Off-chain Enclave (AWS Nitro) + On-chain smart contracts for verification
- **Trusted Execution Environment (TEE):** Isolated computation environment with cryptographic guarantees
- **Remote Attestation:** Cryptographic receipt proving what code ran and what data it processed
- **Use cases:** Trusted oracles, AI agents, confidential computations, high-latency trading, private data processing
- **Integration with Seal:** Encrypt sensitive data that only the Enclave can decrypt
- **Measurement (PCR):** Unique identifier of your code; changes if code changes

---

## The Problem Nautilus Solves

![Nautilus](https://blog.sui.io/content/images/size/w1200/2025/04/Nautilus-2.png)

### Limitations of On-Chain Computation

Blockchain is powerful, but it has inherent constraints:

**1. Off-Chain Data Problem**
Many applications need real-world data that isn't on-chain. Consider a prediction market for Bitcoin prices:

- The contract needs the current Bitcoin price from an external source
- You must use an oracle service
- Who verifies the oracle is providing correct data?
- If the oracle provides false data, you have no recourse

**2. Computational Complexity**
Some tasks are prohibitively expensive or impossible to implement on-chain:

- High-frequency trading algorithms written in optimized languages (C++, Rust)
- Complex machine learning models requiring significant compute
- Operations requiring external API access with authentication
- These tasks are often better implemented off-chain

**3. Latency and Cost**

- Every on-chain transaction has a cost and confirmation time
- Some applications require millisecond-level responsiveness
- Processing large datasets on-chain becomes prohibitively expensive

**4. Privacy Constraints**
Blockchains are public ledgers. If you want to process sensitive data:

- Poker games with hidden hands
- Private medical data processing
- Encrypted financial information
- You can't put everything on-chain without breaking privacy

### The Core Question

**How do we compute something off-chain and still trust the result on-chain?**

This is exactly what Nautilus addresses.

---

## Understanding Trusted Execution Environments

### What is a TEE?

A **Trusted Execution Environment (TEE)**, also called an Enclave, is a specialized isolated computation environment built into modern processors and cloud infrastructure.

**Key Properties:**

**Isolation:** The Enclave has its own memory allocation completely separate from the host machine. No other process—not even the host operating system or hypervisor—can access the Enclave's memory. This is enforced at the hardware level.

**Confidentiality:** You can:

1. Encrypt sensitive data before sending it to the Enclave
2. Only the Enclave's private key can decrypt it
3. The Enclave performs computations on the decrypted data
4. Send only the result back outside (encrypted if desired)
5. No one, not even the cloud provider, can see the computation

**Remote Attestation:** The Enclave can prove what code is running inside it through cryptographic certificates. This is the revolutionary part.

### Remote Attestation: Proof of Execution

Remote attestation is a cryptographic document that proves:

- **What code** is running inside the Enclave
- **What data** was processed
- **When** it was processed
- **Proof** that a trusted hardware/cloud provider verified this

Think of it as a **cryptographic receipt** for off-chain computation.

**How It Works:**

1. You write code that fetches Bitcoin price from Coinbase
2. You compile it and deploy it to an AWS Nitro Enclaves
3. When the Enclave runs, it generates an attestation document containing:

   - A unique hash of your code binary (called PCR or measurement)
   - A public key generated inside the Enclave
   - A signature from AWS's root certificate
   - The data your code processed

4. You can verify this receipt by:
   - Taking your source code
   - Compiling it yourself
   - Comparing the hash to the one in the attestation document
   - If they match, you know **exactly** what code executed inside the Enclave

**Why This Is Powerful:**

You don't need to trust the Enclave operator. You can verify the code yourself. This is called **client-verifiable attestation**.

### Current Support: AWS Nitro Enclaves
![AWS Nitro Enclaves](https://docs.aws.amazon.com/images/enclaves/latest/user/images/enclave-overview.png)


Sui currently supports **AWS Nitro Enclaves** as the TEE implementation because:

- Mature, battle-tested technology used in production by AWS
- Supports reproducible builds (same source code = same binary hash)
- AWS provides cryptographic guarantees through their root certificate
- Available globally through AWS EC2 instances

---

## Nautilus Framework Architecture

![Nautilus Framework Architecture](https://docs.sui.io/assets/images/flows-ddf415421ce616acbfd31021585bc66e.png)

### Two-Component System

Nautilus applications consist of two integrated components:

**Component 1: Off-Chain Enclave (AWS EC2 Instance)**

- Runs your proprietary logic
- Fetches external data (Bitcoin prices, weather data, etc.)
- Processes computations (AI models, trading logic, etc.)
- Handles sensitive data encryption/decryption
- Returns results with cryptographic proof

**Component 2: On-Chain Smart Contract (Sui Move)**

- Receives off-chain computation results
- Verifies the cryptographic receipt from the Enclave
- Implements your application logic using verified results
- Stores outcomes on-chain

### The Workflow

**Step 1: Developer Deploys Enclave**

As a developer, you:

1. Write your off-chain logic in Rust (or other languages)
2. Use the Nautilus template to handle Enclave setup
3. Deploy to an AWS EC2 instance with Nitro Enclaves support
4. Build the code into a binary

**Step 2: Register Enclave On-Chain**

You:

1. Get the Enclave's **measurement** (PCR) - a unique hash of your compiled code
2. Get the Enclave's **public key** from its attestation document
3. Register both on-chain in a smart contract registry
4. This links your off-chain code to your on-chain application

**Step 3: User Interacts with Application**

A user:

1. (Optional) Verifies the code matches by:
   - Reviewing source code on GitHub
   - Compiling it themselves
   - Comparing the hash to the registered measurement
2. Calls the Enclave's endpoint to process data (e.g., fetch Bitcoin price)
3. Gets back the result plus a cryptographic receipt
4. Submits result and receipt to the on-chain smart contract
5. The contract verifies the receipt is valid and uses the data

**Step 4: On-Chain Application Logic**

Your smart contract:

1. Receives the off-chain data and receipt
2. Verifies the receipt using the registered Enclave object
3. Proceeds with application logic knowing the data is trustworthy

### Key Components in Detail

**Measurement (PCR - Platform Configuration Registry)**

Each Enclave has a unique measurement—a cryptographic hash of:

- Your compiled binary
- Configuration files
- Dependencies
- Build environment

**Important:** If you change even one line of code, the measurement changes completely. This is a feature: it ensures the code you register matches what's actually running.

**Public Key Infrastructure**

- Each Enclave generates an ephemeral key pair
- The **private key never leaves the Enclave**
- The **public key** is committed in the attestation document
- The attestation document is signed by AWS using their root certificate
- This creates a cryptographic chain of trust

**Registry Smart Contract**

```rust
struct EnclaveRegistry {
    measurement: vector<u8>,        // PCR/code hash
    public_key: vector<u8>,         // Enclave's public key
    attestation_document: vector<u8>, // AWS-signed proof
}
```

This registry is the on-chain reference point for verifying off-chain results.

---

## Building with Nautilus

### High-Level Development Flow

Building a Nautilus application involves three main steps:

**Step 1: Develop & Deploy Off-Chain Enclave**

- Write Rust code implementing your logic
- Use provided templates for Enclave scaffolding
- Handle network configuration (Enclaves don't have internet access by default)
- Compile and deploy to AWS EC2

**Step 2: Create On-Chain Smart Contract**

- Write Move code that verifies attestation documents
- Implement your application logic
- Reference the Enclave registry

**Step 3: Build Your dApp**

- Frontend logic to interact with the Enclave
- Submit verified results to the smart contract
- Display outcomes to users

### Setting Up the Enclave

The Nautilus template handles many complexities for you:

**Internet Access Configuration**

Enclaves don't have internet access by default. The template provides configuration to:

- Whitelist allowed HTTP domains (e.g., `coinbase.com`, `api.weather.com`)
- Forward HTTP traffic from outside to your Enclave endpoints
- Example configuration:

```yaml
allowed_domains:
  - coinbase.com
  - api.weather.com
  - api.openai.com
```

**Memory Allocation**

AWS Nitro Enclaves require:

- Explicit memory allocation
- CPU vCPU assignment
- Storage for application binaries
- The template automates this setup

**Three Core Endpoints**

Your Enclave exposes three endpoints:

1. **Health Check Endpoint** (`/health`)

   - Simple liveness probe
   - Part of template, no modification needed
   - Template provided

2. **Get Attestation Endpoint** (`/get_attestation`)

   - Returns the remote attestation document
   - Contains measurement (PCR) and public key
   - Used during on-chain registration
   - Template provided, critical for security

3. **Process Data Endpoint** (`/process_data`) ← **You implement this**
   - Your custom business logic
   - Fetches external data, runs AI models, processes private data
   - Returns result signed with Enclave's private key
   - Examples:
     - Fetch weather data from external API
     - Run machine learning inference
     - Process encrypted medical records
     - Calculate trading signals

## Demo Weather Data Fetcher Example

This section provides a comprehensive walkthrough of building a real Nautilus application that fetches weather data from an external API and stores it on-chain.

### Project Structure

The Nautilus template provides the following structure:

```
nautilus/
├── move/
│   ├── enclave/              # Template: Enclave registration logic
│   └── app/                  # YOUR CODE: Application-specific Move
│       ├── sources/
│       │   ├── weather.move  # Weather NFT logic
│       │   └── init.move
│       └── Move.toml
├── src/
│   ├── aws/                  # Template: AWS boilerplate
│   ├── init/                 # Template: EC2 initialization
│   ├── system/               # Template: System utilities
│   └── nautilus-server/      # YOUR CODE: Enclave application
│       ├── src/
│       │   ├── main.rs       # Template: HTTP server setup
│       │   ├── common.rs     # Template: Attestation handling
│       │   ├── app.rs        # YOUR CODE: Business logic
│       │   └── lib.rs
│       ├── allowed_endpoints.yaml  # Config: APIs to whitelist
│       ├── run.sh            # Template: Enclave startup
│       └── Cargo.toml
└── configure_enclave.sh      # Setup script
```

**Focus Areas:**
1. `move/app/sources/weather.move` - Your Move smart contract
2. `src/nautilus-server/src/app.rs` - Your Rust business logic
3. `src/nautilus-server/allowed_endpoints.yaml` - API whitelist

### Step 1: Configure Allowed Endpoints

**File: `src/nautilus-server/allowed_endpoints.yaml`**

Before starting, tell the enclave which external APIs it can access:

```yaml
# Domains the enclave is allowed to access
allowed_endpoints:
  - api.weatherapi.com    # Weather API
  - api.binance.com       # Crypto prices (for advanced example)
  - api.openai.com        # AI models (for ML example)
```

When you run `configure_enclave.sh`, this file is used to generate the necessary traffic forwarding rules. The enclave runs without internet by default, so you must explicitly whitelist each domain.

### Step 2: Initial Setup

**Step 1: Set Up AWS Environment**

```bash
# Export your AWS credentials
export KEY_PAIR=<your-key-pair-name>
export AWS_ACCESS_KEY_ID=<your-access-key>
export AWS_SECRET_ACCESS_KEY=<your-secret-key>
export AWS_SESSION_TOKEN=<your-session-token>

# Set region if not us-east-1
export REGION=us-east-1
export AMI_ID=ami-0c55b159cbfafe1f0  # Amazon Linux 2
```

**Step 2: Run Configuration Script**

```bash
$ sh configure_enclave.sh
```

The script will prompt you:

```
Enter EC2 instance base name: weather-service
Do you want to use a secret? (y/n): y
Do you want to create a new secret or use an existing secret ARN? (new/existing): new
Enter secret name: weather-api-key
Enter secret value: 045a27812dbe456392913223221306
```

This creates:
- An AWS EC2 instance with Nitro enclave support
- An AWS Secrets Manager secret for your API key
- Modified `run.sh` and `expose_enclave.sh` scripts

### Step 3: Implement the Rust Enclave Logic

**File: `src/nautilus-server/src/app.rs`**

This is where your off-chain computation logic lives:

```rust
use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;

// Request structure: what the client sends to the enclave
#[derive(Debug, Deserialize, Serialize)]
pub struct ProcessRequest {
    pub payload: WeatherRequest,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct WeatherRequest {
    pub location: String,
}

// Response structure: what the enclave returns to the client
#[derive(Debug, Serialize)]
pub struct ProcessResponse {
    pub response: EnclavResponse,
    pub signature: String,
}

#[derive(Debug, Serialize)]
pub struct EnclavResponse {
    pub intent: u64,
    pub timestamp_ms: u64,
    pub data: WeatherData,
}

#[derive(Debug, Serialize, Clone)]
pub struct WeatherData {
    pub location: String,
    pub temperature: i32,
}

// Main handler: fetches weather and returns signed result
#[actix_web::post("/process_data")]
pub async fn process_data(
    req: web::Json<ProcessRequest>,
) -> HttpResponse {
    // Step 1: Get API key from environment (provided by AWS Secrets Manager)
    let api_key = env::var("API_KEY")
        .unwrap_or_else(|_| "default-key".to_string());

    let location = &req.payload.location;

    // Step 2: Fetch weather data from external API
    let weather = match fetch_weather_api(location, &api_key).await {
        Ok(data) => data,
        Err(e) => {
            eprintln!("Weather API error: {}", e);
            return HttpResponse::InternalServerError()
                .json(json!({"error": "Failed to fetch weather"}));
        }
    };

    // Step 3: Create the response with metadata
    let timestamp_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64;

    let response = EnclavResponse {
        intent: 0,
        timestamp_ms,
        data: weather,
    };

    // Step 4: Serialize the response for signing
    // CRITICAL: Must match the Move contract's deserialization
    let serialized = bcs::to_bytes(&response)
        .expect("Failed to serialize response");

    // Step 5: Sign with enclave's private key
    // The private key is stored in the enclave's ephemeral key pair
    let signature = match sign_data(&serialized).await {
        Ok(sig) => sig,
        Err(e) => {
            eprintln!("Signing error: {}", e);
            return HttpResponse::InternalServerError()
                .json(json!({"error": "Failed to sign response"}));
        }
    };

    // Step 6: Return result with proof
    HttpResponse::Ok().json(ProcessResponse {
        response,
        signature,
    })
}

// Helper function: Fetch weather from weatherapi.com
async fn fetch_weather_api(
    location: &str,
    api_key: &str,
) -> Result<WeatherData, Box<dyn std::error::Error>> {
    let url = format!(
        "https://api.weatherapi.com/v1/current.json?key={}&q={}&aqi=no",
        api_key, location
    );

    let client = reqwest::Client::new();
    let response = client.get(&url).send().await?;
    
    let json: serde_json::Value = response.json().await?;

    // Extract temperature from API response
    let temperature = json["current"]["temp_c"]
        .as_f64()
        .unwrap_or(0.0) as i32;

    Ok(WeatherData {
        location: location.to_string(),
        temperature,
    })
}

// Helper function: Sign data with enclave's private key
async fn sign_data(data: &[u8]) -> Result<String, Box<dyn std::error::Error>> {
    // This uses the enclave's ephemeral private key
    // In production, this would use AWS Nitro's NSM (Nitro Secure Module)
    let signature = perform_ed25519_signing(data)?;
    Ok(hex::encode(signature))
}

// Actual signing implementation (simplified for demonstration)
fn perform_ed25519_signing(data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    // The enclave's private key is generated at startup in main.rs
    // and available through the global state
    // This is a placeholder - actual implementation uses ed25519-dalek
    todo!("Implement actual ed25519 signing with enclave key")
}

// Unit test: Verify serialization matches Move contract
#[cfg(test)]
mod test_serde {
    use super::*;

    #[test]
    fn test_response_serialization() {
        let weather = WeatherData {
            location: "San Francisco".to_string(),
            temperature: 13,
        };

        let response = EnclavResponse {
            intent: 0,
            timestamp_ms: 1744041600000,
            data: weather,
        };

        // Serialize to BCS (Binary Canonical Serialization)
        let bytes = bcs::to_bytes(&response)
            .expect("Should serialize");

        // Verify it can be deserialized
        let _deserialized: EnclavResponse = bcs::from_bytes(&bytes)
            .expect("Should deserialize");
    }
}
```

### Step 4: Build and Deploy Enclave

Once you've updated `app.rs`, build and run:

```bash
# SSH into your EC2 instance
$ ssh -i <your-key-pair>.pem ec2-user@<PUBLIC_IP>

# Clone repo and go to nautilus directory
$ git clone https://github.com/MystenLabs/sui.git
$ cd sui/examples/nautilus

# Build the enclave image
$ make

# Verify PCR values (unique hash of your code)
$ cat out/nitro.pcrs
3a929ea8b96d4076da25e53e740300947e350a72a775735f63f8b0f8112d3ff04d8ccae53f5ec13dd3c05b865ba7b610 PCR0
3a929ea8b96d4076da25e53e740300947e350a72a775735f63f8b0f8112d3ff04d8ccae53f5ec13dd3c05b865ba7b610 PCR1
21b9efbc184807662e966d34f390821309eeac6802309798826296bf3e8bec7c10edb30948c90ba67310f7b964fc500a PCR2

# Save these for on-chain registration
$ export PCR0=3a929ea8b96d4076da25e53e740300947e350a72a775735f63f8b0f8112d3ff04d8ccae53f5ec13dd3c05b865ba7b610
$ export PCR1=3a929ea8b96d4076da25e53e740300947e350a72a775735f63f8b0f8112d3ff04d8ccae53f5ec13dd3c05b865ba7b610
$ export PCR2=21b9efbc184807662e966d34f390821309eeac6802309798826296bf3e8bec7c10edb30948c90ba67310f7b964fc500a

# Run the enclave
$ make run

# In another terminal, expose the endpoints
$ sh expose_enclave.sh
```

### Step 5: Test the Enclave Locally

Before deploying to AWS, test locally:

```bash
# From src/nautilus-server directory
$ RUST_LOG=debug API_KEY=045a27812dbe456392913223221306 cargo run

# In another terminal, test the endpoint
$ curl -H 'Content-Type: application/json' \
  -d '{"payload": {"location": "San Francisco"}}' \
  -X POST http://localhost:3000/process_data

# Response
{
  "response": {
    "intent": 0,
    "timestamp_ms": 1744041600000,
    "data": {
      "location": "San Francisco",
      "temperature": 13
    }
  },
  "signature": "b75d2d44c4a6b3c676fe087465c0e85206b101e21be6cda4c9ab2fd4ba5c0d8c623bf0166e274c5491a66001d254ce4c8c345b78411fdee7225111960cff250a"
}
```

### Step 6: Implement the Move Smart Contract

**File: `move/app/sources/weather.move`**

This contract verifies the enclave's signature and stores the weather data as an NFT:

```move
module examples::weather {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::ed25519;

    // One-Time Witness for initialization
    public struct WEATHER has drop {}

    // Weather NFT: stores verified weather data on-chain
    public struct WeatherNFT has key, store {
        id: UID,
        location: String,
        temperature: i32,
        timestamp_ms: u64,
    }

    // Weather data structure: must match Rust struct
    public struct WeatherData has copy, drop {
        location: String,
        temperature: i32,
    }

    // Response structure: must match Rust serialization
    public struct EnclavResponse has copy, drop {
        intent: u64,
        timestamp_ms: u64,
        data: WeatherData,
    }

    // Module initialization
    fun init(_witness: WEATHER, _ctx: &mut TxContext) {
        // Any setup logic goes here
    }

    // Main function: Verify signature and mint NFT
    public entry fun update_weather(
        enclave_object: &enclave::Enclave,  // Reference to registered enclave
        signature: vector<u8>,               // Signature from enclave
        timestamp_ms: u64,
        location: String,
        temperature: i32,
        ctx: &mut TxContext,
    ) {
        // Step 1: Construct the exact payload that was signed
        let response = EnclavResponse {
            intent: 0,
            timestamp_ms,
            data: WeatherData {
                location: location,
                temperature,
            },
        };

        // Step 2: Serialize the response using BCS
        let serialized = bcs::to_bytes(&response);

        // Step 3: Verify the signature using the enclave's public key
        let enclave_public_key = enclave::get_public_key(enclave_object);
        assert!(
            ed25519::ed25519_verify(
                &signature,
                &enclave_public_key,
                &serialized,
            ),
            EInvalidSignature,
        );

        // Step 4: Create and transfer the NFT
        let nft = WeatherNFT {
            id: object::new(ctx),
            location,
            temperature,
            timestamp_ms,
        };

        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    // Error codes
    const EInvalidSignature: u64 = 1;
}
```

### Step 7: Deploy Smart Contracts

```bash
# Deploy enclave registration package
$ cd move/enclave
$ sui move build
$ sui client publish
$ ENCLAVE_PACKAGE_ID=0x14e8b4d8b28ee9aa5ea604f3f33969b3d0f03247b51837f27e17bcf875d3582c

# Deploy your app package
$ cd ../app
$ sui move build
$ sui client publish
$ EXAMPLES_PACKAGE_ID=0x7e712fd9e5e57d87137440cfea77dc7970575a5c3229d78bb7176ab984d94adf
$ CAP_OBJECT_ID=0xb157d241cc00b7a9b8b0f11d0b4c3e11d8334be95f7e50240962611bd802abff
$ ENCLAVE_CONFIG_OBJECT_ID=0x58a6a284aaea8c8e71151e4ae0de2350ae877f0bd94adc2b2d0266cf23b6b41d
```

### Step 8: Register Enclave On-Chain

```bash
# Set environment variables
$ export ENCLAVE_URL=http://<PUBLIC_IP>:3000
$ export MODULE_NAME=weather
$ export OTW_NAME=WEATHER

# Update PCRs on-chain
$ sui client call \
  --function update_pcrs \
  --module enclave \
  --package $ENCLAVE_PACKAGE_ID \
  --type-args "$EXAMPLES_PACKAGE_ID::$MODULE_NAME::$OTW_NAME" \
  --args $ENCLAVE_CONFIG_OBJECT_ID $CAP_OBJECT_ID \
  0x$PCR0 0x$PCR1 0x$PCR2

# Register the enclave (this calls get_attestation and registers public key)
$ sh ../../register_enclave.sh \
  $ENCLAVE_PACKAGE_ID \
  $EXAMPLES_PACKAGE_ID \
  $ENCLAVE_CONFIG_OBJECT_ID \
  $ENCLAVE_URL \
  $MODULE_NAME \
  $OTW_NAME

$ ENCLAVE_OBJECT_ID=0xe0e70df5347560a1b43e5954267cadd1386a562095cb4285f2581bf2974c838d
```

### Step 9: Query Weather and Update On-Chain

```bash
# Step 1: Fetch weather from enclave
$ curl -H 'Content-Type: application/json' \
  -d '{"payload": {"location": "San Francisco"}}' \
  -X POST http://<PUBLIC_IP>:3000/process_data

# Response:
{
  "response": {
    "intent": 0,
    "timestamp_ms": 1744683300000,
    "data": {
      "location": "San Francisco",
      "temperature": 13
    }
  },
  "signature": "77b6d8be225440d00f3d6eb52e91076a8927cebfb520e58c19daf31ecf06b3798ec3d3ce9630a9eceee46d24f057794a60dd781657cb06d952269cfc5ae19500"
}

# Step 2: Submit to smart contract
$ sh ../../update_weather.sh \
  $EXAMPLES_PACKAGE_ID \
  $MODULE_NAME \
  $OTW_NAME \
  $ENCLAVE_OBJECT_ID \
  "77b6d8be225440d00f3d6eb52e91076a8927cebfb520e58c19daf31ecf06b3798ec3d3ce9630a9eceee46d24f057794a60dd781657cb06d952269cfc5ae19500" \
  1744683300000 \
  "San Francisco" \
  13

# Result: WeatherNFT created on-chain with verified weather data!
```

### Critical Implementation Details

**Binary Canonical Serialization (BCS)**

The signature is over the exact BCS serialization of the response. If the Move contract and Rust code serialize differently, verification will fail.

**Test both:**

Rust side (`src/nautilus-server/src/app.rs`):
```rust
#[test]
fn test_response_serialization() {
    let weather = WeatherData {
        location: "San Francisco".to_string(),
        temperature: 13,
    };

    let response = EnclavResponse {
        intent: 0,
        timestamp_ms: 1744041600000,
        data: weather,
    };

    let bytes = bcs::to_bytes(&response).expect("Should serialize");
    let _deserialized: EnclavResponse = bcs::from_bytes(&bytes)
        .expect("Should deserialize");
}
```

Move side (`move/app/sources/weather.move`):
```move
#[test]
fun test_weather_data_serialization() {
    let weather = WeatherData {
        location: b"San Francisco".to_string(),
        temperature: 13,
    };

    let response = EnclavResponse {
        intent: 0,
        timestamp_ms: 1744041600000,
        data: weather,
    };

    let _bytes = bcs::to_bytes(&response);
}
```

## Advanced: Combining Nautilus with Seal

### The Problem

You've written a weather fetching Enclave that needs API keys:

- API key for weather.com: `secret-api-key-12345`
- API key for Coinbase: `coinbase-api-key-xyz`

Where do you store these securely?

### The Solution: Nautilus + Seal

Use **Seal** to encrypt secrets that **only your Enclave can decrypt**:

**Step 1: Define a Seal Policy**

Create a Seal access policy that grants access only to your Enclave:

```rust
module weather_app::Enclave_access {
    struct EnclaveAccessPolicy has key {
        id: UID,
        allowed_Enclave: vector<u8>, // Your Enclave's measurement
    }

    // Only grant access if the request is from our registered Enclave
    public entry fun seal_approve(
        policy: &EnclaveAccessPolicy,
        requester: &EnclaveRegistry,
    ) {
        assert!(
            requester.measurement == policy.allowed_Enclave,
            ENotAuthorizedEnclave
        );
    }
}
```

**Step 2: Encrypt API Keys with Seal**

Encrypt your API keys using Seal's public key:

```typescript
// Encrypt API key for weather.com
const encryptedApiKey = await seal.encrypt({
  data: "secret-api-key-12345",
  packageId: weatherPackageId,
  identity: "weather-api-key",
  threshold: 1,
});

// Upload to Walrus
const blobId = await walrus.store(encryptedApiKey);
```

**Step 3: Provision to Enclave**

Deploy the encrypted API keys to your Enclave:

```bash
# The Enclave can only decrypt this if it has the correct access proof
curl -X POST https://your-Enclave/provision_secrets \
  -d '{"encrypted_api_key": "...blobId..."}'
```

**Step 4: Enclave Requests Decryption**

When the Enclave needs the API key:

1. Enclave generates proof of its identity (signed by Enclave's private key)
2. Enclave proves it's registered as allowed by the Seal policy
3. Seal key servers verify the proof
4. Only if verified, they release the decryption key
5. Enclave decrypts the API key
6. Enclave uses API key to fetch data
7. Returns result with proof to user

**Result:** Your API keys are:

- Encrypted and stored publicly (on Walrus)
- Only decryptable by your specific Enclave
- Protected by cryptographic proof
- No risk of compromise if database is breached

---

## Use Cases and Applications

### Trusted Oracles

**Problem:** How do you verify that price data is correct?

**Solution:** Run an oracle in an Enclave.

**Implementation:**

- Enclave fetches Bitcoin price from Coinbase API
- Returns price + cryptographic proof it came from your registered Enclave code
- Smart contract verifies the proof and uses the price
- Prediction market resolves correctly with trustworthy data

**Advantage:** Users can review your code, verify it only fetches from Coinbase, and be confident in the data.

### AI Agents & Machine Learning

**Problem:** Running complex ML models on-chain is infeasible.

**Solution:** Run AI agents in Enclaves.

**Implementation:**

- Deploy your LLM or ML model in an Enclave
- User sends prompt/data to Enclave
- Enclave runs inference
- Returns result + proof of execution
- Smart contract uses the result (e.g., determine loan approval based on creditworthiness)

**Advantage:**

- Complex computations run off-chain (fast, cheap)
- Result is verifiably correct (proof of execution)
- Can process private data securely

### Confidential Computations

**Problem:** How do you process sensitive data (medical records, KYC documents) on blockchain?

**Solution:** Process in Enclave, only return sanitized results.

**Implementation:**

- User encrypts medical record with Enclave's public key
- Enclave decrypts, analyzes data (e.g., disease risk score)
- Returns only the score + proof
- Never exposes raw medical data on-chain

**Example: KYC Verification**

- User submits encrypted driver's license
- Enclave verifies age
- Returns boolean (true if over 21)
- Smart contract gates access to DeFi protocol for adults only

### High-Frequency Trading

**Problem:** On-chain execution is too slow for algorithmic trading.

**Solution:** Run trading algorithms in Enclave.

**Implementation:**

- Trading algorithm monitors market data in real-time
- Makes trading decisions based on custom logic
- Submits executed trades + proof to smart contract
- Smart contract settles trades with verified outcomes

**Advantage:** Millisecond-level responsiveness, trustable execution.

### Privacy-Preserving Analytics

**Problem:** Sensitive business data shouldn't go on-chain.

**Solution:** Analyze off-chain, report only results.

**Implementation:**

- Companies encrypt operational data
- Enclave processes anonymized analytics
- Returns aggregated insights + proof
- Business intelligence on-chain is trustable

---

## Getting Started with Nautilus

### Prerequisites

- AWS account with EC2 access
- Rust programming knowledge
- Sui Move smart contract basics
- Understanding of cryptographic concepts (optional but helpful)
- Testnet SUI tokens

### Step 1: Review the Documentation

Visit `sui.io/nautilus` for:

- Complete setup guide
- Example applications
- AWS Nitro Enclaves configuration
- Template code

### Step 2: Clone the Template Repository

The official Nautilus examples include:

- Weather data fetcher (simple example)
- Seal integration (advanced example)
- Scaffolding for AWS EC2 setup
- Move smart contract templates

```bash
git clone https://github.com/MystenLabs/sui
cd sui/examples/nautilus
```

### Step 3: Deploy Enclave to AWS

Using the provided template:

1. Create AWS EC2 instance with Nitro support (`m6i`, `m7i`, or `c7g` families)
2. Install Enclave runtime
3. Configure allowed domains
4. Build and deploy your Rust application
5. Start the Enclave

### Step 4: Register On-Chain

1. Get attestation document from your running Enclave
2. Extract measurement and public key
3. Submit registration transaction to Sui
4. Once confirmed, your Enclave is registered

### Step 5: Build Your Application

1. Write your dApp smart contract
2. Implement verification logic
3. Build frontend to interact with Enclave and contract
4. Test on testnet before mainnet

### Script-Based Registration

Nautilus provides helper scripts to automate registration:

```bash
./register-Enclave.sh \
  --Enclave-url https://your-instance/get_attestation \
  --sui-rpc https://fullnode.testnet.sui.io:9000
```

This handles:

- Fetching attestation
- Parsing measurement and public key
- Building registration transaction
- Submitting to blockchain
- No manual configuration needed

---

## Common Use Cases

### Content Moderation

**Setup:**

- User-generated content stored on Walrus
- Enclave runs ML model to detect harmful content
- Returns moderation decision with proof
- dApp enforces moderation on-chain

### Privacy-Preserving Insurance

**Setup:**

- Customers submit encrypted health data
- Enclave calculates risk score
- Returns premium + proof of fair calculation
- Smart contract issues policy

### Verifiable Randomness

**Setup:**

- Enclave generates random numbers from VRF
- Returns randomness + attestation
- Smart contract uses it for on-chain games, lotteries, airdrops
- Can't be manipulated without redeploying Enclave with different code

### Cross-Chain Bridges

**Setup:**

- Enclave monitors external blockchain
- Detects events and verifies them
- Reports to Sui smart contract with proof
- Cross-chain transactions settle trustably

---

## Next Steps and Resources

### Official Documentation

### Essential Resources
- **Nautilus Docs:** `sui.io/nautilus`
- **Nautilus GitHub:** `https://github.com/MystenLabs/nautilus`
- **Nautilus Twitter:** `https://github.com/MystenLabs/nautilus-twitter`
- **AWS Nitro Documentation:** `https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave.html`

- **Discord Communities:**
  - [Sui Discord](https://discord.gg/sui)
  - [Walrus Discord](https://discord.gg/walrusprotocol)
  - [First Movers Discord](https://discord.gg/xRCWupVA)
  - 24/7 support for questions
- **Forum:** Official forum for community discussions

### Learning Path

1. **Start Simple:** Deploy the weather example to understand the flow
2. **Experiment:** Modify the example to fetch different data
3. **Integrate with Seal:** Try the weather + Seal integration example
4. **Combine with Walrus:** Store and retrieve data from Walrus in your Enclave
5. **Build Your Project:** Implement your hackathon idea

### Key Concepts to Deep Dive

- **Remote Attestation:** How AWS signs attestation documents
- **SGX vs Nitro:** Different TEE technologies
- **Reproducible Builds:** Ensuring code hashes match
- **Network Isolation:** How Enclaves handle network access
- **Threshold Cryptography:** Understanding key fragment recovery

### Tips for Success

1. **Start on testnet:** Get comfortable with the basics before deploying mainnet
2. **Free testnet storage:** Take advantage of free Publisher/Aggregator services
3. **Ask questions:** The community is active and helpful on Discord
4. **Explore examples:** The Walrus repository contains example proqjects to learn from
5. **Participate in hackathons:** Hands-on experience is the best way to master the platform
