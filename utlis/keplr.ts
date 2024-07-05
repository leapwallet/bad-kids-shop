import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { log } from 'console';

export const signWithKeplr = async (
  signer: OfflineDirectSigner,
  sommelierAddress: string,
  ethAddress: string,
  starsAddress: string
) => {
  if (!window.keplr) {
    throw new Error("Please install Keplr extension")
  }
  console.log(signer)

  const chainId = "stargaze"
  await window.keplr.enable(chainId)

  if (!signer) {
    throw new Error(
      "Keplr extension is not installed or not available in this context."
    )
  }

  const accounts = await signer.getAccounts()
  console.log(signer)

  if (accounts[0].address !== sommelierAddress) {
    throw new Error(
      "Keplr account does not match the provided Stargaze address"
    )
  }

  const messageContent = {
    ethAddress: ethAddress,
    starsAddress: starsAddress,
  }


  // Serialize the message content to a string for signing
  const message = JSON.stringify(messageContent)
  console.log(chainId)
  console.log(accounts[0].address)
  console.log(message)
  console.log(window.keplr)

  // Sign the message
  const { signature } = await window.keplr.signArbitrary(
    chainId,
    accounts[0].address,
    message
  )
  console.log(signature)

  // Obtain the public key in Base64 format
  const pubKey = Buffer.from(accounts[0].pubkey).toString("base64")

  const dataString = Buffer.from(
    JSON.stringify(messageContent)
  ).toString("base64")

  // Include this dataString in the messageBundle that the function returns
  const messageBundle = {
    messageContent, // Including the original message content for clarity
    signature: signature,
    pubKey: pubKey,
    data: dataString, // Add this line
  }
  console.log(messageBundle)

  return messageBundle
}
