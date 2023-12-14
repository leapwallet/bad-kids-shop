import Image from "next/image";
import Search from "../public/search.svg";
import Sort from "../public/sort.svg";

import Text from "../components/Text";

export function ListControl({
  searchTerm,
  handleSearchChange,
  sortOrder,
  handleSortChange,
}: {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortOrder: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <section className="gap-3 flex mx-12 flex-wrap justify-between sm:!p-6">
      <div>
        <Text size="md">Collection of 9,999 bad drawings of kids. </Text>
        <Text size="md">
          Some people like the pictures and some people are bad kids themselves.
        </Text>
      </div>

      <div className="flex items-center ml-auto justify-between">
        <button
          className="flex items-center bg-black-100 px-4 py-2 rounded-3xl mr-2"
          style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
        >
          <Image src={Search} height={16} width={16} alt="search" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2 font-bold text-sm text-white-100 bg-black-100 border-none outline-none"
            placeholder="Token ID"
          />
        </button>
        <button
          className="flex items-center bg-black-100 px-4 py-2 rounded-3xl"
          style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
        >
          <Image src={Sort} height={16} width={16} alt="sort" />
          <select
            className="ml-2 font-bold text-white-100 text-sm bg-black-100 border-none outline-none"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="none">Sort by price</option>
            <option value="low">Low to high</option>
            <option value="high">High to low</option>
          </select>
        </button>
      </div>
    </section>
  );
}
