# Yogurt Token (YO)

A Solana-based token implementation with Raydium DEX integration.

## Token Specifications
- Name: Yogurt Token
- Symbol: YO
- Total Supply: 1 billion
- Decimals: 9
- Distribution:
  - Launch Supply: 70% (700M)
  - Reserved: 21% (210M)
  - Initial Liquidity: 25% (250M)

## Prerequisites
- Node.js v18+
- Solana CLI tools
- npm/yarn

## Installation
```bash
# Clone repository
git clone [your-repo-url]
cd yogurt-token

# Install dependencies
npm install @solana/web3.js @solana/spl-token @raydium-io/raydium-sdk
```

## Development Environment Setup
```bash
# Install Solana tools
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Configure for devnet
solana config set --url https://api.devnet.solana.com

# Create development wallet
solana-keygen new --outfile yogurt-dev-wallet.json

# Get devnet SOL
solana airdrop 2 $(solana-keygen pubkey yogurt-dev-wallet.json)
```

## Project Structure
```
yogurt-token/
├── create-token.js      # Token creation script
├── transfer-tokens.js   # Token transfer functionality
├── raydium-pool.js     # Raydium liquidity pool setup
└── yogurt-dev-wallet.json
```

## Usage

### 1. Create Token
```bash
node create-token.js
```
This creates your token on Solana devnet and mints initial supply.

### 2. Test Transfers
```bash
node transfer-tokens.js
```
Tests token transfers between wallets.

### 3. Setup Raydium Pool
```bash
node raydium-pool.js
```
Creates and initializes a Raydium liquidity pool.

## Key Features
- SPL Token creation
- Token transfers
- Raydium DEX integration
- Liquidity pool setup
- Initial supply distribution

## Token Addresses
- Token Mint: Pa6sGCCedgGD1vxyEuhyRBeVFhjJchx5mSrSbaoPHWY
- Token Account: FRSH7DiYK5haGs87zCZ1HVeS8Ltib4hABgweYzaqqx1E

## Important Notes
- Currently configured for Solana devnet
- Requires sufficient SOL for transactions
- Keep wallet keys secure
- Test thoroughly before mainnet deployment

## Error Handling
Common issues and solutions:
1. Insufficient SOL: Use `solana airdrop`
2. Transaction failures: Check devnet status and retry
3. SDK version conflicts: Use specified versions in package.json

## Security Considerations
- Secure key management
- Rate limiting for airdrops
- Transaction verification
- Access control implementation

## Mainnet Deployment
For mainnet deployment:
1. Update network configuration
2. Secure proper funding
3. Audit code
4. Test extensively
5. Update program IDs
