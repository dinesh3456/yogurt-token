export interface TokenConfig {
    decimals: number;
    initialSupply: number;
  }
  
  export interface PoolConfig {
    tokenAMint: string;
    tokenBMint: string;
  }
  
  export interface TransferConfig {
    amount: number;
    recipient: string;
  }