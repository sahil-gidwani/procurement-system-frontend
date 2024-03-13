import React, { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

const ColumnSelector = ({ allColumns, getToggleHideAllColumnsProps }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return <input type="checkbox" ref={resolvedRef} {...rest} />;
    },
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        <span>Column Visibility</span>
        {showDropdown ? <MdArrowDropUp /> : <MdArrowDropDown />}
      </button>
      {showDropdown && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border bg-white text-sm shadow-lg">
          <div className="flex items-center px-4 py-2">
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />
            <span className="ml-2">Toggle All</span>
          </div>
          <div className="border-t"></div>
          {allColumns.map((column) => (
            <div key={column.id} className="px-4 py-2">
              <label className="flex items-center truncate">
                <input
                  type="checkbox"
                  {...column.getToggleHiddenProps()}
                  className="mr-2"
                />
                {column.id}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;
