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
    createMint,
    mintTo
} = require('@solana/spl-token');
const fs = require('fs');

async function createSimplePool() {
    try {
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        
        // Load your wallet
        const walletSecretKey = JSON.parse(fs.readFileSync('yogurt-dev-wallet.json'));
        const wallet = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));

        // Your token mint (YO token)
        const tokenMint = new PublicKey('Pa6sGCCedgGD1vxyEuhyRBeVFhjJchx5mSrSbaoPHWY');

        // Create pool token mint
        console.log('Creating pool token mint...');
        const poolTokenMint = await createMint(
            connection,
            wallet,
            wallet.publicKey,
            null,
            9
        );

        console.log('Pool Token Mint created:', poolTokenMint.toString());

        // Create token accounts for the pool
        console.log('Creating token accounts...');
        const yogurtTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            tokenMint,
            wallet.publicKey
        );

        const poolTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            poolTokenMint,
            wallet.publicKey
        );

        // Mint some pool tokens
        console.log('Minting initial pool tokens...');
        const poolTokenAmount = 1000000000000; // 1000 tokens with 9 decimals
        await mintTo(
            connection,
            wallet,
            poolTokenMint,
            poolTokenAccount.address,
            wallet,
            poolTokenAmount
        );

        console.log('Simple pool setup complete!');
        console.log('Pool Token Mint:', poolTokenMint.toString());
        console.log('Pool Token Account:', poolTokenAccount.address.toString());
        console.log('YO Token Account:', yogurtTokenAccount.address.toString());

        return {
            poolTokenMint: poolTokenMint.toString(),
            poolTokenAccount: poolTokenAccount.address.toString(),
            yogurtTokenAccount: yogurtTokenAccount.address.toString()
        };

    } catch (error) {
        console.error('Error creating pool:', error);
        throw error;
    }
}

createSimplePool().then(console.log).catch(console.error);