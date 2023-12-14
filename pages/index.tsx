
import { Toaster } from "react-hot-toast";
import { NFTs } from '../components/NFTList';
import { ListControl } from "../components/ListControl";
import { Header } from "../components/Header"
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isValidAddressWithPrefix } from "../config/validateAddress";

export default function Home() {
  const [collection, setCollection] = useState<string | undefined>();
  const router = useRouter()


  useEffect(() => {
    if(typeof router.query.collectionAddress === "string"){
      if(isValidAddressWithPrefix(router.query.collectionAddress, "stars")){
         setCollection(router.query.collectionAddress)
      }
    }
  }, [router.query])
  return (
    <div className="px-3 sm:px-14 py-8 sm:mt-16 mt-24">
      <Header />
      <ListControl />
      <NFTs collection={collection}/>
      <Toaster position="bottom-right" />
    </div>
  );
}
