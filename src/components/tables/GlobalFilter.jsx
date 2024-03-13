import React from "react";
import { useAsyncDebounce } from "react-table";
import { FaSearch } from "react-icons/fa";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 500);

  return (
    <div className="relative">
      <input
        type="text"
        className="rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} records...`}
      />
      <FaSearch className="absolute bottom-0 left-3 top-0 my-auto text-gray-500" />
    </div>
  );
}

export default GlobalFilter;
