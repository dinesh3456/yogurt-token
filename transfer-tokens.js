const { 
    Connection, 
    Keypair, 
    PublicKey 
} = require('@solana/web3.js');
const { 
    getOrCreateAssociatedTokenAccount,
    transfer,
} = require('@solana/spl-token');
const fs = require('fs');

async function transferTokens() {
    try {
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

        // Load your wallet
        const senderSecretKey = JSON.parse(fs.readFileSync('yogurt-dev-wallet.json'));
        const senderWallet = Keypair.fromSecretKey(new Uint8Array(senderSecretKey));

        // Create a new recipient wallet
        const recipientWallet = Keypair.generate();
        
        // Your token mint address from previous creation
        const mint = new PublicKey('Pa6sGCCedgGD1vxyEuhyRBeVFhjJchx5mSrSbaoPHWY');

        console.log('Getting sender token account...');
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderWallet,
            mint,
            senderWallet.publicKey
        );

        console.log('Creating recipient token account...');
        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderWallet,
            mint,
            recipientWallet.publicKey
        );

        console.log('Sending tokens...');
        const transferAmount = 100 * Math.pow(10, 9); // 100 tokens
        await transfer(
            connection,
            senderWallet,
            senderTokenAccount.address,
            recipientTokenAccount.address,
            senderWallet,
            transferAmount
        );

        console.log(`Transferred ${transferAmount} tokens to ${recipientTokenAccount.address.toString()}`);
        console.log(`Recipient wallet public key: ${recipientWallet.publicKey.toString()}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

transferTokens();