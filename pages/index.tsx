import { Toaster } from "react-hot-toast";
import { NFTs } from "../components/NFTList";
import { ElementsContainerDynamic, EmbeddedWalletContainerDynamic, Header } from "../components/Header";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { isValidAddressWithPrefix } from "../config/validateAddress";
import { isMobile } from "react-device-detect";
import CheckOnDesktop from "../public/check-on-desktop.svg";
import Image from "next/image";


export default function Home() {
  const [collection, setCollection] = useState<string | undefined>();
  const router = useRouter();

  const [isElementsModalOpen, setIsElementsModalOpen] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ClientAccountModal = () => {
    const ref = useRef();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      ref.current = document.querySelector("body") as unknown as undefined;
      setMounted(true);
    }, []);

    return (
      <EmbeddedWalletContainerDynamic isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} mounted={mounted} />
    )
  };

  useEffect(() => {
    if (typeof router.query.collectionAddress === "string") {
      if (isValidAddressWithPrefix(router.query.collectionAddress, "stars")) {
        setCollection(router.query.collectionAddress);
      }
    }
  }, [router.query]);

  return (
    <>
      {isMobile ? (
        <div className="h-[100vh] w-[100vw] justify-center items-center p-10">
          <Image src={CheckOnDesktop} alt="get stars" className="m-auto" />
        </div>
      ) : (
        <div>
          <Header
            openEmbeddedWalletModal={() => {
              setIsModalOpen(true);
            }}
            setIsElementsModalOpen={setIsElementsModalOpen}
          />
          <div className="px-10 sm:px-14 justify-center align-middle items-center self-center origin-center">
            <NFTs
              setIsElementsModalOpen={setIsElementsModalOpen}
              collection={collection}
            />
            <Toaster position="bottom-right" />
          </div>
          <ClientAccountModal />
          <ElementsContainerDynamic
            isOpen={isElementsModalOpen}
            setIsOpen={setIsElementsModalOpen}
          />
        </div>
      )}
    </>
  );
}
