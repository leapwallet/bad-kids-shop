import { Toaster } from "react-hot-toast";
import { NFTs } from "../components/NFTList";
import { ListControl } from "../components/ListControl";
import { Header } from "../components/Header";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isValidAddressWithPrefix } from "../config/validateAddress";
import { isMobile } from "react-device-detect";

import CheckOnDesktop from "../public/check-on-desktop.svg";
import Image from "next/image";

export default function Home() {
  const [collection, setCollection] = useState<string | undefined>();
  const router = useRouter();

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
          <Header />
          <div className="px-10 sm:px-14 justify-center align-middle items-center self-center origin-center">
            <NFTs collection={collection} />
            <Toaster position="bottom-right" />
          </div>
        </div>
      )}
    </>
  );
}
