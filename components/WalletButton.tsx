
import WalletIcon from "../public/account_balance_wallet.svg";
import { useChain } from "@cosmos-kit/react";
import { sliceAddress } from "../config/formatAddress"
import Image from "next/image";
import Text  from "./Text";


export function WalletButton(){
  const {
    openView,
    status,
    address,
  } = useChain("stargaze");
  let text = "Connect Wallet";
  if (status === "Connected") {
    text = sliceAddress(address);
  } else if (status === "Connecting") {
    text = "Connecting...";
  }

  return (
    <div>
      <button
        onClick={() => openView()}
        className="flex items-center gap-2 justify-between border border-white-100 rounded-3xl px-5 py-2"
      >
        <Image src={WalletIcon} alt="wallet" height={16} width={16} />
        <Text size="sm" color="text-white-100 font-bold">
          {text}
        </Text>
      </button>
    </div>
  );
}