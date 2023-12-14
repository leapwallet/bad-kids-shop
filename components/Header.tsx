import Image from "next/image";
import BadkidsLogo from "../public/bad_kids_logo.svg";

import StargazeLogo from "../public/stargaze-logo.svg";
import Text from "../components/Text";

import { WalletButton } from "../components/WalletButton";
import { FaXTwitter } from "react-icons/fa6";

export function Header() {
  return (
    <section className="flex flex-wrap gap-4 items-center justify-between mb-16 bg-black-100 shadow-lg  p-4 fixed top-0 left-0 right-0 z-50">
      <Image src={BadkidsLogo} alt="bad-kids" />
      <div className="flex gap-3">
        <button
          onClick={() => window.open("http://twitter.com/badkidsart", "_blank")}
          className="flex gap-2 items-center justify-between border border-white-100 rounded-3xl px-5 py-2"
        >
          <FaXTwitter color="#FFF" size={16} />
          <Text size="sm" color="text-white-100 font-bold">
            Follow
          </Text>
        </button>

        <button
          onClick={() =>
            window.open("https://cosmos.leapwallet.io/transact/swap", "_blank")
          }
          className="flex gap-2 items-center justify-between border border-white-100 rounded-3xl px-5 py-2"
        >
          <Image src={StargazeLogo} height={16} width={16} alt="get stars" />
          <Text size="sm" color="text-white-100 font-bold">
            Get Stars
          </Text>
        </button>
        <WalletButton />
      </div>
    </section>
  );
}
