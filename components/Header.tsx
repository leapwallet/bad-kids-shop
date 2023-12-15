import Image from "next/image";
import BadkidsLogo from "../public/bad_kids_logo.svg";
import { FaBars, FaXTwitter } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";

import { WalletButton } from "../components/WalletButton";
import dynamic from "next/dynamic";
import Text from "./Text";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react-lite";
import { formatNumber, fromSmall } from "../config/mathutils";

export const ElementsContainerDynamic = dynamic(
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="flex flex-wrap gap-x-3  gap-y-3 fixed backdrop-blur-md bg-[#212121DE]  items-center justify-between px-10 py-4 top-0 left-0 right-0 z-10">
      <Image src={BadkidsLogo} alt="bad-kids" className="flex" />

      <button className="sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {!isMenuOpen ? (
          <FaBars color="#FFF" size={16} />
        ) : (
          <MdOutlineClose color="#FFF" size={16} />
        )}
      </button>

      <div id="nav-menu" className={` md:block ${isMenuOpen ? "" : "hidden"}`}>
        <div className="flex flex-row gap-3 flex-wrap">
          <button
            onClick={() =>
              window.open("http://twitter.com/badkidsart", "_blank")
            }
            className="flex flex-row gap-2  h-10 items-center justify-between border border-white-100 rounded-3xl px-5 py-2"
          >
            <FaXTwitter color="#FFF" size={16} />
            <Text size="sm" color="text-white-100 font-bold">
              Follow
            </Text>
          </button>

          <ElementsContainerDynamic
            icon="https://assets.leapwallet.io/stars.png"
            title="Get STARS"
            subtitle={`Balance: ${formatNumber(
              fromSmall(balance ?? "0").decimalPlaces(3)
            )} STARS`}
          />
          <WalletButton balance={balance} />
        </div>
      </div>
    </section>
  );
}
