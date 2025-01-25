import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { NETWORK, TOKEN } from '../utils/constants';
import { SolanaError } from '../utils/error-handler';
import { TokenConfig } from '../types';
import logger from '../utils/logger';

export class TokenCreator {
  private connection: Connection;

  constructor(private wallet: Keypair) {
    this.connection = new Connection(NETWORK.DEVNET_URL, NETWORK.CONFIRMATION_STRATEGY);
  }

  async createToken(config: TokenConfig) {
    try {
      logger.info('Creating new token...');
      
      const mint = await createMint(
        this.connection,
        this.wallet,
        this.wallet.publicKey,
        null,
        config.decimals
      );

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.wallet,
        mint,
        this.wallet.publicKey
      );

      const amount = config.initialSupply * Math.pow(10, config.decimals);
      await mintTo(
        this.connection,
        this.wallet,
        mint,
        tokenAccount.address,
        this.wallet,
        amount
      );

      logger.info('Token created successfully', {
        mint: mint.toString(),
        tokenAccount: tokenAccount.address.toString()
      });

      return {
        mint: mint.toString(),
        tokenAccount: tokenAccount.address.toString(),
        amount
      };
    } catch (error) {
      throw new SolanaError('Token creation failed', 'TOKEN_CREATE_ERROR', error as Error);
    }
  }
}
