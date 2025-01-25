import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import { NETWORK, TOKEN } from '../utils/constants';
import { SolanaError } from '../utils/error-handler';
import { TransferConfig } from '../types';
import logger from '../utils/logger';

export class TokenTransfer {
  private connection: Connection;

  constructor(private wallet: Keypair) {
    this.connection = new Connection(NETWORK.DEVNET_URL, NETWORK.CONFIRMATION_STRATEGY);
  }

  async transfer(mint: PublicKey, config: TransferConfig) {
    try {
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.wallet,
        mint,
        this.wallet.publicKey
      );

      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.wallet,
        mint,
        new PublicKey(config.recipient)
      );

      await transfer(
        this.connection,
        this.wallet,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        this.wallet,
        config.amount * Math.pow(10, TOKEN.DECIMALS)
      );

      logger.info('Transfer completed', {
        amount: config.amount,
        recipient: config.recipient
      });
    } catch (error) {
      throw new SolanaError('Transfer failed', 'TRANSFER_ERROR', error as Error);
    }
  }
}