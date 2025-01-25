import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import logger from '../utils/logger';

function setupDevEnvironment() {
  try {
    // Generate development wallet
    const wallet = Keypair.generate();
    fs.writeFileSync(
      'config/yogurt-dev-wallet.json',
      JSON.stringify(Array.from(wallet.secretKey))
    );

    // Create necessary directories
    const dirs = ['logs', 'config'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });

    logger.info('Development environment setup completed', {
      wallet: wallet.publicKey.toString()
    });
  } catch (error) {
    logger.error('Failed to setup development environment:', error);
    process.exit(1);
  }
}