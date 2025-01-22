const { 
    Connection, 
    Keypair, 
    PublicKey, 
    SystemProgram, 
    Transaction,
    sendAndConfirmTransaction
} = require('@solana/web3.js');
const { 
    TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
} = require('@solana/spl-token');
const { Liquidity, Market } = require('@raydium-io/raydium-sdk');
const Decimal = require('decimal.js');
const { BN } = require('bn.js');
const fs = require('fs');

// Raydium Devnet Program IDs
const RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = new PublicKey('9rpQHSyFVM1dkkHFQ2TtTzPEW7DVmEyPmN8wVniqJtuC');
const SERUM_PROGRAM_ID_V3 = new PublicKey('DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY');

async function setupRaydiumPool() {
    try {
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        
        // Load wallet
        const walletSecretKey = JSON.parse(fs.readFileSync('yogurt-dev-wallet.json'));
        const wallet = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));

        // Your token mint
        const tokenMint = new PublicKey('Pa6sGCCedgGD1vxyEuhyRBeVFhjJchx5mSrSbaoPHWY');
        
        // WSOL mint (Wrapped SOL - used for trading pairs)
        const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

        console.log('Setting up market...');

        // Create market
        const marketId = await Market.makeCreateMarketInstructions({
            connection,
            wallet: wallet.publicKey,
            baseToken: tokenMint,
            quoteToken: WSOL_MINT,
            baseMint: tokenMint,
            quoteMint: WSOL_MINT,
            programId: SERUM_PROGRAM_ID_V3,
        });

        console.log('Market created:', marketId.toString());

        // Pool Configuration
        const poolConfig = {
            startTime: Date.now() / 1000, // Current time
            baseDecimals: 9, // Your token decimals
            quoteDecimals: 9, // WSOL decimals
            tickSpacing: 8, // Price tick spacing
            baseAmount: new BN('1000000000000'), // Initial base token amount (1000 tokens)
            quoteAmount: new BN('100000000000'), // Initial SOL amount (100 SOL)
        };

        console.log('Creating liquidity pool...');

        // Create liquidity pool
        const poolInfo = await Liquidity.makeCreatePoolInstructions({
            connection,
            programId: RAYDIUM_LIQUIDITY_PROGRAM_ID_V4,
            marketId: marketId,
            baseMint: tokenMint,
            quoteMint: WSOL_MINT,
            baseAmount: poolConfig.baseAmount,
            quoteAmount: poolConfig.quoteAmount,
            startTime: poolConfig.startTime,
            wallet: wallet.publicKey,
        });

        // Get token accounts
        const baseTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            tokenMint,
            wallet.publicKey
        );

        const quoteTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            WSOL_MINT,
            wallet.publicKey
        );

        console.log('Adding initial liquidity...');

        // Add initial liquidity
        const addLiquidityIx = await Liquidity.makeAddLiquidityInstructions({
            poolInfo,
            userKeys: {
                tokenAccounts: [baseTokenAccount.address, quoteTokenAccount.address],
                owner: wallet.publicKey,
            },
            baseAmount: poolConfig.baseAmount,
            quoteAmount: poolConfig.quoteAmount,
        });

        const transaction = new Transaction();
        transaction.add(...addLiquidityIx);

        // Send transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet]
        );

        console.log('Liquidity pool setup complete!');
        console.log('Pool ID:', poolInfo.id.toString());
        console.log('Transaction signature:', signature);

        return {
            marketId: marketId,
            poolId: poolInfo.id,
            signature: signature
        };

    } catch (error) {
        console.error('Error setting up pool:', error);
        throw error;
    }
}

setupRaydiumPool().then(console.log).catch(console.error);