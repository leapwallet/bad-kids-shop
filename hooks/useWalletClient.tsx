import { useWalletClient } from "@cosmos-kit/react";
import { useMemo } from "react";

export const useElementsWalletClient = (): any => {
  const { client } = useWalletClient();
  const walletClient: any = useMemo(() => {
    return {
      enable: (chainIds: string | string[]) => {
        return client!.enable!(chainIds);
      },
      getAccount: async (chainId: string) => {
        await client!.enable!(chainId);
        const result = await client!.getAccount!(chainId);
        return {
          bech32Address: result.address,
          pubKey: result.pubkey,
          isNanoLedger: result.isNanoLedger,
        };
      },
      getSigner: async (chainId: string) => {
        if (!client) {
          throw new Error("Wallet client not initialized");
          return;
        }
        const signer = await client!.getOfflineSignerDirect(chainId);
        const aminoSigner = await client!.getOfflineSignerAmino!(chainId);

        return {
          signDirect: async (signerAddress: string, signDoc: any) => {
            const result = await signer.signDirect(signerAddress, signDoc);
            return {
              signature: new Uint8Array(
                Buffer.from(result.signature.signature, "base64")
              ),
              signed: result.signed,
            };
          },
          signAmino: async (address: string, signDoc: any) => {
            const res = await aminoSigner.signAmino(chainId, address, signDoc);
            return {
              signature: new Uint8Array.from(
                Buffer.from(res.signature.signature, "base64")
              ),
              signed: res.signed,
            };
          },
        };
      },
    };
  }, [client]);

  return walletClient;
};
