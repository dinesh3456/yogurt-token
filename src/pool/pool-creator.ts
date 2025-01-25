import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { LiquidityPoolKeys, SPL_MINT_LAYOUT } from '@raydium-io/raydium-sdk-v2';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { NETWORK, POOL } from '../utils/constants';
import { SolanaError } from '../utils/error-handler';
import { PoolConfig } from '../types';
import logger from '../utils/logger';

export class PoolCreator {
  private connection: Connection;

  constructor(private wallet: Keypair) {
    this.connection = new Connection(NETWORK.DEVNET_URL, NETWORK.CONFIRMATION_STRATEGY);
  }

  async createPool(config: PoolConfig) {
    try {
      const poolKeypair = Keypair.generate();
      const lpMintKeypair = Keypair.generate();
      const baseVaultKeypair = Keypair.generate();
      const quoteVaultKeypair = Keypair.generate();
      const lpVaultKeypair = Keypair.generate();
      
      const [authority, nonce] = await PublicKey.findProgramAddress(
        [poolKeypair.publicKey.toBuffer()],
        POOL.LIQUIDITY_PROGRAM_ID_V4
      );

      const baseMintInfo = await this.connection.getAccountInfo(new PublicKey(config.tokenAMint));
      const quoteMintInfo = await this.connection.getAccountInfo(new PublicKey(config.tokenBMint));
      
      if (!baseMintInfo || !quoteMintInfo) {
        throw new Error('Failed to fetch mint info');
      }

      const baseDecimals = SPL_MINT_LAYOUT.decode(baseMintInfo.data).decimals;
      const quoteDecimals = SPL_MINT_LAYOUT.decode(quoteMintInfo.data).decimals;

      const poolKeys: LiquidityPoolKeys = {
        id: poolKeypair.publicKey,
        baseMint: new PublicKey(config.tokenAMint),
        quoteMint: new PublicKey(config.tokenBMint),
        lpMint: lpMintKeypair.publicKey,
        programId: POOL.LIQUIDITY_PROGRAM_ID_V4,
        authority,
        baseVault: baseVaultKeypair.publicKey,
        quoteVault: quoteVaultKeypair.publicKey,
        lpVault: lpVaultKeypair.publicKey,
        baseDecimals,
        quoteDecimals,
        lpDecimals: 9,
        version: 4,
        marketVersion: 3,
        nonce,
        marketId: poolKeypair.publicKey,
        marketProgramId: POOL.LIQUIDITY_PROGRAM_ID_V4,
        marketAuthority: authority,
        openOrders: poolKeypair.publicKey,
        targetOrders: poolKeypair.publicKey,
        withdrawQueue: poolKeypair.publicKey,
        lookupTableAccount: poolKeypair.publicKey,
        configId: POOL.LIQUIDITY_PROGRAM_ID_V4
      };

      const createLpMintIx = SystemProgram.createAccount({
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: lpMintKeypair.publicKey,
        space: SPL_MINT_LAYOUT.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(SPL_MINT_LAYOUT.span),
        programId: TOKEN_PROGRAM_ID
      });

      const transaction = new Transaction()
        .add(createLpMintIx)
        .add(
          SystemProgram.createAccount({
            fromPubkey: this.wallet.publicKey,
            newAccountPubkey: poolKeypair.publicKey,
            lamports: await this.connection.getMinimumBalanceForRentExemption(1024),
            space: 1024,
            programId: POOL.LIQUIDITY_PROGRAM_ID_V4,
          })
        );

      const signature = await this.connection.sendTransaction(
        transaction,
        [this.wallet, lpMintKeypair, poolKeypair]
      );
      
      await this.connection.confirmTransaction(signature);

      logger.info('Pool created successfully', {
        pool: poolKeypair.publicKey.toString(),
        lpMint: lpMintKeypair.publicKey.toString(),
        signature
      });

      return {
        pool: poolKeypair.publicKey.toString(),
        lpMint: lpMintKeypair.publicKey.toString(),
        authority: authority.toString(),
        signature,
        poolKeys
      };
    } catch (error) {
      throw new SolanaError('Pool creation failed', 'POOL_CREATE_ERROR', error as Error);
    }
  }
}