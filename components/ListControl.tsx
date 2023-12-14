import Image from "next/image";
import Search from "../public/search.svg";
import Sort from "../public/sort.svg";

import Text from "../components/Text";



export function ListControl() {
  return <section className="mb-8 gap-3 flex flex-wrap justify-between w-full">
    <div>
      <Text size="md">Collection of 9,999 bad drawings of kids. </Text>
      <Text size="md">
        Some people like the pictures and some people are bad kids
        themselves.
      </Text>
    </div>
    <div className="flex items-center ml-auto justify-between">
      <button
        className="flex items-center bg-black-100 px-4 py-2 rounded-3xl mr-2"
        style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
      >
        <Image src={Search} height={16} width={16} alt="search" />
        <Text className="ml-2 font-bold">Token ID</Text>
      </button>
      <button className="flex items-center bg-black-100 px-4 py-2 rounded-3xl">
        <Image src={Sort} height={16} width={16} alt="sort" />
        <Text
          className="ml-2 font-bold"
          style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
        >
          Sort
        </Text>
      </button>
    </div>
  </section>;
}