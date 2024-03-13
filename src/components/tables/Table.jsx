import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { CSVLink } from "react-csv";
import { MdOutlineFileDownload } from "react-icons/md";
import { SortIcon, SortUpIcon, SortDownIcon } from "./shared/Icons";
import GlobalFilter from "./GlobalFilter";
import ColumnSelector from "./ColumnSelector";
import Pagination from "./Pagination";

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        // eslint-disable-next-line array-callback-return
        hiddenColumns: columns.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const csvData = React.useMemo(() => {
    const csvData = [];
    // eslint-disable-next-line array-callback-return
    data.map((row) => {
      let data = {};
      for (let i = 0; i < columns.length; i++) {
        data[columns[i].Header] = row[columns[i].accessor];
      }
      csvData.push(data);
    });
    return csvData;
  }, [data, columns]);

  return (
    <div className="container mx-auto my-12">
      {/* Global Filter, Column Filters and Column Selector */}
      <div className="mx-4 mt-4 flex flex-col items-center gap-4 sm:mx-6 sm:px-6 lg:mx-8 lg:flex-row lg:justify-between lg:px-8">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="sm:flex sm:gap-x-2">
          {headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column) =>
              column.Filter ? (
                <div className="mt-2 sm:mt-0" key={column.id}>
                  {column.render("Filter")}
                </div>
              ) : null,
            ),
          )}
        </div>
        <ColumnSelector
          allColumns={allColumns}
          getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
        />
        <CSVLink
          className="flex max-w-max items-center space-x-1 rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-700"
          filename="exported-data.csv"
          data={csvData}
        >
          <span>Export</span>
          <MdOutlineFileDownload />
        </CSVLink>
      </div>
      {/* Table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 mx-4 overflow-x-auto sm:mx-6 lg:mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow-lg sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps(),
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {column.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="h-4 w-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="divide-y divide-gray-200 bg-white"
                >
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="whitespace-nowrap px-6 py-4"
                              role="cell"
                            >
                              {cell.column.Cell.name === "defaultRenderer" ? (
                                <div className="text-sm text-gray-500">
                                  {cell.render("Cell")}
                                </div>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <Pagination
        state={state}
        gotoPage={gotoPage}
        pageCount={pageCount}
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageOptions={pageOptions}
        setPageSize={setPageSize}
      />
    </div>
  );
}

export default Table;
