import { Keypair } from '@solana/web3.js';
import { PoolCreator } from '../pool-creator';
import { POOL } from '../../utils/constants';

describe('PoolCreator', () => {
  let poolCreator: PoolCreator;
  let wallet: Keypair;

  beforeEach(() => {
    wallet = Keypair.generate();
    poolCreator = new PoolCreator(wallet);
  });

  it('should create a pool with correct configuration', async () => {
    const config = {
      tokenAMint: Keypair.generate().publicKey.toString(),
      tokenBMint: POOL.WRAPPED_SOL_MINT.toString()
    };

    const result = await poolCreator.createPool(config);

    expect(result.pool).toBeDefined();
    expect(result.lpMint).toBeDefined();
    expect(result.authority).toBeDefined();
    expect(result.signature).toBeDefined();
  });
});