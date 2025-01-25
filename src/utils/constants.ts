import { PublicKey } from '@solana/web3.js';

export const NETWORK = {
    DEVNET_URL: 'https://api.devnet.solana.com',
    MAINNET_URL: 'https://api.mainnet-beta.solana.com',
    CONFIRMATION_STRATEGY: 'confirmed' as const,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 30000,
  };

  export const TOKEN = {
    DECIMALS: 9,
    INITIAL_MINT_AMOUNT: 1000,
    MAX_MINT_AMOUNT: 1000000000,
    MIN_TRANSFER_AMOUNT: 0.000001,
    BURN_CAP_PERCENTAGE: 10,
    AUTHORITY_CONFIG: {
      FREEZE_AUTHORITY: null,
      CAN_FREEZE: false,
    },
  };
  
  export const POOL = {
    LIQUIDITY_PROGRAM_ID_V4: new PublicKey('RVKd61ztZW9vc7pj4NqRiQ7bopBRVB1qnCVfXkPLxvW'),
    WRAPPED_SOL_MINT: new PublicKey('So11111111111111111111111111111111111111112'),
    MIN_LIQUIDITY: 1000,
    INITIAL_LP_TOKENS: 100,
    SLIPPAGE_TOLERANCE: 0.5,
    POOL_FEES: {
      TRADING_FEE: 0.3,
      PROTOCOL_FEE: 0.1,
      LP_FEE: 0.2,
    },
  };

export const ERRORS = {
    WALLET: {
        LOAD: 'Failed to load wallet',
        INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
        INVALID_KEYPAIR: 'Invalid keypair provided'
    },
    TOKEN: {
        CREATE: 'Failed to create token',
        MINT: 'Failed to mint tokens',
        TRANSFER: 'Failed to transfer tokens',
        INSUFFICIENT_BALANCE: 'Insufficient token balance',
        INVALID_AMOUNT: 'Invalid token amount'
    },
    POOL: {
        CREATE: 'Failed to create pool',
        ADD_LIQUIDITY: 'Failed to add liquidity',
        REMOVE_LIQUIDITY: 'Failed to remove liquidity',
        INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity',
        SWAP: 'Failed to execute swap'
    },
    NETWORK: {
        CONNECTION: 'Failed to connect to network',
        TIMEOUT: 'Network operation timeout',
        TRANSACTION: 'Transaction failed'
    },
    CONFIG: {
        INVALID: 'Invalid configuration',
        MISSING: 'Missing configuration parameter'
    }
};

export const TRANSACTION = {
    MAX_CONFIRMATIONS: 32,
    CONFIRMATION_THRESHOLD: 'confirmed' as const,
    PREFLIGHT_COMMITMENT: 'processed' as const,
    RETRY_CONFIG: {
        maxRetries: 3,
        minRetryDelay: 500,
        maxRetryDelay: 2000
    }
};

export const UI = {
    DECIMALS_DISPLAY: 4,
    MAX_TRANSACTION_HISTORY: 50,
    REFRESH_INTERVAL: 10000,
    PRICE_PRECISION: 6
};