
import Image from "next/image";
import BadkidsLogo from "../public/bad_kids_logo.svg";




import { WalletButton } from "../components/WalletButton";
import dynamic from "next/dynamic";
const ElementsContainer = dynamic(() => import('../components/ElementsContainer').then((mod) => mod.ElementsContainer), { ssr: false })



export function Header() {
  return <section className="flex flex-wrap gap-4 items-center justify-between mb-16 bg-black-100 shadow-lg p-4 fixed top-0 left-0 right-0 z-50">
    <Image src={BadkidsLogo} alt="bad-kids" />
    <div className="flex gap-3">
      <ElementsContainer />
      <WalletButton />
    </div>
  </section>;
}
