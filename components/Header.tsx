import Image from "next/image";
import BadkidsLogo from "../public/bad_kids_logo.svg";
import { FaXTwitter } from "react-icons/fa6";
import { WalletButton } from "../components/WalletButton";
import dynamic from "next/dynamic";
import Text from "./Text";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react-lite";

const ElementsContainer = dynamic(
  () =>
    import("../components/ElementsContainer").then(
      (mod) => mod.ElementsContainer
    ),
  { ssr: false }
);

const fetchBalance = async (address: string, chain: any) => {
  const res = await fetch(
    `${chain.apis?.rest?.[0].address}/cosmos/bank/v1beta1/balances/${address}`
  );
  const response = await res.json();
  const starsBalance = response.balances.find(
    (balance: any) => balance.denom === "ustars"
  );
  return starsBalance?.amount ?? "0";
};

export function Header() {
  const { address, chain } = useChain("stargaze");

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (address) {
      fetchBalance(address, chain).then(setBalance);
    }
  }, [address]);

  return (
    <section className="flex flex-wrap gap-4 items-center justify-between mb-16 bg-black-100 shadow-lg  p-4 fixed top-0 left-0 right-0 z-50">
      <Image src={BadkidsLogo} alt="bad-kids" />
      <div className="flex gap-3">
        <button
          onClick={() => window.open("http://twitter.com/badkidsart", "_blank")}
          className="flex flex-row gap-2 max-h-[38px] items-center justify-between border border-white-100 rounded-3xl px-5 py-2"
        >
          <FaXTwitter color="#FFF" size={16} />
          <Text size="sm" color="text-white-100 font-bold">
            Follow
          </Text>
        </button>

        <ElementsContainer
          icon="https://assets.leapwallet.io/stars.png"
          title="Get STARS"
          subtitle={`Balance: ${balance ?? "0"} STARS`}
        />
        <WalletButton />
      </div>
    </section>
  );
}
