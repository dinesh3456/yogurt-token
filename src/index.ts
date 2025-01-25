import { WalletManager } from './utils/wallet';
import { TokenCreator } from './token/token-creator';
import { PoolCreator } from './pool/pool-creator';
import { TOKEN, POOL } from './utils/constants';
import { handleError } from './utils/error-handler';
import logger from './utils/logger';

async function main() {
  try {
    const wallet = await WalletManager.loadWallet('config/yogurt-dev-wallet.json');
    
    // Create token
    const tokenCreator = new TokenCreator(wallet);
    const tokenResult = await tokenCreator.createToken({
      decimals: TOKEN.DECIMALS,
      initialSupply: TOKEN.INITIAL_MINT_AMOUNT
    });
    
    // Create pool
    const poolCreator = new PoolCreator(wallet);
    const poolResult = await poolCreator.createPool({
      tokenAMint: tokenResult.mint,
      tokenBMint: POOL.WRAPPED_SOL_MINT.toString()
    });

    logger.info('Setup completed successfully', {
      token: tokenResult,
      pool: poolResult
    });

  } catch (error) {
    handleError(error as Error, 'Main Process');
  }
}

if (require.main === module) {
  main();
}
