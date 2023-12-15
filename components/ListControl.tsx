import Image from "next/image";
import Search from "../public/search.svg";
import Sort from "../public/sort.svg";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
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
  handleSortChange: (e: string) => void;
}) {
  return (
    <section className=" w-[90vw] gap-3 flex-row flex flex-wrap justify-between sm:!p-6">
      <div className="flex flex-col flex-wrap">
        <Text size="md">Collection of 9,999 bad drawings of kids. </Text>
        <Text size="md">
          Some people like the pictures and some people are bad kids themselves.
        </Text>
      </div>
      <div className="flex items-center ml-auto flex-wrap gap-3 justify-center ">
        <button
          className="flex items-center bg-gray-950 px-4 py-2 rounded-3xl mr-2"
          style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
        >
          <Image src={Search} height={16} width={16} alt="search" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2 font-bold text-sm text-white-100 bg-gray-950 border-none outline-none"
            placeholder="Token ID"
          />
        </button>

        {sortOrder === "low" && (
          <button
            className={`flex items-center bg-gray-950 px-4 py-2 rounded-3xl`}
            style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
            onClick={() => handleSortChange("high")}
          >
            <FaArrowDownLong color="#FFF" />
            <span className="ml-2 font-bold text-sm text-white-100">
              Price low to high
            </span>
          </button>
        )}
        {sortOrder === "high" && (
          <button
            className={`flex items-center bg-gray-950 px-4 py-2 rounded-3xl`}
            style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
            onClick={() => handleSortChange("low")}
          >
            <FaArrowUpLong color="#FFF" />
            <span className="ml-2 font-bold text-sm text-white-100">
              Price high to low
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
