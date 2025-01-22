const { 
    Connection, 
    Keypair, 
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require('@solana/web3.js');
const { 
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID 
} = require('@solana/spl-token');
const fs = require('fs');

async function createToken() {
    try {
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

        // Load your wallet keypair
        const walletSecretKey = JSON.parse(fs.readFileSync('yogurt-dev-wallet.json'));
        const payer = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));

        console.log('Creating token...');
        
        // Create new token mint
        const mint = await createMint(
            connection,
            payer,            // Payer of the transaction
            payer.publicKey,  // Account that will control the minting
            null,             // Account that will control the freezing
            9                 // Location of the decimal point
        );

        console.log('Token created successfully!');
        console.log('Token Public Key:', mint.toString());

        // Create token account to hold balance
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );

        console.log('Token account:', tokenAccount.address.toString());

        // Mint 1000 tokens
        const amount = 1000 * Math.pow(10, 9); // 1000 tokens with 9 decimal places
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            amount
        );

        console.log(`Minted ${amount} tokens to ${tokenAccount.address.toString()}`);

    } catch (error) {
        console.error('Error details:', error);
    }
}

// Run the function
createToken();