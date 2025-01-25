import { Keypair } from '@solana/web3.js';
import { TokenCreator } from '../token-creator';
import { TOKEN } from '../../utils/constants';

describe('TokenCreator', () => {
  let tokenCreator: TokenCreator;
  
  beforeEach(() => {
    const wallet = Keypair.generate();
    tokenCreator = new TokenCreator(wallet);
  });

  it('should create a token with specified config', async () => {
    const config = {
      decimals: TOKEN.DECIMALS,
      initialSupply: TOKEN.INITIAL_MINT_AMOUNT
    };

    const result = await tokenCreator.createToken(config);
    
    expect(result.mint).toBeDefined();
    expect(result.tokenAccount).toBeDefined();
    expect(result.amount).toBe(config.initialSupply * Math.pow(10, config.decimals));
  });
});