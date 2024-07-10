import { MainWalletBase, WalletClient } from "@cosmos-kit/core";

export const signWithCosmosWallet = async (
    mainWallet: MainWalletBase | undefined,
    client: WalletClient | undefined,
    ethAddress: string,
    starsAddress: string
) => {
    if (!mainWallet) {
        throw new Error("Please install/connect to a Cosmos Wallet");
    }

    if (!client) {
        throw new Error(
            `Please install a ${mainWallet.walletPrettyName} Wallet`
        );
    }

    const chainId = "stargaze";
    if (client.enable) {
        await client.enable(chainId);
    }

    if (typeof client.getOfflineSigner !== "function") {
        throw new Error(
            `${mainWallet.walletPrettyName} extension is not installed or not available in this context.`
        );
    }

    const signer = await client.getOfflineSigner(chainId);
    const accounts = await signer.getAccounts();

    if (accounts[0].address !== starsAddress) {
        throw new Error(
            `${mainWallet.walletPrettyName} account does not match the provided Stargaze address`
        );
    }

    const messageContent = {
        ethAddress: ethAddress,
        starsAddress: starsAddress,
    };

    // Serialize the message content to a string for signing
    const message = JSON.stringify(messageContent);

    if (!client.signArbitrary) {
        throw new Error(
            `${mainWallet.walletPrettyName} does not support signing arbitrary messages`
        );
    }

    // Sign the message
    const { signature } = await client.signArbitrary(
        chainId,
        accounts[0].address,
        message
    );

    // Obtain the public key in Base64 format
    const pubKey = Buffer.from(accounts[0].pubkey).toString("base64");

    const dataString = Buffer.from(JSON.stringify(messageContent)).toString(
        "base64"
    );

    return {
        messageContent, // Including the original message content for clarity
        signature: signature,
        pubKey: pubKey,
        data: dataString, // Add this line
    };
};