
import { Toaster } from "react-hot-toast";
import { NFTs } from '../components/NFTList';
import { ListControl } from "../components/ListControl";
import { Header } from "../components/Header"

export default function Home() {
  return (
    <div className="px-3 sm:px-14 py-8 sm:mt-16 mt-24">
      <Header />
      <ListControl />
      <NFTs />
      <Toaster position="bottom-right" />
    </div>
  );
}
