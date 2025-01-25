import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import { SolanaError } from './error-handler';
import { ERRORS } from './constants';

export class WalletManager {
  static async loadWallet(path: string): Promise<Keypair> {
    try {
      const walletSecretKey = JSON.parse(fs.readFileSync(path, 'utf-8'));
      return Keypair.fromSecretKey(new Uint8Array(walletSecretKey));
    } catch (error) {
      throw new SolanaError(
        ERRORS.WALLET.LOAD,
        'WALLET_LOAD_ERROR',
        error as Error
      );
    }
  }
}
