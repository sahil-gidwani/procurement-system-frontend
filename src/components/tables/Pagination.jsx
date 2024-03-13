import React from "react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";

const Pagination = ({
  state,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  gotoPage,
  pageCount,
  setPageSize,
  pageOptions,
}) => {
  return (
    <div className="mx-4 mt-4 flex flex-col items-center justify-between gap-4 py-3 sm:mx-6 sm:px-6 lg:mx-8 lg:flex-row lg:px-8">
      <div>
        <label>
          <span className="sr-only">Items Per Page</span>
          <select
            className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={state.pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <span className="text-sm text-gray-700">
          Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
          <span className="font-medium">{pageOptions.length}</span>
        </span>
      </div>
      <div>
        <nav
          className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">First</span>
            <HiOutlineChevronDoubleLeft
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
          <button
            className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Previous</span>
            <HiOutlineChevronLeft
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Next</span>
            <HiOutlineChevronRight
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
          <button
            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Last</span>
            <HiOutlineChevronDoubleRight
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
